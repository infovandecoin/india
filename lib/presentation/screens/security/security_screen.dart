import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/chakra_spinner.dart';
import '../../../core/widgets/vdc_button.dart';
import '../../../core/widgets/vdc_card.dart';
import '../../providers/app_state_providers.dart';
import '../../providers/core_providers.dart';

class SecurityScreen extends ConsumerStatefulWidget {
  const SecurityScreen({super.key});

  @override
  ConsumerState<SecurityScreen> createState() => _SecurityScreenState();
}

class _SecurityScreenState extends ConsumerState<SecurityScreen> {
  bool _phraseRevealed = false;
  List<String> _words = [];
  bool _biometricEnabled = true;

  void _showRecoveryPhraseModal() async {
    final user = ref.read(authStateProvider).value;
    if (user == null) return;

    final repo = ref.read(profileRepositoryProvider);
    final phrase = await repo.generateRecoveryPhrase(user.uid);
    setState(() => _words = phrase);

    if (!mounted) return;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.darkSurfaceElevated,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) {
          return Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('12-Word Recovery Phrase', style: AppTypography.h3),
                    IconButton(
                      icon: const Icon(Icons.close),
                      onPressed: () => Navigator.pop(ctx),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                const Text(
                  'Write these 12 words down in exact sequence. Never share them with anyone.',
                  style: TextStyle(color: AppColors.textSecondaryDark, fontSize: 12),
                ),
                const SizedBox(height: 20),

                // 12-Word Grid
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: List.generate(_words.length, (idx) {
                    return Container(
                      width: (MediaQuery.of(context).size.width - 72) / 3,
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
                      decoration: BoxDecoration(
                        color: AppColors.darkSurface,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: AppColors.darkBorder),
                      ),
                      child: Text(
                        '${idx + 1}. ${_words[idx]}',
                        style: const TextStyle(
                          color: AppColors.gold,
                          fontWeight: FontWeight.w700,
                          fontSize: 12,
                          fontFamily: 'monospace',
                        ),
                      ),
                    );
                  }),
                ),

                const SizedBox(height: 20),

                VdcButton(
                  text: 'Copy All 12 Words',
                  icon: Icons.copy,
                  variant: VdcButtonVariant.secondary,
                  onPressed: () {
                    Clipboard.setData(ClipboardData(text: _words.join(' ')));
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Recovery phrase copied to clipboard!')),
                    );
                  },
                ),
                const SizedBox(height: 10),
                VdcButton(
                  text: 'Confirm & Complete L2 Backup',
                  onPressed: () async {
                    await repo.verifyRecoveryPhrase(user.uid, _words);
                    ref.invalidate(authStateProvider);
                    if (ctx.mounted) Navigator.pop(ctx);
                    if (mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Level 2 Security Backup Confirmed! 🛡️'),
                          backgroundColor: AppColors.greenDark,
                        ),
                      );
                    }
                  },
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.darkBackground,
      appBar: AppBar(
        title: const Text('Security & Cryptographic Vault'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // BIP-39 Cryptographic Phrase Card
            VdcCard(
              padding: const EdgeInsets.all(18),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: AppColors.gold.withOpacity(0.15),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.key, color: AppColors.gold, size: 22),
                      ),
                      const SizedBox(width: 12),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('BIP-39 Mnemonic Seed Phrase', style: AppTypography.h3),
                            SizedBox(height: 2),
                            Text(
                              'Standard 128-bit entropy recovery words',
                              style: TextStyle(color: AppColors.textMutedDark, fontSize: 11),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  const Text(
                    'Your recovery phrase secures non-custodial ownership of your pioneer identity and simulated rewards.',
                    style: TextStyle(color: AppColors.textSecondaryDark, fontSize: 12, height: 1.4),
                  ),
                  const SizedBox(height: 16),
                  VdcButton(
                    text: 'View Recovery Phrase',
                    variant: VdcButtonVariant.secondary,
                    onPressed: _showRecoveryPhraseModal,
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Biometric Toggle Card
            VdcCard(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: Row(
                children: [
                  const Icon(Icons.fingerprint, color: AppColors.gold, size: 24),
                  const SizedBox(width: 14),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Biometric Fast-Unlock', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 14)),
                        Text('Use fingerprint or Face ID to unlock', style: TextStyle(color: AppColors.textMutedDark, fontSize: 11)),
                      ],
                    ),
                  ),
                  Switch(
                    value: _biometricEnabled,
                    activeColor: AppColors.gold,
                    onChanged: (val) => setState(() => _biometricEnabled = val),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Active Hardware Sessions
            const Text('Active Device Sessions', style: AppTypography.h3),
            const SizedBox(height: 12),

            _buildSessionTile('Android 14 (Google Pixel)', 'Current Device • New Delhi, IN', true),
            const SizedBox(height: 10),
            _buildSessionTile('Flutter Web (Chrome)', 'Active 2h ago • Bengaluru, IN', false),

            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildSessionTile(String device, String details, bool isCurrent) {
    return VdcCard(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      child: Row(
        children: [
          Icon(
            isCurrent ? Icons.phone_android : Icons.laptop,
            color: isCurrent ? AppColors.greenLight : AppColors.textMutedDark,
            size: 24,
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  device,
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 13),
                ),
                const SizedBox(height: 2),
                Text(details, style: const TextStyle(color: AppColors.textMutedDark, fontSize: 11)),
              ],
            ),
          ),
          if (!isCurrent) ...[
            TextButton(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Session revoked.')),
                );
              },
              child: const Text('Revoke', style: TextStyle(color: AppColors.error, fontSize: 12)),
            ),
          ],
        ],
      ),
    );
  }
}

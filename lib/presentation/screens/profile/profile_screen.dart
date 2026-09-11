import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/vdc_button.dart';
import '../../../core/widgets/vdc_card.dart';
import '../../providers/app_state_providers.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(authStateProvider).value;

    return Scaffold(
      backgroundColor: AppColors.darkBackground,
      appBar: AppBar(
        title: const Text('VandeID Identity'),
        actions: [
          IconButton(
            icon: const Icon(Icons.security, color: AppColors.gold),
            tooltip: 'Security Center',
            onPressed: () => context.push('/security'),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Pioneer Identity Card
            VdcCard(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  CircleAvatar(
                    radius: 36,
                    backgroundColor: AppColors.gold.withOpacity(0.2),
                    child: Text(
                      (user?.displayName ?? 'P')[0].toUpperCase(),
                      style: const TextStyle(
                        color: AppColors.gold,
                        fontWeight: FontWeight.w800,
                        fontSize: 28,
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    user?.displayName ?? 'Pioneer',
                    style: AppTypography.h2.copyWith(color: Colors.white),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    user?.email ?? user?.phone ?? 'Pioneer Member',
                    style: const TextStyle(color: AppColors.textSecondaryDark, fontSize: 13),
                  ),
                  const SizedBox(height: 14),

                  // Referral Code Pill
                  InkWell(
                    onTap: () {
                      Clipboard.setData(ClipboardData(text: user?.referralCode ?? 'VDC-PIONEER'));
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Referral code copied to clipboard!')),
                      );
                    },
                    borderRadius: BorderRadius.circular(10),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      decoration: BoxDecoration(
                        color: AppColors.darkSurfaceElevated,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: AppColors.darkBorder),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.share, size: 16, color: AppColors.gold),
                          const SizedBox(width: 8),
                          Text(
                            user?.referralCode ?? 'VDC-PIONEER',
                            style: const TextStyle(
                              color: AppColors.gold,
                              fontWeight: FontWeight.w700,
                              fontSize: 13,
                              letterSpacing: 1,
                            ),
                          ),
                          const SizedBox(width: 8),
                          const Icon(Icons.copy, size: 14, color: AppColors.textMutedDark),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // VandeID Trust Levels
            const Text('VandeID Trust Progression', style: AppTypography.h3),
            const SizedBox(height: 10),

            VdcCard(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  _buildTrustStep('L0: Visitor', 'Unverified account', true),
                  _buildTrustStep('L1: Pioneer', 'Phone / Email verified', true),
                  _buildTrustStep('L2: Secured', '12-word recovery backup secured', false, onTap: () => context.push('/security')),
                  _buildTrustStep('L3: VandeCircle', '3+ trusted network connections', true),
                  _buildTrustStep('L4: KYC Ready', 'Reserved for future ecosystem migration', false),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Account & Preferences
            const Text('Settings & Security', style: AppTypography.h3),
            const SizedBox(height: 10),

            VdcCard(
              padding: EdgeInsets.zero,
              child: Column(
                children: [
                  ListTile(
                    leading: const Icon(Icons.shield_outlined, color: AppColors.gold),
                    title: const Text('Cryptographic Recovery & Security', style: TextStyle(color: Colors.white, fontSize: 14)),
                    subtitle: const Text('12-word mnemonic phrase, sessions', style: TextStyle(color: AppColors.textMutedDark, fontSize: 11)),
                    trailing: const Icon(Icons.arrow_forward_ios, size: 14, color: AppColors.textMutedDark),
                    onTap: () => context.push('/security'),
                  ),
                  const Divider(color: AppColors.darkBorder, height: 1),
                  ListTile(
                    leading: const Icon(Icons.groups_outlined, color: AppColors.gold),
                    title: const Text('Referral Program & Rewards', style: TextStyle(color: Colors.white, fontSize: 14)),
                    subtitle: const Text('Share code & track invitee status', style: TextStyle(color: AppColors.textMutedDark, fontSize: 11)),
                    trailing: const Icon(Icons.arrow_forward_ios, size: 14, color: AppColors.textMutedDark),
                    onTap: () => context.push('/referral'),
                  ),
                  const Divider(color: AppColors.darkBorder, height: 1),
                  ListTile(
                    leading: const Icon(Icons.description_outlined, color: AppColors.textSecondaryDark),
                    title: const Text('Terms of Service & Whitepaper', style: TextStyle(color: Colors.white, fontSize: 14)),
                    trailing: const Icon(Icons.open_in_new, size: 14, color: AppColors.textMutedDark),
                    onTap: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Opening https://vandecoin.network/terms')),
                      );
                    },
                  ),
                ],
              ),
            ),

            const SizedBox(height: 28),

            // Sign Out Button
            VdcButton(
              text: 'Sign Out',
              variant: VdcButtonVariant.ghost,
              onPressed: () async {
                final confirm = await showDialog<bool>(
                  context: context,
                  builder: (ctx) => AlertDialog(
                    backgroundColor: AppColors.darkSurfaceElevated,
                    title: const Text('Sign Out?', style: TextStyle(color: Colors.white)),
                    content: const Text(
                      'Are you sure you want to sign out? Your simulated rewards are preserved in your encrypted local store.',
                      style: TextStyle(color: AppColors.textSecondaryDark),
                    ),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(ctx, false),
                        child: const Text('Cancel'),
                      ),
                      TextButton(
                        onPressed: () => Navigator.pop(ctx, true),
                        child: const Text('Sign Out', style: TextStyle(color: AppColors.error)),
                      ),
                    ],
                  ),
                );

                if (confirm == true) {
                  await ref.read(authStateProvider.notifier).logout();
                  if (context.mounted) context.go('/onboarding');
                }
              },
            ),

            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildTrustStep(String title, String desc, bool isCompleted, {VoidCallback? onTap}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: InkWell(
        onTap: onTap,
        child: Row(
          children: [
            Icon(
              isCompleted ? Icons.verified : Icons.circle_outlined,
              color: isCompleted ? AppColors.greenLight : AppColors.textMutedDark,
              size: 22,
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      color: isCompleted ? Colors.white : AppColors.textSecondaryDark,
                      fontWeight: FontWeight.w700,
                      fontSize: 13,
                    ),
                  ),
                  Text(
                    desc,
                    style: const TextStyle(color: AppColors.textMutedDark, fontSize: 11),
                  ),
                ],
              ),
            ),
            if (!isCompleted && onTap != null)
              const Icon(Icons.arrow_forward_ios, size: 12, color: AppColors.gold),
          ],
        ),
      ),
    );
  }
}

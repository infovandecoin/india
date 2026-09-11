import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/chakra_spinner.dart';
import '../../../core/widgets/coin_medallion.dart';
import '../../../core/widgets/compliance_banner.dart';
import '../../../core/widgets/vdc_button.dart';
import '../../../core/widgets/vdc_card.dart';
import '../../providers/app_state_providers.dart';

class EarnScreen extends ConsumerStatefulWidget {
  const EarnScreen({super.key});

  @override
  ConsumerState<EarnScreen> createState() => _EarnScreenState();
}

class _EarnScreenState extends ConsumerState<EarnScreen> {
  Timer? _tickerTimer;

  @override
  void initState() {
    super.initState();
    // Update live ticker every second when mining is active
    _tickerTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (mounted) setState(() {});
    });
  }

  @override
  void dispose() {
    _tickerTimer?.cancel();
    super.dispose();
  }

  String _formatDuration(Duration duration) {
    final hours = duration.inHours.toString().padLeft(2, '0');
    final minutes = (duration.inMinutes % 60).toString().padLeft(2, '0');
    final seconds = (duration.inSeconds % 60).toString().padLeft(2, '0');
    return '$hours:$minutes:$seconds';
  }

  @override
  Widget build(BuildContext context) {
    final activeSession = ref.watch(activeMiningSessionProvider).value;
    final isMining = activeSession != null;
    final accumulated = activeSession?.currentAccumulatedVdc ?? 0.0;
    final remaining = activeSession?.remainingDuration ?? Duration.zero;

    return Scaffold(
      backgroundColor: AppColors.darkBackground,
      appBar: AppBar(
        title: const Text('Proof-of-Participation (PoP)'),
        actions: [
          IconButton(
            icon: const Icon(Icons.info_outline),
            onPressed: () {
              showModalBottomSheet(
                context: context,
                backgroundColor: AppColors.darkSurfaceElevated,
                shape: const RoundedRectangleBorder(
                  borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
                ),
                builder: (context) => Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('About Eco-Friendly PoP', style: AppTypography.h2),
                      const SizedBox(height: 12),
                      const Text(
                        'VandeCoin replaces wasteful Proof-of-Work (PoW) with a lightweight server-authoritative Proof-of-Participation (PoP) protocol.\n\nSessions run on 24-hour cycles with ZERO background CPU computation and ZERO battery drain, compliant with Google Play & App Store policies.',
                        style: TextStyle(color: AppColors.textSecondaryDark, height: 1.5),
                      ),
                      const SizedBox(height: 24),
                      VdcButton(
                        text: 'Understood',
                        onPressed: () => Navigator.pop(context),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        child: Column(
          children: [
            const ComplianceBanner(compact: true),
            const SizedBox(height: 20),

            // Big Interactive PoP Mining Aura
            Center(
              child: Stack(
                alignment: Alignment.center,
                children: [
                  // Animated Chakra Spinner Aura when mining
                  if (isMining)
                    const ChakraSpinner(
                      size: 220,
                      color: AppColors.gold,
                      duration: Duration(seconds: 8),
                    )
                  else
                    Container(
                      width: 200,
                      height: 200,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(color: AppColors.darkBorder, width: 2),
                      ),
                    ),

                  // Center 3D Coin Medallion
                  Hero(
                    tag: 'coin-medallion',
                    child: CoinMedallion(
                      size: 150,
                      animateGlow: isMining,
                      onTap: () {
                        if (!isMining) {
                          ref.read(activeMiningSessionProvider.notifier).startMining();
                        }
                      },
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Real-Time Accumulated Simulated VDC Counter
            Text(
              isMining ? accumulated.toStringAsFixed(4) : '0.0000',
              style: AppTypography.displayBalance.copyWith(
                color: AppColors.gold,
                fontSize: 42,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              isMining ? 'Accumulated Simulated VDC' : 'Session Ready to Start',
              style: const TextStyle(
                color: AppColors.textSecondaryDark,
                fontSize: 13,
                fontWeight: FontWeight.w600,
              ),
            ),

            const SizedBox(height: 16),

            // Countdown Timer Pill
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: AppColors.darkSurfaceElevated,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.darkBorder),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    Icons.timer_outlined,
                    size: 16,
                    color: isMining ? AppColors.greenLight : AppColors.textMutedDark,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    isMining ? '${_formatDuration(remaining)} Remaining' : '24:00:00 Cycle',
                    style: TextStyle(
                      color: isMining ? Colors.white : AppColors.textMutedDark,
                      fontWeight: FontWeight.w700,
                      fontSize: 13,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Action Button
            if (isMining) ...[
              VdcButton(
                text: activeSession.isExpired ? 'Settle & Claim Rewards' : 'Mining Active (Tap to Settle Early)',
                variant: activeSession.isExpired ? VdcButtonVariant.primary : VdcButtonVariant.secondary,
                onPressed: () async {
                  final earned = await ref.read(activeMiningSessionProvider.notifier).settleMining();
                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Settled +${earned.toStringAsFixed(2)} VDC to your ledger!'),
                        backgroundColor: AppColors.greenDark,
                      ),
                    );
                  }
                },
              ),
            ] else ...[
              VdcButton(
                text: 'Start 24h PoP Session',
                icon: Icons.bolt,
                onPressed: () {
                  ref.read(activeMiningSessionProvider.notifier).startMining();
                },
              ),
            ],

            const SizedBox(height: 28),

            // Dynamic Rate Breakdown Card
            VdcCard(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Participation Rate Breakdown', style: AppTypography.h3),
                  const SizedBox(height: 14),
                  _buildRateRow('Base Protocol Rate', '0.20 VDC / hr', AppColors.gold),
                  const Divider(color: AppColors.darkBorder, height: 18),
                  _buildRateRow('Streak Consistency Boost', '+0.01 VDC / hr', AppColors.saffronPrimary),
                  const Divider(color: AppColors.darkBorder, height: 18),
                  _buildRateRow('VandeCircle Active Boost', '+0.06 VDC / hr', AppColors.greenLight),
                  const Divider(color: AppColors.darkBorder, height: 18),
                  _buildRateRow(
                    'Total Session Rate',
                    isMining
                        ? '+${activeSession.totalRatePerHour.toStringAsFixed(2)} VDC / hr'
                        : '+0.27 VDC / hr',
                    Colors.white,
                    isTotal: true,
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Educational & Ecosystem Activity Modules
            Row(
              children: [
                Expanded(
                  child: VdcCard(
                    onTap: () => context.push('/quiz'),
                    padding: const EdgeInsets.all(14),
                    child: const Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Icon(Icons.school_outlined, color: AppColors.gold, size: 24),
                        SizedBox(height: 8),
                        Text('VandeQuiz', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700)),
                        Text('+5.00 VDC Daily', style: TextStyle(color: AppColors.gold, fontSize: 11)),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: VdcCard(
                    onTap: () => context.push('/streaks'),
                    padding: const EdgeInsets.all(14),
                    child: const Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Icon(Icons.local_fire_department, color: AppColors.saffronPrimary, size: 24),
                        SizedBox(height: 8),
                        Text('Streak Engine', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700)),
                        Text('+1.00 VDC Check-in', style: TextStyle(color: AppColors.saffronPrimary, fontSize: 11)),
                      ],
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildRateRow(String label, String value, Color color, {bool isTotal = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(
            color: isTotal ? Colors.white : AppColors.textSecondaryDark,
            fontWeight: isTotal ? FontWeight.w700 : FontWeight.w500,
            fontSize: 13,
          ),
        ),
        Text(
          value,
          style: TextStyle(
            color: color,
            fontWeight: FontWeight.w700,
            fontSize: isTotal ? 14 : 13,
          ),
        ),
      ],
    );
  }
}

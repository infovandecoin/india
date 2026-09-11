import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/reward_constants.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/vdc_button.dart';
import '../../../core/widgets/vdc_card.dart';
import '../../providers/app_state_providers.dart';
import '../../providers/core_providers.dart';

class StreaksScreen extends ConsumerStatefulWidget {
  const StreaksScreen({super.key});

  @override
  ConsumerState<StreaksScreen> createState() => _StreaksScreenState();
}

class _StreaksScreenState extends ConsumerState<StreaksScreen> {
  bool _claimedToday = false;
  bool _isLoading = false;

  Future<void> _handleClaimCheckIn() async {
    setState(() => _isLoading = true);
    final user = ref.read(authStateProvider).value;
    if (user != null) {
      final repo = ref.read(profileRepositoryProvider);
      await repo.claimDailyStreak(user.uid);
      ref.invalidate(ledgerEntriesProvider);
      ref.invalidate(verifiedBalanceProvider);
      setState(() {
        _claimedToday = true;
        _isLoading = false;
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('+1.00 VDC Daily Check-in added to your ledger! 🔥'),
            backgroundColor: AppColors.greenDark,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(authStateProvider).value;
    final streakDays = user?.streakDays ?? 1;
    final streakShields = user?.streakShields ?? 2;

    return Scaffold(
      backgroundColor: AppColors.darkBackground,
      appBar: AppBar(
        title: const Text('Streak Engine & Check-in'),
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
            // Streak Flame Hero Card
            VdcCard(
              gradient: const LinearGradient(
                colors: [Color(0xFF331C08), Color(0xFF14151B)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  const Icon(
                    Icons.local_fire_department,
                    size: 64,
                    color: AppColors.saffronPrimary,
                  ),
                  const SizedBox(height: 12),
                  Text(
                    '$streakDays Days Streak',
                    style: AppTypography.h1.copyWith(
                      color: Colors.white,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Check in every 24 hours to keep your momentum alive and unlock mega milestone rewards.',
                    textAlign: TextAlign.center,
                    style: AppTypography.bodySmall.copyWith(color: AppColors.textSecondaryDark),
                  ),
                  const SizedBox(height: 20),

                  // Claim Check-in Button
                  VdcButton(
                    text: _claimedToday ? 'Check-in Claimed Today ✅' : 'Claim Daily Check-in (+1.00 VDC)',
                    icon: Icons.check,
                    isLoading: _isLoading,
                    onPressed: _claimedToday ? null : _handleClaimCheckIn,
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Streak Shields Status
            VdcCard(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: AppColors.info.withOpacity(0.15),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.shield, color: AppColors.info, size: 24),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Streak Shields Active', style: AppTypography.h3),
                        const SizedBox(height: 2),
                        Text(
                          'You have $streakShields shields. If you miss a day, a shield is consumed to protect your streak.',
                          style: const TextStyle(color: AppColors.textSecondaryDark, fontSize: 11),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Milestone Rewards Grid
            const Text('Consistency Milestone Bonuses', style: AppTypography.h3),
            const SizedBox(height: 12),

            _buildMilestoneRow(
              day: 7,
              reward: '+15.00 VDC',
              unlocked: streakDays >= 7,
              isCurrent: streakDays < 7,
            ),
            const SizedBox(height: 10),
            _buildMilestoneRow(
              day: 14,
              reward: '+30.00 VDC',
              unlocked: streakDays >= 14,
              isCurrent: streakDays >= 7 && streakDays < 14,
            ),
            const SizedBox(height: 10),
            _buildMilestoneRow(
              day: 30,
              reward: '+150.00 VDC',
              unlocked: streakDays >= 30,
              isCurrent: streakDays >= 14 && streakDays < 30,
            ),

            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildMilestoneRow({
    required int day,
    required String reward,
    required bool unlocked,
    required bool isCurrent,
  }) {
    return VdcCard(
      padding: const EdgeInsets.all(14),
      borderColor: isCurrent ? AppColors.gold.withOpacity(0.5) : AppColors.darkBorder,
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: unlocked
                  ? AppColors.greenPrimary.withOpacity(0.2)
                  : isCurrent
                      ? AppColors.gold.withOpacity(0.2)
                      : AppColors.darkBorder,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              'DAY $day',
              style: TextStyle(
                color: unlocked
                    ? AppColors.greenLight
                    : isCurrent
                        ? AppColors.gold
                        : AppColors.textMutedDark,
                fontWeight: FontWeight.w800,
                fontSize: 12,
              ),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Milestone Booster',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: isCurrent ? FontWeight.w700 : FontWeight.w500,
                    fontSize: 13,
                  ),
                ),
                Text(
                  reward,
                  style: TextStyle(
                    color: unlocked ? AppColors.greenLight : AppColors.gold,
                    fontWeight: FontWeight.w700,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
          Icon(
            unlocked
                ? Icons.check_circle
                : isCurrent
                    ? Icons.lock_clock
                    : Icons.lock_outline,
            color: unlocked
                ? AppColors.greenLight
                : isCurrent
                    ? AppColors.gold
                    : AppColors.textMutedDark,
            size: 20,
          ),
        ],
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/chakra_spinner.dart';
import '../../../core/widgets/coin_medallion.dart';
import '../../../core/widgets/compliance_banner.dart';
import '../../../core/widgets/vdc_card.dart';
import '../../providers/app_state_providers.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(authStateProvider).value;
    final verifiedBalance = ref.watch(verifiedBalanceProvider);
    final activeSession = ref.watch(activeMiningSessionProvider).value;
    final ledgerEntries = ref.watch(ledgerEntriesProvider);

    return Scaffold(
      backgroundColor: AppColors.darkBackground,
      appBar: AppBar(
        title: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Image.asset(
              'assets/images/vdc-mark.png',
              height: 28,
              errorBuilder: (c, e, s) => const Icon(Icons.shield, color: AppColors.gold, size: 22),
            ),
            const SizedBox(width: 8),
            Text(
              'VANDE',
              style: AppTypography.h3.copyWith(color: Colors.white, letterSpacing: 1.5),
            ),
            ShaderMask(
              shaderCallback: (bounds) => AppColors.goldGradient.createShader(bounds),
              child: Text(
                'COIN',
                style: AppTypography.h3.copyWith(color: Colors.white, letterSpacing: 1.5),
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.shield_outlined, color: AppColors.gold),
            tooltip: 'Security Center',
            onPressed: () => context.push('/security'),
          ),
          IconButton(
            icon: const Icon(Icons.notifications_none),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('No new notifications')),
              );
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(verifiedBalanceProvider);
          ref.invalidate(activeMiningSessionProvider);
          ref.invalidate(ledgerEntriesProvider);
        },
        color: AppColors.gold,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Welcome greeting
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Namaste, ${user?.displayName ?? 'Pioneer'}',
                        style: AppTypography.h2.copyWith(color: Colors.white),
                      ),
                      const SizedBox(height: 2),
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: AppColors.gold.withOpacity(0.15),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Text(
                              user?.trustLevel.title ?? 'L1: Pioneer',
                              style: const TextStyle(
                                fontSize: 11,
                                color: AppColors.gold,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            'Streak: ${user?.streakDays ?? 1} Days 🔥',
                            style: const TextStyle(
                              fontSize: 12,
                              color: AppColors.saffronPrimary,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const CoinMedallion(size: 48),
                ],
              ),

              const SizedBox(height: 16),

              // Mandatory Compliance Banner
              const ComplianceBanner(),

              const SizedBox(height: 12),

              // Hero Balance Card
              VdcCard(
                gradient: const LinearGradient(
                  colors: [Color(0xFF1F1D16), Color(0xFF14151B)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderColor: AppColors.gold.withOpacity(0.4),
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Simulated Reward Balance',
                          style: TextStyle(
                            color: AppColors.textSecondaryDark,
                            fontSize: 13,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: AppColors.greenPrimary.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: const Text(
                            'VERIFIED',
                            style: TextStyle(
                              color: AppColors.greenLight,
                              fontSize: 10,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    verifiedBalance.when(
                      data: (balance) => Row(
                        crossAxisAlignment: CrossAxisAlignment.baseline,
                        textBaseline: TextBaseline.alphabetic,
                        children: [
                          ShaderMask(
                            shaderCallback: (b) => AppColors.goldGradient.createShader(b),
                            child: Text(
                              balance.toStringAsFixed(2),
                              style: AppTypography.displayBalance.copyWith(
                                color: Colors.white,
                                fontSize: 40,
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          const Text(
                            'VDC',
                            style: TextStyle(
                              color: AppColors.gold,
                              fontWeight: FontWeight.w800,
                              fontSize: 18,
                            ),
                          ),
                        ],
                      ),
                      loading: () => const ChakraSpinner(size: 32),
                      error: (_, __) => const Text('0.00 VDC'),
                    ),
                    const SizedBox(height: 14),
                    const Divider(color: AppColors.darkBorder),
                    const SizedBox(height: 10),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Participation Rate',
                              style: TextStyle(color: AppColors.textMutedDark, fontSize: 11),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              '+${activeSession != null ? activeSession.totalRatePerHour.toStringAsFixed(2) : '0.20'} VDC / hr',
                              style: const TextStyle(
                                color: AppColors.gold,
                                fontWeight: FontWeight.w700,
                                fontSize: 13,
                              ),
                            ),
                          ],
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            const Text(
                              'PoP Mining Status',
                              style: TextStyle(color: AppColors.textMutedDark, fontSize: 11),
                            ),
                            const SizedBox(height: 2),
                            Row(
                              children: [
                                Container(
                                  width: 8,
                                  height: 8,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: activeSession != null
                                        ? AppColors.greenLight
                                        : AppColors.textMutedDark,
                                  ),
                                ),
                                const SizedBox(width: 6),
                                Text(
                                  activeSession != null ? '24h Active' : 'Standby',
                                  style: TextStyle(
                                    color: activeSession != null
                                        ? AppColors.greenLight
                                        : AppColors.textMutedDark,
                                    fontWeight: FontWeight.w700,
                                    fontSize: 13,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 18),

              // Quick Actions Grid
              Row(
                children: [
                  Expanded(
                    child: _buildActionTile(
                      icon: Icons.bolt,
                      title: 'PoP Mining',
                      subtitle: activeSession != null ? 'In Progress' : 'Start 24h',
                      badgeColor: activeSession != null ? AppColors.greenLight : AppColors.gold,
                      onTap: () => context.go('/earn'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildActionTile(
                      icon: Icons.quiz_outlined,
                      title: 'VandeQuiz',
                      subtitle: '+5.00 VDC Daily',
                      badgeColor: AppColors.gold,
                      onTap: () => context.push('/quiz'),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: _buildActionTile(
                      icon: Icons.local_fire_department_outlined,
                      title: 'Daily Streak',
                      subtitle: 'Claim Day Check-in',
                      badgeColor: AppColors.saffronPrimary,
                      onTap: () => context.push('/streaks'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildActionTile(
                      icon: Icons.group_add_outlined,
                      title: 'Invite Friends',
                      subtitle: '+10.00 VDC Each',
                      badgeColor: AppColors.info,
                      onTap: () => context.push('/referral'),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 24),

              // Recent Activity Ledger Section
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Authoritative Ledger Activity',
                    style: AppTypography.h3.copyWith(color: Colors.white),
                  ),
                  TextButton(
                    onPressed: () => context.go('/wallet'),
                    child: const Text(
                      'View All',
                      style: TextStyle(color: AppColors.gold, fontSize: 13),
                    ),
                  ),
                ],
              ),

              ledgerEntries.when(
                data: (entries) {
                  if (entries.isEmpty) {
                    return Container(
                      padding: const EdgeInsets.all(24),
                      alignment: Alignment.center,
                      child: const Text(
                        'No transactions recorded yet.',
                        style: TextStyle(color: AppColors.textMutedDark),
                      ),
                    );
                  }

                  return Column(
                    children: entries.take(3).map((entry) {
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: VdcCard(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                          child: Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: AppColors.gold.withOpacity(0.1),
                                  shape: BoxShape.circle,
                                ),
                                child: const Icon(
                                  Icons.arrow_downward,
                                  color: AppColors.gold,
                                  size: 18,
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      entry.description,
                                      style: const TextStyle(
                                        color: Colors.white,
                                        fontWeight: FontWeight.w600,
                                        fontSize: 13,
                                      ),
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      'Ref: ${entry.refKey}',
                                      style: const TextStyle(
                                        color: AppColors.textMutedDark,
                                        fontSize: 10,
                                        fontFamily: 'monospace',
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              Text(
                                '+${entry.amount.toStringAsFixed(2)} VDC',
                                style: const TextStyle(
                                  color: AppColors.greenLight,
                                  fontWeight: FontWeight.w700,
                                  fontSize: 14,
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    }).toList(),
                  );
                },
                loading: () => const Center(child: ChakraSpinner(size: 24)),
                error: (e, _) => Text('Error loading ledger: $e'),
              ),

              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildActionTile({
    required IconData icon,
    required String title,
    required String subtitle,
    required Color badgeColor,
    required VoidCallback onTap,
  }) {
    return VdcCard(
      onTap: onTap,
      padding: const EdgeInsets.all(14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Icon(icon, color: badgeColor, size: 24),
              const Icon(Icons.arrow_forward_ios, size: 12, color: AppColors.textMutedDark),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            title,
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.w700,
              fontSize: 14,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            subtitle,
            style: TextStyle(
              color: badgeColor,
              fontWeight: FontWeight.w600,
              fontSize: 11,
            ),
          ),
        ],
      ),
    );
  }
}

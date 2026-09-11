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

class ReferralScreen extends ConsumerWidget {
  const ReferralScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final referralDataAsync = ref.watch(referralDataProvider);

    return Scaffold(
      backgroundColor: AppColors.darkBackground,
      appBar: AppBar(
        title: const Text('Pioneer Referral Program'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
      ),
      body: referralDataAsync.when(
        data: (data) => SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Hero Banner
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF2E2412), Color(0xFF14151B)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.gold.withOpacity(0.3)),
                ),
                child: Column(
                  children: [
                    const Icon(Icons.groups_outlined, size: 48, color: AppColors.gold),
                    const SizedBox(height: 12),
                    Text(
                      'Grow the Pioneer Network',
                      style: AppTypography.h2.copyWith(color: Colors.white),
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'Earn +10.00 VDC when an invited pioneer joins and verifies their account. They receive +10.00 VDC too!',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: AppColors.textSecondaryDark, fontSize: 12, height: 1.4),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              // Referral Code Box
              VdcCard(
                padding: const EdgeInsets.all(18),
                child: Column(
                  children: [
                    const Text(
                      'YOUR UNIQUE REFERRAL CODE',
                      style: TextStyle(
                        color: AppColors.textMutedDark,
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 1.2,
                      ),
                    ),
                    const SizedBox(height: 10),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                      decoration: BoxDecoration(
                        color: AppColors.darkSurfaceElevated,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppColors.gold.withOpacity(0.4)),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            data.referralCode,
                            style: const TextStyle(
                              color: AppColors.gold,
                              fontWeight: FontWeight.w800,
                              fontSize: 18,
                              letterSpacing: 2,
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.copy, color: AppColors.gold, size: 20),
                            onPressed: () {
                              Clipboard.setData(ClipboardData(text: data.referralCode));
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('Referral code copied!')),
                              );
                            },
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 14),
                    VdcButton(
                      text: 'Share Invite Link',
                      icon: Icons.share,
                      onPressed: () {
                        Clipboard.setData(ClipboardData(text: data.shareLink));
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('Invite link copied: ${data.shareLink}')),
                        );
                      },
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // Network Statistics
              const Text('Referral Network Performance', style: AppTypography.h3),
              const SizedBox(height: 12),

              Row(
                children: [
                  Expanded(
                    child: _buildStatCard('Total Invited', '${data.totalInvited}', AppColors.gold),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildStatCard('Verified Pioneers', '${data.verifiedInvited}', AppColors.greenLight),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              _buildStatCard('Total VDC Earned via Referrals', '+${data.totalVdcEarned.toStringAsFixed(2)} VDC', AppColors.saffronPrimary),

              const SizedBox(height: 24),

              // Anti-Self Referral & Fairness Notice
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppColors.darkSurfaceElevated,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.darkBorder),
                ),
                child: const Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(Icons.gavel_outlined, size: 18, color: AppColors.gold),
                    SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Anti-Sybil & Anti-Self Referral Protocol',
                            style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 12),
                          ),
                          SizedBox(height: 4),
                          Text(
                            'Self-referrals and automated multi-accounts are flagged by hardware session fingerprinting. Unverified rewards remain locked until genuine pioneer activity is authenticated.',
                            style: TextStyle(color: AppColors.textSecondaryDark, fontSize: 11, height: 1.4),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),
            ],
          ),
        ),
        loading: () => const Center(child: ChakraSpinner()),
        error: (e, _) => Center(child: Text('Error: $e')),
      ),
    );
  }

  Widget _buildStatCard(String title, String value, Color color) {
    return VdcCard(
      padding: const EdgeInsets.all(14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(color: AppColors.textMutedDark, fontSize: 11)),
          const SizedBox(height: 6),
          Text(
            value,
            style: TextStyle(
              color: color,
              fontWeight: FontWeight.w800,
              fontSize: 18,
            ),
          ),
        ],
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/chakra_spinner.dart';
import '../../../core/widgets/compliance_banner.dart';
import '../../../core/widgets/vdc_button.dart';
import '../../../core/widgets/vdc_card.dart';
import '../../../domain/models/ledger_entry.dart';
import '../../providers/app_state_providers.dart';

class WalletScreen extends ConsumerStatefulWidget {
  const WalletScreen({super.key});

  @override
  ConsumerState<WalletScreen> createState() => _WalletScreenState();
}

class _WalletScreenState extends ConsumerState<WalletScreen> {
  LedgerCategory? _selectedFilter;

  @override
  Widget build(BuildContext context) {
    final verifiedBalanceAsync = ref.watch(verifiedBalanceProvider);
    final unverifiedBalanceAsync = ref.watch(unverifiedBalanceProvider);
    final eligibleBalanceAsync = ref.watch(eligibleBalanceProvider);
    final ledgerEntriesAsync = ref.watch(ledgerEntriesProvider);

    return Scaffold(
      backgroundColor: AppColors.darkBackground,
      appBar: AppBar(
        title: const Text('Rewards Vault & Ledger'),
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(verifiedBalanceProvider);
          ref.invalidate(unverifiedBalanceProvider);
          ref.invalidate(eligibleBalanceProvider);
          ref.invalidate(ledgerEntriesProvider);
        },
        color: AppColors.gold,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const ComplianceBanner(),

              const SizedBox(height: 16),

              // Multi-Tier Balance Card
              VdcCard(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Multi-Tier Simulated Balances',
                      style: TextStyle(
                        color: AppColors.textSecondaryDark,
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Tier 1: Verified Balance (Primary)
                    verifiedBalanceAsync.when(
                      data: (verified) => Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  ShaderMask(
                                    shaderCallback: (b) => AppColors.goldGradient.createShader(b),
                                    child: Text(
                                      verified.toStringAsFixed(2),
                                      style: AppTypography.displayBalance.copyWith(
                                        color: Colors.white,
                                        fontSize: 32,
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 6),
                                  const Text(
                                    'VDC',
                                    style: TextStyle(
                                      color: AppColors.gold,
                                      fontWeight: FontWeight.w800,
                                      fontSize: 16,
                                    ),
                                  ),
                                ],
                              ),
                              const Text(
                                'Verified Settled Rewards',
                                style: TextStyle(color: AppColors.textMutedDark, fontSize: 11),
                              ),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppColors.greenPrimary.withOpacity(0.15),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: const Text(
                              'SETTLED',
                              style: TextStyle(
                                color: AppColors.greenLight,
                                fontWeight: FontWeight.w700,
                                fontSize: 11,
                              ),
                            ),
                          ),
                        ],
                      ),
                      loading: () => const ChakraSpinner(size: 24),
                      error: (_, __) => const Text('0.00 VDC'),
                    ),

                    const Divider(color: AppColors.darkBorder, height: 24),

                    // Tier 2 & 3: Unverified & Eligible
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        // Unverified
                        unverifiedBalanceAsync.when(
                          data: (unverified) => Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                '${unverified.toStringAsFixed(2)} VDC',
                                style: const TextStyle(
                                  color: AppColors.warning,
                                  fontWeight: FontWeight.w700,
                                  fontSize: 15,
                                ),
                              ),
                              const SizedBox(height: 2),
                              const Text(
                                'Unverified Rewards',
                                style: TextStyle(color: AppColors.textMutedDark, fontSize: 11),
                              ),
                            ],
                          ),
                          loading: () => const SizedBox(),
                          error: (_, __) => const SizedBox(),
                        ),

                        // Eligible for Migration
                        eligibleBalanceAsync.when(
                          data: (eligible) => Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Text(
                                '${eligible.toStringAsFixed(2)} VDC',
                                style: const TextStyle(
                                  color: AppColors.info,
                                  fontWeight: FontWeight.w700,
                                  fontSize: 15,
                                ),
                              ),
                              const SizedBox(height: 2),
                              const Text(
                                'Eligible for Staging',
                                style: TextStyle(color: AppColors.textMutedDark, fontSize: 11),
                              ),
                            ],
                          ),
                          loading: () => const SizedBox(),
                          error: (_, __) => const SizedBox(),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              // Simulated Migration Pipeline Checklist
              VdcCard(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Ecosystem Staging Checklist', style: AppTypography.h3),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: AppColors.gold.withOpacity(0.12),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: const Text(
                            'PHASE 1',
                            style: TextStyle(
                              color: AppColors.gold,
                              fontSize: 10,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    _buildChecklistItem('Verify Pioneer Email / Mobile', true),
                    _buildChecklistItem('Generate 12-Word Recovery Backup', false, onTap: () => context.push('/security')),
                    _buildChecklistItem('Complete 5 PoP Daily Mining Sessions', true),
                    _buildChecklistItem('Add 3 Trusted Peers to VandeCircle', true),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // Ledger Transactions Section Header
              Text('Authoritative Ledger History', style: AppTypography.h3),
              const SizedBox(height: 10),

              // Filter Chips
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: [
                    _buildFilterChip('All Categories', null),
                    const SizedBox(width: 8),
                    _buildFilterChip('PoP Mining', LedgerCategory.mining),
                    const SizedBox(width: 8),
                    _buildFilterChip('VandeQuiz', LedgerCategory.quiz),
                    const SizedBox(width: 8),
                    _buildFilterChip('Streaks', LedgerCategory.streak),
                    const SizedBox(width: 8),
                    _buildFilterChip('Referrals', LedgerCategory.referral),
                  ],
                ),
              ),

              const SizedBox(height: 14),

              // Ledger List
              ledgerEntriesAsync.when(
                data: (entries) {
                  final filtered = _selectedFilter == null
                      ? entries
                      : entries.where((e) => e.category == _selectedFilter).toList();

                  if (filtered.isEmpty) {
                    return Container(
                      padding: const EdgeInsets.all(32),
                      alignment: Alignment.center,
                      child: const Text(
                        'No transactions found for this filter.',
                        style: TextStyle(color: AppColors.textMutedDark),
                      ),
                    );
                  }

                  return ListView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: filtered.length,
                    itemBuilder: (context, index) {
                      final entry = filtered[index];
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
                                child: Icon(
                                  _getCategoryIcon(entry.category),
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
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  Text(
                                    '+${entry.amount.toStringAsFixed(2)} VDC',
                                    style: const TextStyle(
                                      color: AppColors.greenLight,
                                      fontWeight: FontWeight.w700,
                                      fontSize: 14,
                                    ),
                                  ),
                                  Text(
                                    '${entry.timestamp.hour.toString().padLeft(2, '0')}:${entry.timestamp.minute.toString().padLeft(2, '0')}',
                                    style: const TextStyle(
                                      color: AppColors.textMutedDark,
                                      fontSize: 10,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  );
                },
                loading: () => const Center(child: ChakraSpinner()),
                error: (e, _) => Center(child: Text('Error loading ledger: $e')),
              ),

              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildChecklistItem(String title, bool completed, {VoidCallback? onTap}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: InkWell(
        onTap: onTap,
        child: Row(
          children: [
            Icon(
              completed ? Icons.check_circle : Icons.radio_button_unchecked,
              color: completed ? AppColors.greenLight : AppColors.textMutedDark,
              size: 20,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                title,
                style: TextStyle(
                  color: completed ? Colors.white : AppColors.textSecondaryDark,
                  fontSize: 13,
                  fontWeight: completed ? FontWeight.w600 : FontWeight.w400,
                ),
              ),
            ),
            if (!completed && onTap != null)
              const Icon(Icons.arrow_forward_ios, size: 12, color: AppColors.gold),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterChip(String label, LedgerCategory? category) {
    final isSelected = _selectedFilter == category;
    return ChoiceChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (_) => setState(() => _selectedFilter = category),
      selectedColor: AppColors.gold,
      backgroundColor: AppColors.darkSurfaceElevated,
      labelStyle: TextStyle(
        color: isSelected ? Colors.black : AppColors.textSecondaryDark,
        fontWeight: FontWeight.w600,
        fontSize: 12,
      ),
      side: BorderSide(
        color: isSelected ? AppColors.gold : AppColors.darkBorder,
      ),
    );
  }

  IconData _getCategoryIcon(LedgerCategory category) {
    switch (category) {
      case LedgerCategory.mining:
        return Icons.bolt;
      case LedgerCategory.quiz:
        return Icons.school;
      case LedgerCategory.streak:
        return Icons.local_fire_department;
      case LedgerCategory.referral:
        return Icons.groups;
      case LedgerCategory.welcome:
        return Icons.celebration;
      case LedgerCategory.bonus:
        return Icons.stars;
    }
  }
}

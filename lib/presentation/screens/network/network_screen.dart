import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/chakra_spinner.dart';
import '../../../core/widgets/vdc_button.dart';
import '../../../core/widgets/vdc_card.dart';
import '../../providers/app_state_providers.dart';
import '../../providers/core_providers.dart';

class NetworkScreen extends ConsumerStatefulWidget {
  const NetworkScreen({super.key});

  @override
  ConsumerState<NetworkScreen> createState() => _NetworkScreenState();
}

class _NetworkScreenState extends ConsumerState<NetworkScreen> {
  final _addMemberController = TextEditingController();

  void _showAddMemberModal() {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.darkSurfaceElevated,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(ctx).viewInsets.bottom + 20,
          left: 20,
          right: 20,
          top: 24,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text('Add Pioneer to VandeCircle', style: AppTypography.h3),
            const SizedBox(height: 8),
            const Text(
              'Enter their pioneer alias or referral handle. Connecting trusted peers boosts your daily mining rate.',
              style: TextStyle(color: AppColors.textSecondaryDark, fontSize: 12),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _addMemberController,
              decoration: const InputDecoration(
                labelText: 'Pioneer Alias or Code',
                prefixIcon: Icon(Icons.person_add, color: AppColors.gold),
                hintText: 'e.g. Aarav Sharma',
              ),
            ),
            const SizedBox(height: 20),
            VdcButton(
              text: 'Add to Circle',
              onPressed: () async {
                final input = _addMemberController.text.trim();
                if (input.isNotEmpty) {
                  try {
                    final user = ref.read(authStateProvider).value;
                    if (user != null) {
                      final repo = ref.read(referralRepositoryProvider);
                      await repo.addCircleMember(user.uid, input);
                      ref.invalidate(circleMembersProvider);
                      _addMemberController.clear();
                      if (ctx.mounted) Navigator.pop(ctx);
                      if (mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('$input added to your VandeCircle!'),
                            backgroundColor: AppColors.greenDark,
                          ),
                        );
                      }
                    }
                  } catch (e) {
                    if (ctx.mounted) {
                      ScaffoldMessenger.of(ctx).showSnackBar(
                        SnackBar(
                          content: Text(e.toString().replaceAll('Exception: ', '')),
                          backgroundColor: AppColors.error,
                        ),
                      );
                    }
                  }
                }
              },
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final circleMembersAsync = ref.watch(circleMembersProvider);

    return Scaffold(
      backgroundColor: AppColors.darkBackground,
      appBar: AppBar(
        title: const Text('VandeCircle Trust Network'),
        actions: [
          IconButton(
            icon: const Icon(Icons.person_add_outlined, color: AppColors.gold),
            tooltip: 'Add Connection',
            onPressed: _showAddMemberModal,
          ),
        ],
      ),
      body: circleMembersAsync.when(
        data: (members) {
          final activeCount = members.where((m) => m.isActive).length;
          final trustScore = members.isEmpty ? 0 : ((activeCount / members.length) * 100).toInt();

          return SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Trust Score Summary Card
                VdcCard(
                  padding: const EdgeInsets.all(18),
                  child: Row(
                    children: [
                      // Circular Trust Indicator
                      Stack(
                        alignment: Alignment.center,
                        children: [
                          SizedBox(
                            width: 68,
                            height: 68,
                            child: CircularProgressIndicator(
                              value: trustScore / 100.0,
                              strokeWidth: 6,
                              backgroundColor: AppColors.darkBorder,
                              valueColor: const AlwaysStoppedAnimation(AppColors.gold),
                            ),
                          ),
                          Text(
                            '$trustScore%',
                            style: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.w800,
                              fontSize: 16,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(width: 18),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('Network Trust Strength', style: AppTypography.h3),
                            const SizedBox(height: 4),
                            Text(
                              '$activeCount of ${members.length} members currently mining',
                              style: const TextStyle(
                                color: AppColors.textSecondaryDark,
                                fontSize: 12,
                              ),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              '+${(activeCount * 0.02).toStringAsFixed(2)} VDC/h active boost',
                              style: const TextStyle(
                                color: AppColors.greenLight,
                                fontWeight: FontWeight.w700,
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // Invite Banner
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: AppColors.gold.withOpacity(0.08),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppColors.gold.withOpacity(0.25)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.share, color: AppColors.gold, size: 22),
                      const SizedBox(width: 12),
                      const Expanded(
                        child: Text(
                          'Invite pioneers to expand your circle. Earn +10 VDC per verified invite.',
                          style: TextStyle(color: AppColors.textPrimaryDark, fontSize: 12),
                        ),
                      ),
                      TextButton(
                        onPressed: () => context.push('/referral'),
                        child: const Text('Invite', style: TextStyle(color: AppColors.gold, fontWeight: FontWeight.w700)),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 24),

                // Members List Header
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Circle Pioneers (${members.length})', style: AppTypography.h3),
                    TextButton.icon(
                      onPressed: _showAddMemberModal,
                      icon: const Icon(Icons.add, size: 16, color: AppColors.gold),
                      label: const Text('Add Member', style: TextStyle(color: AppColors.gold, fontSize: 13)),
                    ),
                  ],
                ),

                const SizedBox(height: 8),

                if (members.isEmpty) ...[
                  Container(
                    padding: const EdgeInsets.all(32),
                    alignment: Alignment.center,
                    child: const Text(
                      'No members in your circle yet. Add trusted peers to boost your PoP rewards!',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: AppColors.textMutedDark),
                    ),
                  ),
                ] else ...[
                  ...members.map((member) {
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 10),
                      child: VdcCard(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                        child: Row(
                          children: [
                            CircleAvatar(
                              backgroundColor: member.isActive
                                  ? AppColors.greenPrimary.withOpacity(0.2)
                                  : AppColors.darkBorder,
                              child: Text(
                                member.username.substring(0, 1).toUpperCase(),
                                style: TextStyle(
                                  color: member.isActive ? AppColors.greenLight : AppColors.textMutedDark,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    member.username,
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.w600,
                                      fontSize: 14,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Row(
                                    children: [
                                      Container(
                                        width: 6,
                                        height: 6,
                                        decoration: BoxDecoration(
                                          shape: BoxShape.circle,
                                          color: member.isActive
                                              ? AppColors.greenLight
                                              : AppColors.textMutedDark,
                                        ),
                                      ),
                                      const SizedBox(width: 6),
                                      Text(
                                        member.isActive ? 'Mining Active (+0.02/h)' : 'Inactive Session',
                                        style: TextStyle(
                                          color: member.isActive
                                              ? AppColors.greenLight
                                              : AppColors.textMutedDark,
                                          fontSize: 11,
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                            if (!member.isActive) ...[
                              IconButton(
                                icon: const Icon(Icons.notifications_active_outlined, size: 20),
                                color: AppColors.gold,
                                tooltip: 'Nudge to Mine',
                                onPressed: () {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(
                                      content: Text('Nudge notification sent to ${member.username}!'),
                                    ),
                                  );
                                },
                              ),
                            ],
                          ],
                        ),
                      ),
                    );
                  }),
                ],
              ],
            ),
          );
        },
        loading: () => const Center(child: ChakraSpinner()),
        error: (e, _) => Center(child: Text('Error loading network: $e')),
      ),
    );
  }
}

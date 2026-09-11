import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_typography.dart';

/// Mandatory regulatory compliance banner displayed on balance, mining, and wallet views.
/// Ensures transparent framing of VDC as simulated in-app participation rewards.
class ComplianceBanner extends StatelessWidget {
  final bool compact;

  const ComplianceBanner({
    super.key,
    this.compact = false,
  });

  @override
  Widget build(BuildContext context) {
    if (compact) {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: AppColors.gold.withOpacity(0.06),
          borderRadius: BorderRadius.circular(8),
          border: Border.padLeft == null
              ? Border.all(color: AppColors.gold.withOpacity(0.2), width: 0.8)
              : null,
        ),
        child: Row(
          children: [
            Icon(Icons.info_outline, size: 14, color: AppColors.gold.withOpacity(0.8)),
            const SizedBox(width: 8),
            const Expanded(
              child: Text(
                'Concept Stage: Simulated in-app rewards. No monetary or cash value.',
                style: TextStyle(
                  fontSize: 10,
                  color: AppColors.textSecondaryDark,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ],
        ),
      );
    }

    return Container(
      margin: const EdgeInsets.symmetric(vertical: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.darkSurfaceElevated,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.gold.withOpacity(0.25), width: 1),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(
              color: AppColors.gold.withOpacity(0.12),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.shield_outlined,
              size: 16,
              color: AppColors.gold,
            ),
          ),
          const SizedBox(width: 12),
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Regulatory & Concept Notice',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: AppColors.gold,
                    letterSpacing: 0.2,
                  ),
                ),
                SizedBox(height: 3),
                Text(
                  'VDC represents simulated in-app participation rewards during the concept stage. It holds no cash value and cannot be redeemed, traded, or converted to INR, USD, or cryptocurrency.',
                  style: TextStyle(
                    fontSize: 11,
                    color: AppColors.textSecondaryDark,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

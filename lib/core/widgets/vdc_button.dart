import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_typography.dart';
import 'chakra_spinner.dart';

enum VdcButtonVariant { primary, secondary, ghost }

/// Custom button adhering to VandeCoin brand specifications.
class VdcButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final VdcButtonVariant variant;
  final bool isLoading;
  final IconData? icon;
  final double? height;
  final double? width;

  const VdcButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.variant = VdcButtonVariant.primary,
    this.isLoading = false,
    this.icon,
    this.height = 50.0,
    this.width,
  });

  @override
  Widget build(BuildContext context) {
    if (variant == VdcButtonVariant.primary) {
      return Container(
        width: width ?? double.infinity,
        height: height,
        decoration: BoxDecoration(
          gradient: onPressed == null || isLoading ? null : AppColors.goldGradient,
          color: onPressed == null || isLoading ? AppColors.darkBorder : null,
          borderRadius: BorderRadius.circular(12),
          boxShadow: onPressed == null || isLoading
              ? null
              : [
                  BoxShadow(
                    color: AppColors.gold.withOpacity(0.25),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ],
        ),
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: isLoading ? null : onPressed,
            borderRadius: BorderRadius.circular(12),
            child: Center(
              child: isLoading
                  ? const ChakraSpinner(size: 24, color: Colors.black)
                  : Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        if (icon != null) ...[
                          Icon(icon, color: Colors.black, size: 20),
                          const SizedBox(width: 8),
                        ],
                        Text(
                          text,
                          style: AppTypography.button.copyWith(
                            color: Colors.black,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ],
                    ),
            ),
          ),
        ),
      );
    }

    if (variant == VdcButtonVariant.secondary) {
      return SizedBox(
        width: width ?? double.infinity,
        height: height,
        child: OutlinedButton(
          onPressed: isLoading ? null : onPressed,
          style: OutlinedButton.styleFrom(
            side: const BorderSide(color: AppColors.gold, width: 1.2),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
          child: isLoading
              ? const ChakraSpinner(size: 22, color: AppColors.gold)
              : Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    if (icon != null) ...[
                      Icon(icon, color: AppColors.gold, size: 18),
                      const SizedBox(width: 8),
                    ],
                    Text(
                      text,
                      style: AppTypography.button.copyWith(color: AppColors.gold),
                    ),
                  ],
                ),
        ),
      );
    }

    // Ghost
    return SizedBox(
      width: width ?? double.infinity,
      height: height,
      child: TextButton(
        onPressed: isLoading ? null : onPressed,
        child: Text(
          text,
          style: AppTypography.button.copyWith(color: AppColors.textSecondaryDark),
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/chakra_spinner.dart';
import '../../../core/widgets/circuit_board_background.dart';

class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.darkBackground,
      body: CircuitBoardBackground(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // 3D Emblem
              Image.asset(
                'assets/images/vdc-dark.png',
                width: 140,
                height: 140,
                fit: BoxFit.contain,
                errorBuilder: (context, error, stackTrace) {
                  return const Icon(
                    Icons.monetization_on,
                    size: 100,
                    color: AppColors.gold,
                  );
                },
              ),
              const SizedBox(height: 24),

              // Wordmark
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    'VANDE',
                    style: AppTypography.h1.copyWith(
                      color: Colors.white,
                      letterSpacing: 3,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                  ShaderMask(
                    shaderCallback: (bounds) => AppColors.goldGradient.createShader(bounds),
                    child: Text(
                      'COIN',
                      style: AppTypography.h1.copyWith(
                        color: Colors.white,
                        letterSpacing: 3,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),

              // Official Tagline
              Text(
                'BUILT FOR A BRIGHTER INDIA',
                style: AppTypography.caption.copyWith(
                  color: AppColors.gold.withOpacity(0.9),
                  letterSpacing: 2,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: 48),

              // Canonical Ashoka Chakra spinner
              const ChakraSpinner(size: 36, color: AppColors.gold),
            ],
          ),
        ),
      ),
    );
  }
}

import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

/// Official 3D Coin Medallion for VandeCoin.
/// Renders high-res 3D minted asset with an optional animated shimmer / glow effect.
class CoinMedallion extends StatelessWidget {
  final double size;
  final bool animateGlow;
  final VoidCallback? onTap;

  const CoinMedallion({
    super.key,
    this.size = 120.0,
    this.animateGlow = false,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    Widget coinWidget = Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        boxShadow: [
          BoxShadow(
            color: AppColors.gold.withOpacity(0.35),
            blurRadius: size * 0.25,
            spreadRadius: size * 0.05,
          ),
          BoxShadow(
            color: AppColors.saffronPrimary.withOpacity(0.2),
            blurRadius: size * 0.35,
            offset: const Offset(-4, -4),
          ),
        ],
      ),
      child: ClipOval(
        child: Image.asset(
          'assets/images/vdc-coin.png',
          width: size,
          height: size,
          fit: BoxFit.contain,
          errorBuilder: (context, error, stackTrace) {
            // Fallback custom painted vector coin medallion
            return CustomPaint(
              size: Size(size, size),
              painter: _VectorMedallionPainter(),
            );
          },
        ),
      ),
    );

    if (onTap != null) {
      coinWidget = GestureDetector(
        onTap: onTap,
        child: coinWidget,
      );
    }

    return coinWidget;
  }
}

class _VectorMedallionPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2;

    // Outer rim gradient
    final rimPaint = Paint()
      ..shader = const SweepGradient(
        colors: [
          AppColors.goldLight,
          AppColors.goldDark,
          AppColors.gold,
          AppColors.goldLight,
        ],
      ).createShader(Rect.fromCircle(center: center, radius: radius));
    canvas.drawCircle(center, radius, rimPaint);

    // Inner surface
    final innerPaint = Paint()
      ..color = AppColors.darkSurface
      ..style = PaintingStyle.fill;
    canvas.drawCircle(center, radius * 0.88, innerPaint);

    // Knurled gold border
    final knurlPaint = Paint()
      ..color = AppColors.gold
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2;
    canvas.drawCircle(center, radius * 0.84, knurlPaint);

    // Center Gold V & Chakra
    final textPainter = TextPainter(
      text: const TextSpan(
        text: 'VDC',
        style: TextStyle(
          color: AppColors.gold,
          fontSize: 22,
          fontWeight: FontWeight.w900,
          letterSpacing: 2,
        ),
      ),
      textDirection: TextDirection.ltr,
    )..layout();

    textPainter.paint(
      canvas,
      Offset(center.dx - textPainter.width / 2, center.dy - textPainter.height / 2),
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

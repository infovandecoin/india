import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

/// Renders modern radiating circuit-board background traces and ambient glowing halos.
class CircuitBoardBackground extends StatelessWidget {
  final Widget child;
  final bool showAmbientGlow;

  const CircuitBoardBackground({
    super.key,
    required this.child,
    this.showAmbientGlow = true,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Ambient background glow
        if (showAmbientGlow) ...[
          Positioned(
            top: -100,
            left: -50,
            child: Container(
              width: 250,
              height: 250,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppColors.saffronPrimary.withOpacity(0.08),
              ),
            ),
          ),
          Positioned(
            bottom: 100,
            right: -80,
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppColors.greenPrimary.withOpacity(0.06),
              ),
            ),
          ),
        ],

        // Custom circuit traces
        Positioned.fill(
          child: CustomPaint(
            painter: _CircuitTracesPainter(),
          ),
        ),

        // Child content
        child,
      ],
    );
  }
}

class _CircuitTracesPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final linePaint = Paint()
      ..color = AppColors.gold.withOpacity(0.04)
      ..strokeWidth = 1.0
      ..style = PaintingStyle.stroke;

    final dotPaint = Paint()
      ..color = AppColors.gold.withOpacity(0.08)
      ..style = PaintingStyle.fill;

    // Subtle grid lines & nodes
    final w = size.width;
    final h = size.height;

    final path = Path();

    // Top circuit trace
    path.moveTo(0, h * 0.15);
    path.lineTo(w * 0.35, h * 0.15);
    path.lineTo(w * 0.5, h * 0.22);
    path.lineTo(w, h * 0.22);

    // Bottom circuit trace
    path.moveTo(0, h * 0.78);
    path.lineTo(w * 0.25, h * 0.78);
    path.lineTo(w * 0.45, h * 0.86);
    path.lineTo(w, h * 0.86);

    canvas.drawPath(path, linePaint);

    // Node dots
    canvas.drawCircle(Offset(w * 0.35, h * 0.15), 3, dotPaint);
    canvas.drawCircle(Offset(w * 0.5, h * 0.22), 3, dotPaint);
    canvas.drawCircle(Offset(w * 0.25, h * 0.78), 3, dotPaint);
    canvas.drawCircle(Offset(w * 0.45, h * 0.86), 3, dotPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

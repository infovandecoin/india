import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

/// Canonical 24-spoke Ashoka Chakra animated spinner for VandeCoin.
/// Functions as the primary loading spinner and brand progress indicator.
class ChakraSpinner extends StatefulWidget {
  final double size;
  final Color? color;
  final Duration duration;

  const ChakraSpinner({
    super.key,
    this.size = 40.0,
    this.color,
    this.duration = const Duration(seconds: 4),
  });

  @override
  State<ChakraSpinner> createState() => _ChakraSpinnerState();
}

class _ChakraSpinnerState extends State<ChakraSpinner>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: widget.duration,
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final effectiveColor = widget.color ?? AppColors.gold;

    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Transform.rotate(
          angle: _controller.value * 2 * math.pi,
          child: CustomPaint(
            size: Size(widget.size, widget.size),
            painter: _ChakraPainter(color: effectiveColor),
          ),
        );
      },
    );
  }
}

class _ChakraPainter extends CustomPainter {
  final Color color;

  _ChakraPainter({required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2;

    // Outer rim
    final rimPaint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = size.width * 0.06;
    canvas.drawCircle(center, radius * 0.94, rimPaint);

    // Inner hub
    final hubPaint = Paint()
      ..color = color
      ..style = PaintingStyle.fill;
    canvas.drawCircle(center, radius * 0.18, hubPaint);

    // 24 Spokes
    final spokePaint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..strokeWidth = size.width * 0.035;

    const spokeCount = 24;
    const angleStep = (2 * math.pi) / spokeCount;

    for (int i = 0; i < spokeCount; i++) {
      final angle = i * angleStep;
      final start = Offset(
        center.dx + (radius * 0.18) * math.cos(angle),
        center.dy + (radius * 0.18) * math.sin(angle),
      );
      final end = Offset(
        center.dx + (radius * 0.90) * math.cos(angle),
        center.dy + (radius * 0.90) * math.sin(angle),
      );
      canvas.drawLine(start, end, spokePaint);
    }
  }

  @override
  bool shouldRepaint(covariant _ChakraPainter oldDelegate) =>
      oldDelegate.color != color;
}

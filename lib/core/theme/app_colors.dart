import 'package:flutter/material.dart';

/// Centralized color tokens for VandeCoin (VDC) Design System.
/// Inspired by the Indian National Flag (Tiranga) and imperial metallic gold.
class AppColors {
  AppColors._();

  // Primary Tiranga & Brand Colors
  static const Color saffronPrimary = Color(0xFFFF9933);
  static const Color saffronLight = Color(0xFFFFB347);
  static const Color saffronDark = Color(0xFFCC6600);

  static const Color greenPrimary = Color(0xFF138808);
  static const Color greenLight = Color(0xFF4CAF50);
  static const Color greenDark = Color(0xFF0D5C05);

  static const Color navyPrimary = Color(0xFF000080);
  static const Color navyLight = Color(0xFF1E3A8A);

  // Metallic Gold (Universal Rewards Signifier)
  static const Color gold = Color(0xFFFFD700);
  static const Color goldLight = Color(0xFFFFE066);
  static const Color goldDark = Color(0xFFB8860B);
  static const Color goldMetallic = Color(0xFFE5A910);

  // Dark Obsidian Palette (Primary / Default)
  static const Color darkBackground = Color(0xFF0A0A0C);
  static const Color darkSurface = Color(0xFF121318);
  static const Color darkSurfaceElevated = Color(0xFF1B1D24);
  static const Color darkBorder = Color(0xFF282B36);
  static const Color darkBorderLight = Color(0xFF383C4A);

  // Light Palette
  static const Color lightBackground = Color(0xFFF8FAFC);
  static const Color lightSurface = Color(0xFFFFFFFF);
  static const Color lightSurfaceElevated = Color(0xFFF1F5F9);
  static const Color lightBorder = Color(0xFFE2E8F0);
  static const Color lightBorderDark = Color(0xFFCBD5E1);

  // Text Colors
  static const Color textPrimaryDark = Color(0xFFF8FAFC);
  static const Color textSecondaryDark = Color(0xFF94A3B8);
  static const Color textMutedDark = Color(0xFF64748B);

  static const Color textPrimaryLight = Color(0xFF0F172A);
  static const Color textSecondaryLight = Color(0xFF475569);
  static const Color textMutedLight = Color(0xFF94A3B8);

  // Feedback & Status
  static const Color success = Color(0xFF10B981);
  static const Color warning = Color(0xFFF59E0B);
  static const Color error = Color(0xFFEF4444);
  static const Color info = Color(0xFF3B82F6);

  // Gradients
  static const LinearGradient goldGradient = LinearGradient(
    colors: [goldLight, gold, goldDark],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient tricolorGradient = LinearGradient(
    colors: [saffronPrimary, Color(0xFFFFFFFF), greenPrimary],
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
  );

  static const LinearGradient heroGradient = LinearGradient(
    colors: [Color(0x33FF9933), Color(0x11138808), Colors.transparent],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );

  static const LinearGradient cardGlassGradient = LinearGradient(
    colors: [Color(0x22FFFFFF), Color(0x08FFFFFF)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}

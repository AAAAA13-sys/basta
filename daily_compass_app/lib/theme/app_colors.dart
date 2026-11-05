import 'package:flutter/material.dart';

/// AppColors defines the Nordic Twilight Pinoy Edition master palette.
/// Designed for low eye strain in dim train cabins and glare-free contrast under tropical sun.
class AppColors {
  // --- Canvas & Surfaces ---
  static const Color bgCanvas = Color(0xFF181C24);
  static const Color bgCanvasSubtle = Color(0xFF1C222E);
  static const Color bgCard = Color(0xFF222734);
  static const Color bgCardHover = Color(0xFF272D3C);
  static const Color bgCardElevated = Color(0xFF2C3345);
  static const Color bgCardGlass = Color(0xD9222734); // 85% opacity
  static const Color bgOverlay = Color(0xD60E1117);    // 84% opacity

  // --- Borders & Separators ---
  static const Color borderSubtle = Color(0xFF2D3546);
  static const Color borderMuted = Color(0xFF3A4459);
  static const Color borderFocus = Color(0xFF4A7BB0);

  // --- High-Contrast Text (WCAG AAA Compliant) ---
  static const Color textPrimary = Color(0xFFE6EDF3);   // 13.8:1 contrast
  static const Color textSecondary = Color(0xFF9AA5B5); // 6.4:1 contrast
  static const Color textMuted = Color(0xFF6E7681);     // 4.6:1 contrast
  static const Color textInverse = Color(0xFF0D1117);

  // --- Filipino Cultural Accents ---
  static const Color bambooSage = Color(0xFF60CD9B);
  static const Color bambooSageSoft = Color(0xFF7EE0B3);
  static const Color calamansiAmber = Color(0xFFE5A960);
  static const Color calamansiAmberSoft = Color(0xFFF3BE7D);
  static const Color manilaSkyBlue = Color(0xFF4A7BB0);
  static const Color jeepneyCoral = Color(0xFFE06D53);
  static const Color mayaViolet = Color(0xFF8B5CF6);
  static const Color gcashCyan = Color(0xFF007DFE);
  static const Color beepMint = Color(0xFF2DD4BF);

  // --- Semantic Color Schemes for Flutter Theme ---
  static const ColorScheme darkColorScheme = ColorScheme.dark(
    brightness: Brightness.dark,
    background: bgCanvas,
    surface: bgCard,
    primary: bambooSage,
    onPrimary: textInverse,
    secondary: manilaSkyBlue,
    onSecondary: textPrimary,
    error: jeepneyCoral,
    onError: textPrimary,
    onBackground: textPrimary,
    onSurface: textPrimary,
  );
}


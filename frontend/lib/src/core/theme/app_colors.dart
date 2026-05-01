import 'package:flutter/material.dart';

extension AppColorsExtension on BuildContext {
  AppColors get colors => Theme.of(this).extension<AppColors>()!;
}

@immutable
class AppColors extends ThemeExtension<AppColors> {
  const AppColors({
    required this.primary,
    required this.primaryContainer,
    required this.onPrimary,
    required this.secondary,
    required this.surface,
    required this.background,
    required this.error,
    required this.onError,
    required this.textPrimary,
    required this.textSecondary,
    required this.textTertiary,
    required this.border,
    required this.shimmerBase,
    required this.shimmerHighlight,
  });

  final Color primary;
  final Color primaryContainer;
  final Color onPrimary;
  final Color secondary;
  final Color surface;
  final Color background;
  final Color error;
  final Color onError;
  final Color textPrimary;
  final Color textSecondary;
  final Color textTertiary;
  final Color border;
  final Color shimmerBase;
  final Color shimmerHighlight;

  static const light = AppColors(
    primary: Color(0xFF6750A4),
    primaryContainer: Color(0xFFEADDFF),
    onPrimary: Color(0xFFFFFFFF),
    secondary: Color(0xFF625B71),
    surface: Color(0xFFFFFBFE),
    background: Color(0xFFFFFBFE),
    error: Color(0xFFB3261E),
    onError: Color(0xFFFFFFFF),
    textPrimary: Color(0xFF1C1B1F),
    textSecondary: Color(0xFF49454F),
    textTertiary: Color(0xFF79747E),
    border: Color(0xFFCAC4D0),
    shimmerBase: Color(0xFFE0E0E0),
    shimmerHighlight: Color(0xFFF5F5F5),
  );

  static const dark = AppColors(
    primary: Color(0xFFD0BCFF),
    primaryContainer: Color(0xFF4F378B),
    onPrimary: Color(0xFF381E72),
    secondary: Color(0xFFCCC2DC),
    surface: Color(0xFF1C1B1F),
    background: Color(0xFF1C1B1F),
    error: Color(0xFFF2B8B5),
    onError: Color(0xFF601410),
    textPrimary: Color(0xFFE6E1E5),
    textSecondary: Color(0xFFCAC4D0),
    textTertiary: Color(0xFF938F99),
    border: Color(0xFF49454F),
    shimmerBase: Color(0xFF2C2C2C),
    shimmerHighlight: Color(0xFF3C3C3C),
  );

  @override
  AppColors copyWith({
    Color? primary, Color? primaryContainer, Color? onPrimary,
    Color? secondary, Color? surface, Color? background,
    Color? error, Color? onError, Color? textPrimary,
    Color? textSecondary, Color? textTertiary, Color? border,
    Color? shimmerBase, Color? shimmerHighlight,
  }) {
    return AppColors(
      primary: primary ?? this.primary,
      primaryContainer: primaryContainer ?? this.primaryContainer,
      onPrimary: onPrimary ?? this.onPrimary,
      secondary: secondary ?? this.secondary,
      surface: surface ?? this.surface,
      background: background ?? this.background,
      error: error ?? this.error,
      onError: onError ?? this.onError,
      textPrimary: textPrimary ?? this.textPrimary,
      textSecondary: textSecondary ?? this.textSecondary,
      textTertiary: textTertiary ?? this.textTertiary,
      border: border ?? this.border,
      shimmerBase: shimmerBase ?? this.shimmerBase,
      shimmerHighlight: shimmerHighlight ?? this.shimmerHighlight,
    );
  }

  @override
  AppColors lerp(AppColors? other, double t) {
    if (other is! AppColors) return this;
    return AppColors(
      primary: Color.lerp(primary, other.primary, t)!,
      primaryContainer: Color.lerp(primaryContainer, other.primaryContainer, t)!,
      onPrimary: Color.lerp(onPrimary, other.onPrimary, t)!,
      secondary: Color.lerp(secondary, other.secondary, t)!,
      surface: Color.lerp(surface, other.surface, t)!,
      background: Color.lerp(background, other.background, t)!,
      error: Color.lerp(error, other.error, t)!,
      onError: Color.lerp(onError, other.onError, t)!,
      textPrimary: Color.lerp(textPrimary, other.textPrimary, t)!,
      textSecondary: Color.lerp(textSecondary, other.textSecondary, t)!,
      textTertiary: Color.lerp(textTertiary, other.textTertiary, t)!,
      border: Color.lerp(border, other.border, t)!,
      shimmerBase: Color.lerp(shimmerBase, other.shimmerBase, t)!,
      shimmerHighlight: Color.lerp(shimmerHighlight, other.shimmerHighlight, t)!,
    );
  }
}

import 'package:flutter/material.dart';

extension AppSpacingExtension on BuildContext {
  AppSpacing get spacing => Theme.of(this).extension<AppSpacing>()!;
}

@immutable
class AppSpacing extends ThemeExtension<AppSpacing> {
  const AppSpacing({
    required this.s2, required this.s4, required this.s8,
    required this.s12, required this.s16, required this.s20,
    required this.s24, required this.s32, required this.s40,
    required this.s48, required this.s64,
  });

  final double s2, s4, s8, s12, s16, s20, s24, s32, s40, s48, s64;

  static const base = AppSpacing(
    s2: 2, s4: 4, s8: 8, s12: 12, s16: 16,
    s20: 20, s24: 24, s32: 32, s40: 40, s48: 48, s64: 64,
  );

  @override
  AppSpacing copyWith({
    double? s2, double? s4, double? s8, double? s12, double? s16,
    double? s20, double? s24, double? s32, double? s40, double? s48, double? s64,
  }) => AppSpacing(
    s2: s2 ?? this.s2, s4: s4 ?? this.s4, s8: s8 ?? this.s8,
    s12: s12 ?? this.s12, s16: s16 ?? this.s16, s20: s20 ?? this.s20,
    s24: s24 ?? this.s24, s32: s32 ?? this.s32, s40: s40 ?? this.s40,
    s48: s48 ?? this.s48, s64: s64 ?? this.s64,
  );

  @override
  AppSpacing lerp(AppSpacing? other, double t) => this;
}

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

typedef GestureHandler = void Function(BuildContext context, dynamic data);

enum HapticType { none, light, medium, heavy }

@immutable
class GestureConfig {
  const GestureConfig({
    required this.name,
    required this.handler,
    this.haptic = HapticType.light,
  });
  final String name;
  final GestureHandler handler;
  final HapticType haptic;
}

/// Central gesture registry. Register all gestures at app startup.
class GestureRegistry {
  GestureRegistry._();
  static final _registry = <String, GestureConfig>{};

  static void register(GestureConfig config) {
    _registry[config.name] = config;
  }

  static GestureConfig? get(String name) => _registry[name];

  static void triggerHaptic(HapticType type) {
    switch (type) {
      case HapticType.light:   HapticFeedback.lightImpact();
      case HapticType.medium:  HapticFeedback.mediumImpact();
      case HapticType.heavy:   HapticFeedback.heavyImpact();
      case HapticType.none:    break;
    }
  }
}

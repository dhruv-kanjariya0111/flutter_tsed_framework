import 'gesture_registry.dart';

/// Registers the 6 core gestures at app startup.
void registerCoreGestures() {
  GestureRegistry.register(const GestureConfig(
    name: 'tap',
    handler: _noOp,
    haptic: HapticType.light,
  ));
  GestureRegistry.register(const GestureConfig(
    name: 'longPress',
    handler: _noOp,
    haptic: HapticType.medium,
  ));
  GestureRegistry.register(const GestureConfig(
    name: 'swipeHorizontal',
    handler: _noOp,
    haptic: HapticType.light,
  ));
  GestureRegistry.register(const GestureConfig(
    name: 'swipeVertical',
    handler: _noOp,
    haptic: HapticType.none,
  ));
  GestureRegistry.register(const GestureConfig(
    name: 'doubleTap',
    handler: _noOp,
    haptic: HapticType.light,
  ));
  GestureRegistry.register(const GestureConfig(
    name: 'pinchZoom',
    handler: _noOp,
    haptic: HapticType.none,
  ));
}

void _noOp(context, data) {}

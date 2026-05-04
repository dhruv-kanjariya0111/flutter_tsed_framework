# State Management

## Riverpod 2.x (default)
Use @riverpod annotation. autoDispose on all feature-scoped providers.

Pattern for async features:
  @riverpod
  class FeatureNotifier extends _$FeatureNotifier {
    @override
    FutureOr<FeatureState> build() => const FeatureState.initial();

    Future<void> doAction() async {
      state = const AsyncLoading();
      state = await AsyncValue.guard(() => ref.read(repoProvider).action());
    }
  }

Rules:
- ref.read() only in callbacks/methods — never in build()
- ref.invalidate(provider) on back navigation for stale-state prevention (PATTERN-001)
- Family providers for parameterized state: userProvider(userId)
- Keep providers in presentation/providers/ — never in views
- Test with ProviderContainer and explicit overrides

## GetX (if configured)
- Controllers extend GetxController. Dispose in onClose().
- .obs for reactive state. Obx() in widgets.
- Named routes only. Bindings per feature for lazy DI.
- Never Get.to(Widget()) — use route names.

## Bloc (if configured)
- Events: sealed classes. States: sealed classes with copyWith.
- BlocBuilder for UI. BlocListener for side effects only.
- HydratedBloc for persistence needs.

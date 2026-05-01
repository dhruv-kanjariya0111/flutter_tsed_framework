/// Feature flag service abstraction.
/// Default implementation: Firebase Remote Config.
abstract class FeatureFlagService {
  Future<void> initialize();
  
  bool isEnabled(String flag, {bool defaultValue = false});
  
  Stream<Map<String, bool>> get flagUpdates;
  
  Future<void> fetchAndActivate();
}

/// Centralized flag names. Prevents typos and enables IDE autocomplete.
class FeatureFlags {
  FeatureFlags._();
  
  // Format: feature_<name>_enabled or kill_switch_<service>
  static const String newOnboardingEnabled = 'feature_new_onboarding_enabled';
  static const String darkModeEnabled = 'feature_dark_mode_enabled';
  static const String killSwitchPayments = 'kill_switch_payments';
  
  // Add new flags above this line. 
  // Set removal TODO: when feature is fully rolled out (2 sprints).
}

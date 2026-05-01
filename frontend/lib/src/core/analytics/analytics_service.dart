/// Analytics service abstraction.
/// Concrete implementations: FirebaseAnalyticsService, AmplitudeService, etc.
abstract class AnalyticsService {
  Future<void> initialize();
  
  /// Track a user action event.
  /// [name] must be snake_case with feature prefix: auth_login_submitted
  /// [properties] must NOT contain PII (email, name, phone).
  Future<void> track(String name, {Map<String, dynamic>? properties});
  
  /// Track screen view.
  Future<void> screen(String screenName, {Map<String, dynamic>? properties});
  
  /// Set user ID (opaque/hashed — never raw email or name).
  Future<void> identify(String userId, {Map<String, dynamic>? traits});
  
  /// Clear user identity on logout.
  Future<void> reset();
}

/// Standard event names — use these constants, never raw strings.
class AnalyticsEvents {
  AnalyticsEvents._();
  
  // Auth
  static const authLoginStarted = 'auth_login_started';
  static const authLoginSucceeded = 'auth_login_succeeded';
  static const authLoginFailed = 'auth_login_failed';
  static const authLogout = 'auth_logout';
  static const authSignupStarted = 'auth_signup_started';
  static const authSignupSucceeded = 'auth_signup_succeeded';
  
  // Navigation
  static const screenViewed = 'screen_viewed';
  
  // Generic
  static const buttonTapped = 'button_tapped';
  static const errorDisplayed = 'error_displayed';
  static const retryTapped = 'retry_tapped';
}

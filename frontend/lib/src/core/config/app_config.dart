import 'package:flutter/foundation.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

@immutable
class AppConfig {
  static late final AppConfig _instance;
  static AppConfig get instance => _instance;

  final String apiBaseUrl;
  final String supabaseUrl;
  final String supabaseAnonKey;
  final bool enableCrashlytics;
  final String sentryDsn;
  final String flavor;
  final bool isProduction;

  const AppConfig._({
    required this.apiBaseUrl,
    required this.supabaseUrl,
    required this.supabaseAnonKey,
    required this.enableCrashlytics,
    required this.sentryDsn,
    required this.flavor,
    required this.isProduction,
  });

  static Future<void> load({String flavor = 'dev'}) async {
    await dotenv.load(fileName: '.env.$flavor');
    _instance = AppConfig._(
      apiBaseUrl: dotenv.env['API_BASE_URL']!,
      supabaseUrl: dotenv.env['SUPABASE_URL'] ?? '',
      supabaseAnonKey: dotenv.env['SUPABASE_ANON_KEY'] ?? '',
      enableCrashlytics: dotenv.env['ENABLE_CRASHLYTICS'] == 'true',
      sentryDsn: dotenv.env['SENTRY_DSN'] ?? '',
      flavor: flavor,
      isProduction: flavor == 'prod',
    );
  }
}

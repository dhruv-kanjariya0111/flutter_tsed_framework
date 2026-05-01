/// Re-exports generated AppLocalizations for convenience.
/// flutter gen-l10n generates AppLocalizations from l10n/*.arb files.

// ignore: depend_on_referenced_packages
export 'package:flutter_gen/gen_l10n/app_localizations.dart';

// Extension for cleaner access: context.l10n.key instead of AppLocalizations.of(context)!.key
import 'package:flutter/widgets.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart'; // ignore: depend_on_referenced_packages

extension AppLocalizationsExtension on BuildContext {
  AppLocalizations get l10n => AppLocalizations.of(this)!;
}

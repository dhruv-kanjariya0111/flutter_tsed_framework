import 'package:flutter/material.dart';
import 'src/core/config/app_config.dart';
import 'src/core/di/injection.dart';
import 'src/app.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await AppConfig.load(flavor: 'dev');
  await initDependencies();
  runApp(const App());
}

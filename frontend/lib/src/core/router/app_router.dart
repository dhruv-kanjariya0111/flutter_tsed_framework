import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter/material.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/auth/login',
    debugLogDiagnostics: true,
    redirect: (context, state) {
      // TODO: inject auth state provider
      // final isLoggedIn = ref.read(authNotifierProvider).hasValue;
      // Handle PATTERN-006: preserve deep link path through auth redirect
      // if (!isLoggedIn && !state.matchedLocation.startsWith('/auth')) {
      //   return '/auth/login?redirect=${Uri.encodeComponent(state.matchedLocation)}';
      // }
      return null;
    },
    errorBuilder: (context, state) => Scaffold(
      body: Center(
        child: Text('Page not found: ${state.uri}'),
      ),
    ),
    routes: [
      GoRoute(
        path: '/auth/login',
        name: 'auth-login',
        builder: (context, state) => const Placeholder(), // Replace with AuthLoginView
      ),
      GoRoute(
        path: '/home',
        name: 'home',
        builder: (context, state) => const Placeholder(), // Replace with HomeView
      ),
    ],
  );
});

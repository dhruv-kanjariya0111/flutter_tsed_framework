import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../domain/entities/user_entity.dart';
import '../../domain/repositories/auth_repository.dart';
import '../../data/repositories/auth_repository_impl.dart';

part 'auth_notifier.freezed.dart';
part 'auth_notifier.g.dart';

@freezed
sealed class AuthState with _$AuthState {
  const factory AuthState.initial() = AuthStateInitial;
  const factory AuthState.authenticated(UserEntity user) = AuthStateAuthenticated;
  const factory AuthState.unauthenticated() = AuthStateUnauthenticated;
}

@riverpod
class AuthNotifier extends _$AuthNotifier {
  AuthRepository get _repo => ref.read(authRepositoryProvider);

  @override
  FutureOr<AuthState> build() async {
    final user = await _repo.getCurrentUser();
    return user != null
        ? AuthState.authenticated(user)
        : const AuthState.unauthenticated();
  }

  Future<void> signIn(String email, String password) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final user = await _repo.signIn(email, password);
      return AuthState.authenticated(user);
    });
  }

  Future<void> signOut() async {
    await _repo.signOut();
    state = const AsyncData(AuthState.unauthenticated());
  }
}

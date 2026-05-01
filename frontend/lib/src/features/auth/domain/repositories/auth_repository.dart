import '../entities/user_entity.dart';
import '../../../../core/error/failures.dart';

abstract class AuthRepository {
  /// Signs in with email and password.
  /// Returns [UserEntity] on success, throws [AuthFailure] on failure.
  Future<UserEntity> signIn(String email, String password);

  /// Signs up with email and password.
  Future<UserEntity> signUp(String email, String password, String displayName);

  /// Signs out current user.
  Future<void> signOut();

  /// Returns current user or null if not signed in.
  Future<UserEntity?> getCurrentUser();

  /// Refreshes access token. Throws [AuthFailure] if refresh fails.
  Future<void> refreshToken();

  /// Stream of auth state changes.
  Stream<UserEntity?> get authStateChanges;
}

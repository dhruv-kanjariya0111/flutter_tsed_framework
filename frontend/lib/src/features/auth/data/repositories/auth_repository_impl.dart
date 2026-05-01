import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/entities/user_entity.dart';
import '../../domain/repositories/auth_repository.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/network/dio_client.dart';
import '../../../../core/storage/secure_storage.dart';
import '../dtos/user_dto.dart';
import '../mappers/user_mapper.dart';

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepositoryImpl(
    dio: ref.read(dioProvider),
    storage: ref.read(secureStorageProvider),
  );
});

class AuthRepositoryImpl implements AuthRepository {
  AuthRepositoryImpl({required this.dio, required this.storage});

  final Dio dio;
  final SecureStorage storage;

  @override
  Future<UserEntity> signIn(String email, String password) async {
    try {
      final response = await dio.post('/api/v1/auth/login', data: {
        'email': email,
        'password': password,
      });
      final authResponse = AuthResponseDto.fromJson(
        response.data as Map<String, dynamic>,
      );
      await storage.saveAccessToken(authResponse.accessToken);
      await storage.saveRefreshToken(authResponse.refreshToken);
      return UserMapper.fromDto(authResponse.user);
    } on DioException catch (e) {
      if (e.response?.statusCode == 401) {
        throw const Failure.auth(message: 'Invalid email or password.');
      }
      throw Failure.network(
        message: 'Network error during sign in.',
        statusCode: e.response?.statusCode,
      );
    } catch (e) {
      throw Failure.unknown(message: e.toString());
    }
  }

  @override
  Future<UserEntity> signUp(String email, String password, String displayName) async {
    try {
      final response = await dio.post('/api/v1/auth/register', data: {
        'email': email,
        'password': password,
        'display_name': displayName,
      });
      final authResponse = AuthResponseDto.fromJson(
        response.data as Map<String, dynamic>,
      );
      await storage.saveAccessToken(authResponse.accessToken);
      await storage.saveRefreshToken(authResponse.refreshToken);
      return UserMapper.fromDto(authResponse.user);
    } on DioException catch (e) {
      if (e.response?.statusCode == 409) {
        throw const Failure.validation(message: 'An account with this email already exists.');
      }
      throw Failure.network(
        message: 'Network error during sign up.',
        statusCode: e.response?.statusCode,
      );
    }
  }

  @override
  Future<void> signOut() => storage.clearTokens();

  @override
  Future<UserEntity?> getCurrentUser() async {
    final token = await storage.getAccessToken();
    if (token == null) return null;
    try {
      final response = await dio.get('/api/v1/auth/me');
      return UserMapper.fromDto(
        UserDto.fromJson(response.data as Map<String, dynamic>),
      );
    } catch (_) {
      return null;
    }
  }

  @override
  Future<void> refreshToken() async {}

  @override
  Stream<UserEntity?> get authStateChanges => const Stream.empty();
}

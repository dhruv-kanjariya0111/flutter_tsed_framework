import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../storage/secure_storage.dart';

final authInterceptorProvider = Provider<AuthInterceptor>((ref) {
  return AuthInterceptor(ref.read(secureStorageProvider));
});

class AuthInterceptor extends Interceptor {
  AuthInterceptor(this._storage);
  final SecureStorage _storage;

  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final token = await _storage.getAccessToken();
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    if (err.response?.statusCode == 401) {
      try {
        final refreshToken = await _storage.getRefreshToken();
        if (refreshToken == null) {
          handler.next(err);
          return;
        }
        // Attempt token refresh
        final refreshDio = Dio(BaseOptions(
          baseUrl: err.requestOptions.baseUrl,
        ));
        final response = await refreshDio.post('/api/v1/auth/refresh', 
          data: {'refreshToken': refreshToken},
        );
        final newToken = response.data['accessToken'] as String;
        await _storage.saveAccessToken(newToken);
        // Retry original request with new token
        err.requestOptions.headers['Authorization'] = 'Bearer $newToken';
        final cloneReq = await Dio().fetch(err.requestOptions);
        handler.resolve(cloneReq);
        return;
      } catch (_) {
        await _storage.clearTokens();
        // Signal auth failure to app — handled by app router redirect
      }
    }
    handler.next(err);
  }
}

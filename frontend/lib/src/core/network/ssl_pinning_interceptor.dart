import 'package:dio/dio.dart';

/// Production-only SSL certificate pinning interceptor.
/// Replace _pinnedCertHashes with your actual certificate hashes.
class SslPinningInterceptor extends Interceptor {
  static const _pinnedCertHashes = [
    'sha256/REPLACE_WITH_REAL_HASH=',
  ];

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    // TODO: Implement using http_certificate_pinning package.
    // Validate that the server certificate hash matches _pinnedCertHashes.
    // Reject if no match found.
    handler.next(options);
  }
}

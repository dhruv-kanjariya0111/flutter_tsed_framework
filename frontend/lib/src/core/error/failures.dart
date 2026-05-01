import 'package:freezed_annotation/freezed_annotation.dart';

part 'failures.freezed.dart';

@freezed
sealed class Failure with _$Failure {
  const Failure._();

  const factory Failure.network({
    required String message,
    int? statusCode,
  }) = NetworkFailure;

  const factory Failure.auth({
    required String message,
  }) = AuthFailure;

  const factory Failure.notFound({
    required String message,
  }) = NotFoundFailure;

  const factory Failure.validation({
    required String message,
    Map<String, List<String>>? fieldErrors,
  }) = ValidationFailure;

  const factory Failure.server({
    required String message,
  }) = ServerFailure;

  const factory Failure.unknown({
    required String message,
  }) = UnknownFailure;

  String toUserMessage() {
    return switch (this) {
      NetworkFailure() => 'Network error. Please check your connection and retry.',
      AuthFailure() => 'Authentication failed. Please sign in again.',
      NotFoundFailure(message: final m) => m,
      ValidationFailure(message: final m) => m,
      ServerFailure() => 'Something went wrong on our end. Please try again.',
      UnknownFailure() => 'An unexpected error occurred. Please try again.',
    };
  }
}

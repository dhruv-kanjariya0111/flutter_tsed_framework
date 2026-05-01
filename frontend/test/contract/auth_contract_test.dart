import 'dart:convert';
import 'package:flutter_test/flutter_test.dart';
import 'package:frontend/src/features/auth/data/dtos/user_dto.dart';

void main() {
  group('Auth API Contract Tests', () {
    // Fixture: actual JSON response from staging API
    const loginResponseJson = '''
    {
      "accessToken": "eyJhbGciOiJIUzI1NiJ9.test",
      "refreshToken": "refresh-token-test",
      "user": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "email": "user@example.com",
        "display_name": "Test User",
        "created_at": "2024-01-01T00:00:00.000Z",
        "last_login_at": "2024-06-01T12:00:00.000Z"
      }
    }
    ''';

    test('AuthResponseDto deserializes correctly from API response', () {
      final json = jsonDecode(loginResponseJson) as Map<String, dynamic>;
      final dto = AuthResponseDto.fromJson(json);

      expect(dto.accessToken, isNotEmpty);
      expect(dto.refreshToken, isNotEmpty);
      expect(dto.user.id, equals('550e8400-e29b-41d4-a716-446655440000'));
      expect(dto.user.email, equals('user@example.com'));
      expect(dto.user.displayName, equals('Test User'));
      expect(dto.user.createdAt, isNotNull);
    });
  });
}

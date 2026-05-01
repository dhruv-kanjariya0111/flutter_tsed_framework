import 'package:frontend/src/features/auth/domain/entities/user_entity.dart';

class UserEntityFactory {
  static UserEntity create({
    String id = 'test-user-id',
    String email = 'test@example.com',
    String displayName = 'Test User',
  }) =>
      UserEntity(id: id, email: email, displayName: displayName);
}

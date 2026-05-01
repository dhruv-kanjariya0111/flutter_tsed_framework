import '../dtos/user_dto.dart';
import '../../domain/entities/user_entity.dart';

class UserMapper {
  static UserEntity fromDto(UserDto dto) => UserEntity(
    id: dto.id,
    email: dto.email,
    displayName: dto.displayName,
    createdAt: dto.createdAt,
    lastLoginAt: dto.lastLoginAt,
  );
}

import { Property } from '@tsed/schema';

export class UserResponseDto {
  @Property()
  id!: string;

  @Property()
  email!: string;

  @Property()
  displayName!: string;

  @Property()
  createdAt!: Date;
}

export class AuthResponseDto {
  @Property()
  accessToken!: string;

  @Property()
  refreshToken!: string;

  @Property(UserResponseDto)
  user!: UserResponseDto;
}

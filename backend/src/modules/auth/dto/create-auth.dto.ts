import { Property, Required, Format, MinLength, MaxLength } from '@tsed/schema';
import { IsEmail, IsString, MinLength as CVMinLength, MaxLength as CVMaxLength, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @Property()
  @Required()
  @IsEmail()
  @Format('email')
  email!: string;

  @Property()
  @Required()
  @IsString()
  @IsNotEmpty()
  @CVMinLength(8)
  @CVMaxLength(128)
  password!: string;
}

export class RegisterDto {
  @Property()
  @Required()
  @IsEmail()
  @Format('email')
  email!: string;

  @Property()
  @Required()
  @IsString()
  @CVMinLength(8)
  @CVMaxLength(128)
  password!: string;

  @Property()
  @Required()
  @IsString()
  @IsNotEmpty()
  @CVMinLength(2)
  @CVMaxLength(50)
  displayName!: string;
}

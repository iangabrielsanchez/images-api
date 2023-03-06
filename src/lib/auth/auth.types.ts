import { APIError, APIResponse } from '../common/common.types';
import {
  IsString,
  IsOptional,
  IsEmail,
  IsBoolean,
  IsMongoId,
  IsJWT,
  MinLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user/user.types';

export class RegisterParams {
  @IsString()
  fullName: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z]).*$/, {
    message: 'must contain at least 1 lowercase character',
  })
  @Matches(/^(?=.*[A-Z]).*$/, {
    message: 'must contain at least 1 uppercase character',
  })
  @Matches(/^(?=.*[@#$%^&+=!]).*$/, {
    message: 'must contain at least 1 special character',
  })
  password: string;
}

export class LoginParams {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsBoolean()
  @IsOptional()
  rememberMe?: boolean;
}

export class RefreshParams {
  @IsString()
  @IsJWT()
  refreshToken: string;
}

export class RefreshResult {
  accessToken: string;
  refreshToken: string;
}

export class TokenPayload {
  sub: string;
  email: string;
}

export class JwtTokenPayload extends TokenPayload {
  iat: number;
  exp: number;
}

export class LoginResult {
  accessToken: string;
  refreshToken: string;
  payload: TokenPayload;
}

export class RegisterResponse extends APIResponse {
  @ApiProperty()
  data?: User;
  constructor(ok: boolean, response: User | APIError) {
    super(ok, response);
  }
}

export class LoginResponse extends APIResponse {
  @ApiProperty()
  data?: LoginResult;
}

export class RefreshResponse extends APIResponse {
  @ApiProperty()
  data?: RefreshResult;
}

export class LogoutResponse extends APIResponse {
  data: never;
}

export class OrganizationLoginInput {
  @IsString()
  @IsMongoId()
  organization: string;

  @IsBoolean()
  @IsOptional()
  rememberMe?: boolean;
}

export class AuthCheckInvitationsQuery {
  @IsString()
  @IsEmail()
  email: string;
}

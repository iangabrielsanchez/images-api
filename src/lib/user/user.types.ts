/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { IsOptional, IsString, IsMongoId, MinLength } from 'class-validator';
import { GenericDBType, APIResponse, APIError } from '../common/common.types';

export class User extends GenericDBType {
  email: string;
  fullName: string;

  static init(data: any): User {
    data = typeof data === 'object' ? data : {};

    const result = new User();

    result._id = data._id?.toString();
    result.email = data.email;
    result.fullName = data.fullName;
    result.__v = data.__v;

    return result;
  }

  static toJSON(data: any): any {
    const user = User.init(data);
    return JSON.parse(JSON.stringify(user));
  }
}

export class UserResponse extends APIResponse {
  data?: User;
  constructor(ok: boolean, result: User | APIError) {
    super(ok, result);
  }
}

export class UpdateUserInput {
  @IsString()
  @IsOptional()
  fullName?: string;
}

export class UserParams {
  @IsMongoId()
  @IsString()
  userId: string;
}

export class PasswordUpdateInput {
  @IsString()
  @MinLength(8)
  oldPassword: string;

  @IsString()
  @MinLength(8)
  newPassword: string;
}

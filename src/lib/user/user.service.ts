import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { IUser, IUserDocument, UserModel } from './user.model';
import { PasswordUpdateInput, User } from './user.types';
import { AuthUtils } from '../auth/utils/auth-utils';
import { AuthService } from '../auth/auth.service';
import { FilterQuery } from 'mongoose';
import { CrudService } from '../common/crud.service';
import { StorageService } from '@codebrew/nestjs-storage';
import { Storage } from '@slynova/flydrive';

@Injectable()
export class UserService extends CrudService<IUser, IUserDocument> {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {
    super(UserModel);
  }

  async me(userId: string): Promise<IUserDocument> {
    const user = this.get({ _id: userId });
    return user;
  }

  get(
    filter: FilterQuery<IUserDocument> | undefined,
    projection?: unknown,
  ): Promise<IUserDocument> {
    if (filter?.email) {
      filter.email = this.getCaseInsensitiveEmailRegex(filter.email.toString());
    }
    return super.get(filter, projection);
  }

  async updatePassword(
    email: string,
    passwords: PasswordUpdateInput,
  ): Promise<IUserDocument> {
    const validatedUser = (await this.authService.validateUser(
      email,
      passwords.oldPassword,
    )) as User;

    if (validatedUser === null) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const updatedPassword = await AuthUtils.generateSaltAndHash(
      passwords.newPassword,
    );

    return this.update(validatedUser._id.toString(), updatedPassword);
  }

  private getCaseInsensitiveEmailRegex(email: string): RegExp {
    return new RegExp(['^', email, '$'].join(''), 'i');
  }
}

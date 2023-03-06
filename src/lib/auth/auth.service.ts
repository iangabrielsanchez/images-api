import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { AuthUtils } from './utils/auth-utils';
import { LoginResult, RefreshResult, TokenPayload } from './auth.types';
import { TokenService } from './token/token.service';
import { IUserDocument, UserModel } from '../user/user.model';
import { UserService } from '../user/user.service';
import { User } from '../user/user.types';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private tokenService: TokenService,
  ) {}

  async getTokenPayload(
    email: string,
    pass: string,
  ): Promise<TokenPayload | null> {
    const user = (await this.validateUser(email, pass, true)) as IUserDocument;

    if (user === null) {
      return null;
    }

    return this.buildTokenPayload(user);
  }

  async refresh(refreshToken: string): Promise<RefreshResult> {
    if (await this.tokenService.isTokenRevoked(refreshToken)) {
      throw new ForbiddenException();
    }

    return this.tokenService.refresh(refreshToken);
  }

  async login(payload: TokenPayload, rememberMe = false): Promise<LoginResult> {
    return {
      accessToken: this.tokenService.getAccessToken(payload),
      refreshToken: this.tokenService.getRefreshToken(payload, rememberMe),
      payload,
    };
  }

  async revoke(refreshToken: string): Promise<void> {
    await this.tokenService.revokeRefreshToken(refreshToken);
  }

  async register(
    email: string,
    password: string,
    fullName: string,
  ): Promise<User> {
    const userMatchedTheEmail = await UserModel.findOne({
      email: email,
    }).exec();
    if (userMatchedTheEmail) {
      throw new ConflictException('User already exists');
    }

    const { salt, hash } = await AuthUtils.generateSaltAndHash(password);

    const newUser = await this.userService.add({
      email,
      fullName,
      salt,
      hash,
    });

    return newUser.toObject() as unknown as User;
  }

  async resetPassword(
    user: User,
    currentPassword: string,
    newPassword: string,
  ): Promise<IUserDocument> {
    const tokenPayload = await this.getTokenPayload(
      user.email,
      currentPassword,
    );

    if (tokenPayload === null) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const updatedCredentials = await AuthUtils.generateSaltAndHash(newPassword);
    return this.userService.update(tokenPayload.sub, updatedCredentials);
  }

  async validateUser(
    email: string,
    pass: string,
    returnAsDocument = false,
  ): Promise<User | IUserDocument | null> {
    const emailRegex = new RegExp(
      `^${email.replace(/[!#$%&'*+-/=?^_`{|}~.]/g, '\\$&')}$`,
      'i',
    );

    const user = await UserModel.findOne({ email: { $regex: emailRegex } })
      .select(['+salt', '+hash'])
      .exec();
    if (user === null) {
      return null;
    }

    const { salt, hash } = user as Required<IUserDocument>;
    const valid = await AuthUtils.validatePassword(pass, hash, salt);

    if (valid) {
      if (returnAsDocument) {
        return user;
      }
      user.set('salt', undefined);
      user.set('hash', undefined);
      return user.toObject() as unknown as User;
    }
    return null;
  }

  private async buildTokenPayload(user: IUserDocument): Promise<TokenPayload> {
    return {
      sub: user._id.toString(),
      email: user.email as string,
    };
  }
}

import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../auth.service';
import { TokenPayload } from '../../auth.types';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<TokenPayload> {
    const tokenPayload = await this.authService.getTokenPayload(
      email,
      password,
    );
    if (!tokenPayload) {
      throw new UnauthorizedException();
    }

    return tokenPayload;
  }
}

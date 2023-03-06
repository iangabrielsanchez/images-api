import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import config from '../../../config';
import { JwtTokenPayload, RefreshResult, TokenPayload } from '../auth.types';
import { TokenModel } from './token.model';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  private getExpirationDate(token: string): Date {
    const decoded = this.jwtService.decode(token) as any;

    // decoded.exp is in sec from epoch and Date needs to accept ms
    return new Date(decoded.exp * 1000);
  }

  async isTokenRevoked(token: string): Promise<boolean> {
    const tokenDocument = await TokenModel.findOne({ token }).exec();
    return tokenDocument === null;
  }

  async refresh(refreshToken: string): Promise<RefreshResult> {
    const { refresh } = config.jwt;
    const options = { secret: refresh.secret };

    try {
      const { sub, email } = this.jwtService.verify<JwtTokenPayload>(
        refreshToken,
        options,
      );

      return {
        accessToken: this.getAccessToken({
          sub,
          email,
        }),
        refreshToken: refreshToken,
      };
    } catch (error) {
      throw new ForbiddenException();
    }
  }

  getAccessToken(payload: TokenPayload): string {
    const { access } = config.jwt;
    const options = {
      secret: access.secret,
      expiresIn: access.expiration,
    };

    return this.jwtService.sign(payload, options);
  }

  getRefreshToken(payload: TokenPayload, rememberMe: boolean): string {
    const { refresh } = config.jwt;
    const options = {
      secret: refresh.secret,
      expiresIn: rememberMe ? refresh.rememberMeExpiration : refresh.expiration,
    };

    const refreshToken = this.jwtService.sign(payload, options);
    const expiration = this.getExpirationDate(refreshToken);

    TokenModel.create({ token: refreshToken, expires: expiration });
    return refreshToken;
  }

  async revokeRefreshToken(refreshToken: string): Promise<void> {
    await TokenModel.findOneAndDelete({ token: refreshToken }).exec();
  }
}

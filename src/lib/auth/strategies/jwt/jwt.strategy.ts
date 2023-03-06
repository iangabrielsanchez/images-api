import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import config from '../../../../config';
import { TokenPayload } from '../../auth.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwt.access.secret,
    });
  }

  async validate(payload: TokenPayload): Promise<TokenPayload | null> {
    return payload;
  }
}

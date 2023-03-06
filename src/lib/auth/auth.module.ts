import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt/jwt.strategy';
import { LocalStrategy } from './strategies/local/local.strategy';
import config from '../../config';
import { TokenService } from './token/token.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: config.jwt.access.secret,
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, TokenService],
  exports: [AuthService, TokenService],
})
export class AuthModule {}

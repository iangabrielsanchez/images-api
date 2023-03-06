import { Module, ValidationPipe } from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './lib/auth/auth.module';
import { JwtAuthGuard } from './lib/auth/strategies/jwt/jwt-auth.guard';
import { ImageModule } from './lib/images/image.module';
import { UserModule } from './lib/user/user.module';

@Module({
  imports: [AuthModule, UserModule, ImageModule],
  controllers: [AppController],
  providers: [
    AppService,
    JwtAuthGuard,
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          transform: true,
          whitelist: true,
          forbidNonWhitelisted: true,
        }),
    },
    {
      provide: APP_GUARD,
      useExisting: JwtAuthGuard,
    },
  ],
})
export class AppModule {}

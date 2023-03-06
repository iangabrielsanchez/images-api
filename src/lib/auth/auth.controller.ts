import {
  JwtTokenPayload,
  LoginParams,
  LoginResponse,
  RefreshParams,
  RefreshResponse,
  RegisterParams,
  RegisterResponse,
} from './auth.types';
import { APIResponse } from '../common/common.types';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './strategies/local/local-auth.guard';
import { RequestToken, Public } from './auth.decorator';
import { APIUtils } from '../utils/api-utils';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ operationId: 'AuthRegister' })
  async register(
    @Body() requestBody: RegisterParams,
  ): Promise<RegisterResponse> {
    const { email, password, fullName } = requestBody;

    return APIUtils.handle(
      this.authService.register(email, password, fullName),
      RegisterResponse,
    );
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ operationId: 'AuthLogin' })
  async login(
    @RequestToken() payload: JwtTokenPayload,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() credentials: LoginParams, //exposes the request body schema to swagger-ui
  ): Promise<LoginResponse> {
    return APIUtils.handle(
      this.authService.login(payload, credentials.rememberMe),
      LoginResponse,
    );
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ operationId: 'AuthRefresh' })
  async refresh(
    @Body() { refreshToken }: RefreshParams,
  ): Promise<RefreshResponse> {
    return APIUtils.handle(
      this.authService.refresh(refreshToken),
      RefreshResponse,
    );
  }

  @ApiBearerAuth()
  @Post('revoke')
  @ApiOperation({ operationId: 'AuthRevoke' })
  async revoke(@Body() { refreshToken }: RefreshParams): Promise<APIResponse> {
    return APIUtils.handle(this.authService.revoke(refreshToken), APIResponse);
  }
}

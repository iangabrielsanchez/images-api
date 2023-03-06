import { UserService } from './user.service';
import {
  UpdateUserInput,
  UserResponse,
  UserParams,
  PasswordUpdateInput,
  User,
} from './user.types';
import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { APIUtils } from '../utils/api-utils';
import { RequestToken, RequestUser } from '../auth/auth.decorator';
import { JwtTokenPayload } from '../auth/auth.types';
import { CurrentUserPolicy } from '../policies/user-policies';

@ApiBearerAuth()
@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @ApiOperation({ operationId: 'UserMe' })
  me(@RequestToken() token: JwtTokenPayload): Promise<UserResponse> {
    return APIUtils.handle(this.userService.me(token.sub), UserResponse);
  }

  @Get(':userId')
  @ApiOperation({ operationId: 'UserGet' })
  get(@Param() param: UserParams): Promise<UserResponse> {
    return APIUtils.handle(
      this.userService.get({
        _id: param.userId,
      }),
      UserResponse,
    );
  }

  @Patch(':userId')
  @ApiOperation({ operationId: 'UserUpdate' })
  @UseGuards(CurrentUserPolicy)
  update(
    @Param() param: UserParams,
    @Body() updates: UpdateUserInput,
  ): Promise<UserResponse> {
    return APIUtils.handle(
      this.userService.update(param.userId, updates),
      UserResponse,
    );
  }

  @Delete(':userId')
  @ApiOperation({ operationId: 'UserDelete' })
  @UseGuards(CurrentUserPolicy)
  delete(@Param() param: UserParams): Promise<UserResponse> {
    return APIUtils.handle(
      this.userService.delete(param.userId).then((deletedUser) => {
        return deletedUser.toObject();
      }),
      UserResponse,
    );
  }

  @Patch(':userId/updatePassword')
  @ApiOperation({ operationId: 'UserUpdatePassword' })
  updatePassword(
    @RequestUser() user: User,
    @Param() param: UserParams,
    @Body() body: PasswordUpdateInput,
  ): Promise<UserResponse> {
    if (user._id !== param.userId) {
      throw new ConflictException('User mismatch');
    }
    return APIUtils.handle(
      this.userService.updatePassword(user.email, body),
      UserResponse,
    );
  }
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { SetMetadata } from '@nestjs/common';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserModel } from '../user/user.model';
import { User } from '../user/user.types';
import { JwtTokenPayload } from './auth.types';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const RequestToken = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as JwtTokenPayload;
  },
);

export const RequestUser = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const updatedUser = await UserModel.findById(request.user.sub).exec();
    return User.init(updatedUser);
  },
);

import {
  ConflictException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class CurrentUserPolicy {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { params, user: token } = context.switchToHttp().getRequest();

    if (params.userId !== token.sub) {
      throw new ConflictException('User mismatch');
    }
    return true;
  }
}

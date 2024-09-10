import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@app/shared/entities/user/entities';

export const InjectUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User | null => {
    const { user } = ctx.switchToHttp().getRequest();

    if (!user) {
      return null;
    }

    return user;
  },
);

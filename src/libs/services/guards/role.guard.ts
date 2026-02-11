import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Messages } from 'src/libs/utils/constants/messages';
import { ROLES_KEY } from '../decorators/role.decorator';
import { RequestPayload } from 'src/libs/utils/constants/interfaces';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      throw new ForbiddenException(Messages.ACCESS_DENIED);
    }

    const request = context.switchToHttp().getRequest<RequestPayload>();
    const { user } = request;

    if (!user?.role) {
      throw new ForbiddenException(Messages.ACCESS_DENIED);
    }

    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException(Messages.ACCESS_DENIED);
    }

    return true;
  }
}

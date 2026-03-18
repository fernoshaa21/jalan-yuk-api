import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<{ user?: Record<string, unknown> }>();
    const userRole = request.user?.role;
    const userRoles = request.user?.roles;

    if (typeof userRole === 'string' && requiredRoles.includes(userRole)) {
      return true;
    }

    if (Array.isArray(userRoles)) {
      const normalizedUserRoles = userRoles.filter(
        (role): role is string => typeof role === 'string',
      );
      if (requiredRoles.some((role) => normalizedUserRoles.includes(role))) {
        return true;
      }
    }

    throw new ForbiddenException(
      'You do not have permission to access this resource',
    );
  }
}

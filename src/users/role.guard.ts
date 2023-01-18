
import { UserRole } from './user.schema';
import { CanActivate, ExecutionContext, mixin, Type, HttpException, HttpStatus } from '@nestjs/common';
import RequestWithUser from '../authentication/requestWithUser.interface';
import {JwtAuthGuard} from '../authentication/jwt-authentication.guard';
 
const RoleGuard = (role: UserRole): Type<CanActivate> => {
  class RoleGuardMixin extends JwtAuthGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);
 
      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;

      if (!user?.roles.includes(role)) {
        throw new HttpException('Unauthorized to perform this action', HttpStatus.UNAUTHORIZED)
      }
 
      return user?.roles.includes(role);
    }
  }
 
  return mixin(RoleGuardMixin);
}
 
export default RoleGuard;
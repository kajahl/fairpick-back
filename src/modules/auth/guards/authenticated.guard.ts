import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        if(!request.isAuthenticated()) throw new HttpException('You must be authenticated to access this route', HttpStatus.UNAUTHORIZED);
        return true;
    }
}

@Injectable()
export class NotAuthenticatedGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        if(request.isAuthenticated()) {
            throw new HttpException('You cannot be authenticated to access this route', HttpStatus.FORBIDDEN);
        }
        return true;
    }
}
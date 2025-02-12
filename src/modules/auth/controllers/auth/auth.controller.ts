import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { LocalAuthLoginGuard } from '../../guards/local.guard';
import { AuthenticatedGuard, NotAuthenticatedGuard } from '../../guards/authenticated.guard';

@Controller('auth')
export class AuthController {
    @Post('login')
    @UseGuards(NotAuthenticatedGuard)
    @UseGuards(LocalAuthLoginGuard)
    async login(@Req() req: Request) {}

    @Get('me')
    @UseGuards(AuthenticatedGuard)
    async getMe(@Req() req: Request) {
        return req.user;
    }

    @Post('logout')
    @UseGuards(AuthenticatedGuard)
    async logout(@Req() req: Request) {
        req.logout({
            keepSessionInfo: true
        }, (err: any) => {
            console.error(err);
        });
        return null;
    }
}

import { Controller, Get, Post,  Req, UseGuards } from '@nestjs/common';
import { LocalAuthLoginGuard } from './guards/local.guard';
import { Request } from 'express';
import { AuthenticatedGuard } from './guards/authenticated.guard';

@Controller('auth')
export class AuthController {

    @Post('login')
    @UseGuards(LocalAuthLoginGuard)
    async login(@Req() req: any) {}

    
    @Get('me')
    @UseGuards(AuthenticatedGuard)
    async getMe(@Req() req: Request) {
        return req.user
    }

    @Post('logout')
    async logout(@Req() req: any) {
        req.logout();
    }
}

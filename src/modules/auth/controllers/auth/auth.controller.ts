import {
    BadRequestException,
    Controller,
    Get,
    InternalServerErrorException,
    Post,
    Req,
    Res,
    Session,
    UseFilters,
    UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LocalAuthLoginGuard } from '../../guards/local.guard';
import {
    AuthenticatedGuard,
    NotAuthenticatedGuard,
} from '../../guards/authenticated.guard';
import { TwitchAuthLoginGuard } from '../../guards/twitch.guard';
import { OAuthExceptionFilter } from '../../filters/OAuthException.filter';
import { AuthService } from '../../services/auth/auth.service';
import { TwitchService } from '../../services/twitch/twitch.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly twitchService: TwitchService,
    ) {}
    @Get('me')
    // @UseGuards(AuthenticatedGuard)
    async getMe(@Req() req: Request, @Session() session: Record<string, any>) {
        if (!req.user) return { session: session, message: 'Not authenticated' };
        return { session: session, user: req.user };
    }

    // Local login
    @Post('login')
    @UseGuards(LocalAuthLoginGuard)
    @UseGuards(NotAuthenticatedGuard)
    async login(@Req() req: Request) {}

    // Twitch login
    @Get('twitch')
    @UseGuards(TwitchAuthLoginGuard)
    @UseGuards(NotAuthenticatedGuard)
    async twitchAuth(@Req() req: Request) {}

    @Get('twitch/callback')
    @UseGuards(TwitchAuthLoginGuard)
    @UseGuards(NotAuthenticatedGuard)
    @UseFilters(OAuthExceptionFilter)
    async twitchAuthCallback(
        @Req() req: Request
    ) {
        const user = req.user;
        if (!user) throw new BadRequestException(`User not found in request`);
        if (!("id" in user)) throw new BadRequestException(`User id not found in request`);
        if (!("email" in user)) throw new BadRequestException(`User login not found in request`);
        const token = await this.twitchService.signIn(user as { id: string, email: string });
        return { token };
    }

    // Logout
    @Post('logout')
    @UseGuards(AuthenticatedGuard)
    async logout(@Req() req: Request, @Res() res: Response) {
        req.logout((err: any) => {
            if (err) {
                console.error(err);
                return res
                    .status(500)
                    .send({ message: 'An error occurred while logging out' });
            }
            return res.status(200).send({ message: 'Logged out' });
        });
    }
}

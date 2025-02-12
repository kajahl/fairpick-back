import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-twitch-new';
import { TwitchUser } from 'src/types/TwitchUser';
import { AuthService } from '../services/auth/auth.service';

@Injectable()
export class TwitchStrategy extends PassportStrategy(Strategy, 'twitch') {
    constructor(private authService: AuthService) {
        super({
            clientID: process.env.TWITCH_CLIENT_ID,
            clientSecret: process.env.TWITCH_CLIENT_SECRET,
            callbackURL: process.env.TWITCH_REDIRECT_URI,
            scope: ['user_read', "user:read:email"],
        });
    }

    async validate(accessToken: string, refreshToken: string, twitchUser: TwitchUser, done: Function): Promise<any> {
        const user = await this.authService.validateTwitchUser(twitchUser);
        if (!user) return done(new UnauthorizedException(), false);
        done(null, user);
    }
}

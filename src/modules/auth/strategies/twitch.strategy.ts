import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { TwitchUser } from 'src/types/TwitchUser';
import { TwitchService } from '../services/twitch/twitch.service';
import {
    Strategy as OAuth2Strategy,
    InternalOAuthError,
} from 'passport-oauth2';
import axios from 'axios';

export class TwitchOAuth2Strategy extends OAuth2Strategy {
    public name = 'twitch';
    private clientId: string;

    constructor(options: any, verify: any) {
        options.authorizationURL =
            options.authorizationURL || 'https://id.twitch.tv/oauth2/authorize';
        options.tokenURL =
            options.tokenURL || 'https://id.twitch.tv/oauth2/token';
        super(options, verify);
        this.name = 'twitch';
        this.clientId = options.clientID;
    }

    // Nadpisanie metody userProfile, aby pobrać dane użytkownika z Twitch API
    userProfile(
        accessToken: string,
        done: (err: Error | null, profile?: TwitchUser & { provider: string }) => void,
    ): void {
        const url = 'https://api.twitch.tv/helix/users';
        const headers = {
            'Client-ID': this.clientId,
            Authorization: `Bearer ${accessToken}`,
        };

        axios
            .get(url, { headers })
            .then((response) => {
                const userData = response.data.data && response.data.data[0];
                if (!userData) {
                    return done(new Error('No user data returned from Twitch'));
                }
                const profile: TwitchUser & { provider: string } = {
                    provider: 'twitch',
                    id: userData.id,
                    login: userData.login,
                    email: userData.email,
                    profile_image_url: userData.profile_image_url,
                    display_name: userData.display_name,
                };
                done(null, profile);
            })
            .catch((error) => {
                done(
                    new InternalOAuthError(
                        'Failed to fetch user profile',
                        error,
                    ),
                );
            });
    }
}

@Injectable()
export class TwitchStrategy extends PassportStrategy(
    TwitchOAuth2Strategy,
    'twitch',
) {
    constructor(private twitchService: TwitchService) {
        super({
            clientID: process.env.TWITCH_CLIENT_ID,
            clientSecret: process.env.TWITCH_CLIENT_SECRET,
            callbackURL: process.env.TWITCH_REDIRECT_URI,
            scope: ['user_read', 'user:read:email'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        twitchUser: TwitchUser,
        done: Function,
    ): Promise<any> {
        const localUser = await this.twitchService.validateUser(twitchUser);
        if (!localUser) done(null, null);
        done(null, localUser);
    }
}

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/modules/users/services/users/users.service';
import { TwitchUserEntity } from 'src/typeorm';
import { TwitchUser } from 'src/types/TwitchUser';
import { User } from 'src/types/User';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TwitchService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        @InjectRepository(TwitchUserEntity) private readonly twitchRepository: Repository<TwitchUserEntity>,
    ) {}

    async signIn(user: { id: string, email: string }): Promise<{ access_token: string }> {
        const payload = { email: user.email, sub: user.id, provider: 'twitch' };
        try {
            const token = this.jwtService.sign(payload);
            return {
                access_token: token,
            };
        } catch (error) {
            console.error("Error generating token:", error);
            throw new InternalServerErrorException("Error generating token");
        }
    }

    /**
     * Służy do walidacji użytkownika Twitcha - sprawdza czy użytkownik istnieje w bazie danych. Jeśli nie, to go dodaje.
     * @param twitchUser Obiekt użytkownika Twitcha
     * @returns Zwraca użytkownika z bazy danych
     */
    async validateUser(twitchUser: TwitchUser): Promise<User> {
        const existingTwitchUser = await this.getTwitchUserById(twitchUser.id);
        if (existingTwitchUser) {
            if(existingTwitchUser.user) return existingTwitchUser.user;
            return await this.createOrAssignUser(existingTwitchUser);
        }
        const newTwitchUser = await this.insertTwitchUser(twitchUser);
        return await this.createOrAssignUser(newTwitchUser);
    }

    private async insertTwitchUser(twitchUser: TwitchUser): Promise<TwitchUserEntity> {
        const twitchUserEntity = this.twitchRepository.create({
            id: twitchUser.id,
            login: twitchUser.login,
            email: twitchUser.email,
            display_name: twitchUser.display_name,
            profile_image_url: twitchUser.profile_image_url
        });
        return await this.twitchRepository.save(twitchUserEntity);
    }

    private async createOrAssignUser(twitchUser: TwitchUserEntity): Promise<User> {
        const userWithSameEmail = await this.usersService.findOneByEmail(twitchUser.email);
        if(userWithSameEmail) {
            await this.twitchRepository.update(twitchUser.id, {
                user: userWithSameEmail
            })
            return userWithSameEmail;
        }

        const user = await this.usersService.createUser({
            email: twitchUser.email,
            username: twitchUser.login,
            password: ''
        });
        await this.twitchRepository.update(twitchUser.id, {
            user
        })
        return user;
    }

    async getTwitchUserById(id: string): Promise<TwitchUserEntity | null> {
        if(!id) return null;
        return this.twitchRepository.findOne({ where: { id } });
    }

    async getTwitchUserByUserId(userId: number): Promise<TwitchUserEntity | null> {
        const user = await this.usersService.findOneById(userId);
        if(!user) return null;
        return this.twitchRepository.findOne({ where: { user } });
    }
}

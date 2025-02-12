import { PassportSerializer } from '@nestjs/passport';
import { User } from 'src/typeorm';
import { UsersService } from 'src/users/users.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(private readonly usersService: UsersService) {
        super();
    }

    serializeUser(user: User, done: (err: any, user: number) => void) {
        console.log(`Serializer`, user);
        done(null, user.id);
    }

    async deserializeUser(
        userId: number,
        done: (err: any, user: User | null) => void,
    ) {
        console.log(`Deserializer`, userId);
        const user = await this.usersService.findOneById(userId);
        return user ? done(null, user) : done(null, null);
    }
}

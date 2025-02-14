import { Module } from '@nestjs/common';
import { UsersModule } from 'src/modules/users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { SessionSerializer } from './utils/session.serializer';
import { AuthService } from './services/auth/auth.service';
import { AuthController } from './controllers/auth/auth.controller';
import { TwitchService } from './services/twitch/twitch.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwitchUserEntity } from 'src/typeorm';
import { TwitchStrategy } from './strategies/twitch.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        UsersModule,
        TypeOrmModule.forFeature([TwitchUserEntity]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '60s' },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [
        AuthService,
        LocalStrategy,
        SessionSerializer,
        TwitchService,
        TwitchStrategy,
    ],
    controllers: [AuthController],
})
export class AuthModule {}

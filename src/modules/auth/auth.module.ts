import { Module } from '@nestjs/common';
import { UsersModule } from 'src/modules/users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { SessionSerializer } from './utils/session.serializer';
import { AuthService } from './services/auth/auth.service';
import { AuthController } from './controllers/auth/auth.controller';

@Module({
    imports: [UsersModule],
    providers: [AuthService, LocalStrategy, SessionSerializer],
    controllers: [AuthController],
})
export class AuthModule {}

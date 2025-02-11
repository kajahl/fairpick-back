import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api/v1');
    app.use(
        session({
            name: 'fp-sid',
            secret: process.env.SESSION_SECRET || 'secret',
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 60 * 60 * 1000,
                secure: process.env.ENV != 'development',
                sameSite: process.env.ENV === 'development' ? 'none' : 'strict',
            },
        }),
    );
    app.use(passport.initialize());
    app.use(passport.session());
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

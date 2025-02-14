import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { TypeormStore } from 'connect-typeorm';
import { getRepository, createConnection } from 'typeorm';
import { SessionEntity } from './typeorm';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
    await createConnection({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        entities: [SessionEntity],
        synchronize: process.env.ENV === 'development',
    });

    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const sessionRepository = getRepository(SessionEntity);
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
            store: new TypeormStore({
                cleanupLimit: 2,
                limitSubquery: false,
                ttl: 86400,
            }).connect(sessionRepository),
        }),
    );
    app.use(cookieParser(process.env.COOKIE_SECRET || 'secret', {}));
    app.use(passport.initialize());
    app.use(passport.session());
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

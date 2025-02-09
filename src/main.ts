import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1')
//   app.use(
//     session({
//         name: 'fairpick-session',
//         secret: process.env.SESSION_SECRET,

//     })
//   )
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

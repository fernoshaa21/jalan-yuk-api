<<<<<<< HEAD
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
=======
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
>>>>>>> a624e17ae22546c11ff0bfc9b09344961058917f
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
<<<<<<< HEAD
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
=======
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
>>>>>>> a624e17ae22546c11ff0bfc9b09344961058917f

import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './libs/helpers/exception-filter/exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const httpAdapterHost: HttpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionFilter(httpAdapterHost));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { addNotFoundHandler, configureApp } from './app.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  configureApp(app);
  app.enableCors({ origin: config.get<string>('CORS_ORIGIN') ?? '*' });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('G-Scores API')
    .setDescription('Vietnamese high school exam results, 2024')
    .setVersion('1.0')
    .build();
  SwaggerModule.setup(
    'api/docs',
    app,
    SwaggerModule.createDocument(app, swaggerConfig),
  );

  await app.init();
  addNotFoundHandler(app);

  await app.listen(config.get<string>('PORT') ?? 3000, '0.0.0.0');
}
bootstrap();

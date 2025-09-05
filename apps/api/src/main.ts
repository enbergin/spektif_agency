import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: [
        'http://localhost:3000', 
        'http://0.0.0.0:3000',
        'http://localhost:8080',
        'http://0.0.0.0:8080',
        'https://spektif-agency-final-app.vercel.app',
        'https://spektif-agency-final-app-*.vercel.app', // For preview deployments
        /\.vercel\.app$/ // Allow all vercel domains for your project
      ],
      credentials: true,
    },
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Spektif Agency API')
    .setDescription('Trello-style workspace API with chat and billing')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Spektif Agency API is running on port ${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/docs`);
}
bootstrap();

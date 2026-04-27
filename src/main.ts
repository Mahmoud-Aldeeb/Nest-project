import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // لمنع ارسال كي مش موجود في البادي
  app.useGlobalPipes(
    new ValidationPipe({
      // دا بيسمح بالارسال ولكن مش بياخدها من البدي
      whitelist: true,
      // دا بيمنع وبيظهر ايرور
      forbidNonWhitelisted: true,
    }),
  );

  // Apply Middlewares
  app.use(helmet());

  app.enableCors({
    origin: 'http://localhost:3001',
  });

  const swagger = new DocumentBuilder()
    .setTitle('Nest JS Course - App API')
    .setDescription('Your API description')
    .addServer('http://localhost:3000')
    .setVersion('1.0')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      description: 'Enter JWT token',
      in: 'header',
    })
    .build();
  const documentation = SwaggerModule.createDocument(app, swagger);
  // http://localhost:3000/swagger
  SwaggerModule.setup('swagger', app, documentation, {
    swaggerOptions: {
      persistAuthorization: true, // ✅ يحفظ التوكن بين الـ requests
      docExpansion: 'none', // ✅ يطوي الأقسام تلقائياً
    },
  });

  await app.listen(3000);
}
bootstrap();

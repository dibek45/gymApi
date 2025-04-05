import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
//import { graphqlUploadExpress } from 'graphql-upload';
import * as bodyParser from 'body-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  
  // 🚀 Serve 'uploads' directory as static files
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // 🔹 Setup WebSocket Adapter
  app.useWebSocketAdapter(new IoAdapter(app));

  // 🔹 Increase request body size limit
  app.use(bodyParser.json({ limit: '50mb' }));

  const isProd = process.env.NODE_ENV === 'production';
  const whitelist = [
    'https://api.dibeksolutions.com',
    'https://localhost',
    'capacitor://localhost',
    'http://localhost:3000',
    'http://localhost:4200',
    'http://127.0.0.1:4200',
    'http://192.168.1.75:3000',
  ];
  
  app.enableCors({
    origin: (origin, callback) => {
      // Si no hay origin (por ejemplo, una llamada desde CURL), lo permitimos
      if (!origin || whitelist.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`❌ Blocked by CORS: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  

  // 🔹 GraphQL Upload Middleware (if using file uploads)
//  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

  // 🔹 Setup Global Validation Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove undefined properties from DTOs
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties exist
    }),
  );

  // 🔹 Start the HTTP Server
  await app.listen(3000, '0.0.0.0');
  console.log(`🚀 Server running at http://localhost:3000/graphql`);
}

bootstrap();

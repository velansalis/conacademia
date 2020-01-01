import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

require('dotenv').config();

async function bootstrap() {
    const port = 3000;
    const app = await NestFactory.create(AppModule);
    await app.listen(port);
    Logger.log(`Server Running in http://localhost:${port}`, 'Bootstrap');
}
bootstrap();

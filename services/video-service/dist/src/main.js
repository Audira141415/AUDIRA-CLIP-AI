"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Video Service API')
        .setDescription('Internal Video API for AUDIRA-CLIP-AI')
        .setVersion('1.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    app.connectMicroservice({
        transport: microservices_1.Transport.REDIS,
        options: {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
            retryAttempts: 10,
            retryDelay: 3000,
        },
    });
    await app.startAllMicroservices();
    await app.listen(3345);
    console.log('Video Microservice is listening on HTTP port 3345 and Redis');
}
bootstrap();
//# sourceMappingURL=main.js.map
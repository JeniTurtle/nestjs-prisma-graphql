import timeout from 'fastify-server-timeout';
import { ConfigService } from '@jiaxinjiang/nest-config';
import { LoggerProvider, requestContextPlugin } from '@jiaxinjiang/nest-logger';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import compress from 'fastify-compress';
import helmet from 'fastify-helmet';
import rateLimit from 'fastify-rate-limit';
import { AppModule } from '@/application/app.module';
import { TransformInterceptor } from '@/interceptor';
import { LoggerMiddleware } from '@/middleware';
import { ValidationPipe, CamelCasePipe } from '@/pipe';
import { SwaggerModule, DocumentBuilder , SwaggerUtils } from '@/global/swagger';
import { HttpExceptionFilter } from '@/filter/exception.filter';

async function bootstrap() {
  const urlPrefix = 'api';
  const adapter = new FastifyAdapter();
  const nestApp = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
  );
  const configService = nestApp.get(ConfigService);
  const validationPipe = nestApp.get(ValidationPipe);
  const camelCasePipe = nestApp.get(CamelCasePipe);
  const loggerMiddleware = nestApp.get(LoggerMiddleware);
  const httpExceptionFilter = nestApp.get(HttpExceptionFilter);
  const transformInterceptor = nestApp.get(TransformInterceptor);
  const loggerService = (await nestApp.resolve(LoggerProvider)).setContext(
    configService.get('appName'),
  );
  const serverPort = configService.get('port');
  nestApp.enableShutdownHooks();
  // 设置跨域，可具体传参配置
  nestApp.enableCors(configService.get('cors'));
  // 设置全局前缀
  nestApp.setGlobalPrefix(urlPrefix);
  // 设置全局logger
  nestApp.useLogger(loggerService);
  // 设置全局中间件
  nestApp.use(loggerMiddleware.callUse());
  // 捕获全局错误
  nestApp.useGlobalFilters(httpExceptionFilter);
  // 设置全局拦截器
  nestApp.useGlobalInterceptors(transformInterceptor);
  // 设置全局管道
  nestApp.useGlobalPipes(camelCasePipe, validationPipe);
  // 安全防护
  adapter.register(helmet);
  // 日志请求id
  adapter.register(requestContextPlugin);
  // 压缩请求
  adapter.register(compress);
  // 设置响应超时时间
  adapter.register(timeout, {
    serverTimeout: 10000, // ms
  });
  // 限制访问频率，多实例建议走redis
  adapter.register(rateLimit, {
    max: 200,
    timeWindow: 1000, // 一秒钟
  });
  // 生产环境不开放swagger
  if (!configService.isProd()) {
    // 设置Swagger文档
    const {
      bearerAuth,
      title,
      description,
      version,
      urlPath,
    } = configService.get('swagger');
    const options = new DocumentBuilder()
      .setTitle(title)
      .setDescription(description)
      .setVersion(version)
      .addBearerAuth({ ...bearerAuth })
      .build();
    const document = SwaggerModule.createDocument(nestApp, options);
    SwaggerUtils.humpToSnake(document);
    SwaggerModule.setup(urlPath, nestApp, document);
  }
  await nestApp.listen(serverPort, '0.0.0.0');
  const url = await nestApp.getUrl();
  loggerService.log(`Nest server listen on ${url}`);
}
bootstrap();

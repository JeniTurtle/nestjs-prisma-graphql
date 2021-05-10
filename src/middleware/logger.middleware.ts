import UUID from 'uuid-int';
import { IncomingMessage } from 'http';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectLogger, LoggerProvider, REQUEST_ID_HEADER } from '@jiaxinjiang/nest-logger';

const generator = UUID(1);

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(@InjectLogger(LoggerMiddleware) private logger: LoggerProvider) {}

  callUse() {
    return this.use.bind(this);
  }

  async use(request: IncomingMessage, response, next) {
    const uuid = String(generator.uuid());
    if (!request.headers[REQUEST_ID_HEADER]) {
      request.headers[REQUEST_ID_HEADER] = uuid;
    }
    await next();
    this.logger.setContext(`${LoggerMiddleware.name}-${request.headers[REQUEST_ID_HEADER]}`);
    const content = `[${request.method}] ${response.statusCode} -> ${request.url}`;
    this.logger.log(`${content}`);
  }
}

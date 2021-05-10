import { ConfigModule } from '@jiaxinjiang/nest-config';
import { LoggerModule } from '@jiaxinjiang/nest-logger';
import { Module } from '@nestjs/common';
import { GraphQLPackingModule } from '@/global/graphql'
import { LoggerMiddleware } from '@/middleware';
import { CamelCasePipe, ValidationPipe } from '@/pipe';
import { TransformInterceptor } from '@/interceptor';
import { GraphQLModule } from './graphql/graphql.module'
import { HttpExceptionFilter } from '@/filter/exception.filter';

@Module({
  imports: [
    ConfigModule,
    LoggerModule.forRoot(),
    GraphQLPackingModule.forRootAsync(),
    GraphQLModule,
  ],
  providers: [
    LoggerMiddleware,
    ValidationPipe,
    CamelCasePipe,
    TransformInterceptor,
    HttpExceptionFilter,
  ]
})

export class AppModule {}

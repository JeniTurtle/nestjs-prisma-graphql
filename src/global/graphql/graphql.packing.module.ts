import { DynamicModule, Global, Module } from '@nestjs/common';
import { GqlModuleOptions, GraphQLModule } from '@nestjs/graphql';
import { ConfigService } from '@jiaxinjiang/nest-config';
import { LoggerProvider } from '@jiaxinjiang/nest-logger';
import { GraphQLLoggingPlugin } from './graphql.logging.plugin'
import prismaClient from './prisma.client'

@Global()
@Module({})
export class GraphQLPackingModule {
  static forRootAsync(): DynamicModule {
    return {
      module: GraphQLPackingModule,
      providers: [GraphQLLoggingPlugin],
      imports: [
        GraphQLModule.forRootAsync({
          useFactory: (
            configService: ConfigService,
            logger,
          ) => {
            const config: GqlModuleOptions = configService.get('graphql')
            logger.setContext('PrismaClient')
            return {
              ...config,
              context: (ctx) => {
                prismaClient.logger = logger
                return { req: ctx.request, prisma: prismaClient, reply: ctx.reply } as AppContext
              },
              logger,
            }
          },  
          inject: [ConfigService, LoggerProvider],
        }),
      ],
      exports: [],
    };
  }
}

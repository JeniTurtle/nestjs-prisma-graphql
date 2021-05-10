import { Plugin } from '@nestjs/graphql';
import {
  ApolloServerPlugin,
} from 'apollo-server-plugin-base';
import {
  GraphQLRequestContext,
} from 'apollo-server-types';

@Plugin()
export class GraphQLLoggingPlugin implements ApolloServerPlugin {
  requestDidStart({ logger, request }: GraphQLRequestContext) {
    logger.info(`GraphQL query: \n${request.query}`)
  }
}
import { GqlModuleOptions } from '@nestjs/graphql';
import { join } from 'path';
import globalConfig from './global.config'

export default {
  autoSchemaFile: join(globalConfig.rootDir, 'schema.gql'),
  debug: true,
  introspection: true,
} as GqlModuleOptions
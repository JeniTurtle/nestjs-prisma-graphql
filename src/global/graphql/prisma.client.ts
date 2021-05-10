
import { LoggerProvider } from '@jiaxinjiang/nest-logger';
import { PrismaClient } from '@prisma/client';
import { EventEmitter } from 'events';

export interface Prisma extends PrismaClient<{
  log
}> {
  logger?: LoggerProvider
}

const prisma: Prisma = new PrismaClient({
  log: [
    {
      level: 'info',
      emit: 'event',
    },
    {
      level: 'query',
      emit: 'event',
    },
    {
      level: 'warn',
      emit: 'event',
    },
    {
      level: 'error',
      emit: 'event',
    },
  ],
});

prisma.$on<'query'>('query', e => {
  const logger =  prisma.logger || console
  logger.log(`${e.query} -- ${e.params} (${e.duration}ms)`)
})

prisma.$on('info', e => {
  const logger =  prisma.logger || console
  logger.log(e.message)
})

prisma.$on('warn', e => {
  const logger =  prisma.logger || console
  logger.warn(e.message)
})

prisma.$on('error', e => {
  const logger =  prisma.logger || console
  logger.error(e.message)
})

// const logEmitter: EventEmitter = prisma['_engine'].logEmitter
// logEmitter.removeAllListeners()
export default prisma;
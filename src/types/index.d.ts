import { PrismaClient } from '@prisma/client';
import { FastifyRequest, FastifyReply } from 'fastify'

declare global {
  type AppContext = {
    prisma: PrismaClient;
    req: FastifyRequest;
    reply: FastifyReply
  }
}

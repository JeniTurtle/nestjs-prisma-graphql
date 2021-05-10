import { Module } from '@nestjs/common';

import { PrismaService } from '@/application/graphql/database/prisma.service';

@Module({
  imports: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}

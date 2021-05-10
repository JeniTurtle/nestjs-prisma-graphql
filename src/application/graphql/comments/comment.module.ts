
import { Module } from '@nestjs/common';

import { PrismaModule } from '@/application/graphql/database/prisma.module';

import { CommentResolver } from './comment.resolver';
import { CommentService } from './comment.service';

@Module({
  imports: [PrismaModule],
  providers: [CommentService, CommentResolver],
})
export class CommentModule {}

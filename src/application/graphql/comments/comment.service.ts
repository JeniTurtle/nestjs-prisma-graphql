
import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/application/graphql/database/prisma.service';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}
}

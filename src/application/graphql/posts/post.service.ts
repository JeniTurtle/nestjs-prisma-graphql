
import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/application/graphql/database/prisma.service';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}
}

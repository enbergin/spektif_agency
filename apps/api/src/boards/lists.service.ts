import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ListsService {
  constructor(private prisma: PrismaService) {}

  // TODO: Implement list CRUD operations
  async findByBoard(boardId: string) {
    return this.prisma.list.findMany({
      where: { boardId },
      orderBy: { position: 'asc' },
      include: {
        cards: {
          orderBy: { position: 'asc' },
        },
      },
    });
  }
}

import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { ListsService } from './lists.service';
import { ListsController } from './lists.controller';

@Module({
  controllers: [BoardsController, ListsController],
  providers: [BoardsService, ListsService],
  exports: [BoardsService, ListsService],
})
export class BoardsModule {}

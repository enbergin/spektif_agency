import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ListsService } from './lists.service';

@ApiTags('Lists')
@Controller('lists')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Get()
  findByBoard(@Query('boardId') boardId: string) {
    return this.listsService.findByBoard(boardId);
  }
}

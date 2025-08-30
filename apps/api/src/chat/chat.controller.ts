import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { CreateConversationDto, CreateMessageDto, AddParticipantDto } from './dto/chat.dto';

@ApiTags('Chat')
@Controller('chat')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('conversations')
  @ApiOperation({ summary: 'Create a new conversation' })
  async createConversation(@Body() dto: CreateConversationDto, @Req() req) {
    return this.chatService.createConversation(dto, req.user.id);
  }

  @Get('conversations')
  @ApiOperation({ summary: 'Get user conversations' })
  @ApiQuery({ name: 'organizationId', required: true })
  async getConversations(
    @Query('organizationId') organizationId: string,
    @Req() req,
  ) {
    return this.chatService.getConversations(organizationId, req.user.id);
  }

  @Get('conversations/:conversationId/messages')
  @ApiOperation({ summary: 'Get messages in a conversation' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getMessages(
    @Param('conversationId') conversationId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
    @Req() req,
  ) {
    return this.chatService.getMessages(conversationId, req.user.id, page, limit);
  }

  @Post('conversations/:conversationId/messages')
  @ApiOperation({ summary: 'Send a message' })
  async sendMessage(
    @Param('conversationId') conversationId: string,
    @Body() dto: Omit<CreateMessageDto, 'conversationId' | 'authorId'>,
    @Req() req,
  ) {
    return this.chatService.createMessage({
      ...dto,
      conversationId,
      authorId: req.user.id,
    });
  }

  @Post('conversations/:conversationId/participants')
  @ApiOperation({ summary: 'Add participant to conversation' })
  async addParticipant(
    @Param('conversationId') conversationId: string,
    @Body() dto: AddParticipantDto,
    @Req() req,
  ) {
    return this.chatService.addParticipant(conversationId, dto.userId, req.user.id);
  }

  @Delete('conversations/:conversationId/participants/:userId')
  @ApiOperation({ summary: 'Remove participant from conversation' })
  async removeParticipant(
    @Param('conversationId') conversationId: string,
    @Param('userId') userId: string,
    @Req() req,
  ) {
    return this.chatService.removeParticipant(conversationId, userId, req.user.id);
  }
}

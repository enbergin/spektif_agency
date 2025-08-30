import { IsString, IsOptional, IsArray, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateConversationDto {
  @ApiProperty({ example: 'org-123' })
  @IsString()
  @IsNotEmpty()
  organizationId: string;

  @ApiProperty({ enum: ['DM', 'GROUP', 'CARD_THREAD'] })
  @IsEnum(['DM', 'GROUP', 'CARD_THREAD'])
  type: 'DM' | 'GROUP' | 'CARD_THREAD';

  @ApiProperty({ required: false, example: 'Project Discussion' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false, example: 'card-123' })
  @IsOptional()
  @IsString()
  cardId?: string;

  @ApiProperty({ type: [String], example: ['user-1', 'user-2'] })
  @IsArray()
  @IsString({ each: true })
  participantIds: string[];
}

export class CreateMessageDto {
  @ApiProperty({ example: 'conv-123' })
  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @ApiProperty({ example: 'user-123' })
  @IsString()
  @IsNotEmpty()
  authorId: string;

  @ApiProperty({ example: 'Hello, how are you?' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ required: false, example: 'msg-456' })
  @IsOptional()
  @IsString()
  replyToId?: string;
}

export class AddParticipantDto {
  @ApiProperty({ example: 'user-123' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}

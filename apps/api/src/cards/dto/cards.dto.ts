import { IsString, IsOptional, IsArray, IsNumber, IsBoolean, IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCardDto {
  @ApiProperty({ example: 'list-123' })
  @IsString()
  @IsNotEmpty()
  listId: string;

  @ApiProperty({ example: 'Instagram Stories Tasarımı' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: false, example: 'Müşteri için haftalık Instagram stories tasarımları hazırlanacak' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, example: '2024-01-15T10:00:00Z' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ required: false, type: [String], example: ['user-1', 'user-2'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  memberIds?: string[];
}

export class UpdateCardDto {
  @ApiProperty({ required: false, example: 'Instagram Stories Tasarımı (Güncellenmiş)' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false, example: 'Güncellenmiş açıklama' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, example: '2024-01-20T10:00:00Z' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ required: false, example: false })
  @IsOptional()
  @IsBoolean()
  archived?: boolean;
}

export class MoveCardDto {
  @ApiProperty({ example: 'list-456' })
  @IsString()
  @IsNotEmpty()
  targetListId: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  newOrder: number;
}

export class AddCardMemberDto {
  @ApiProperty({ example: 'user-123' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class CreateCommentDto {
  @ApiProperty({ example: 'Bu tasarım çok güzel olmuş!' })
  @IsString()
  @IsNotEmpty()
  text: string;
}

export class UpdateCommentDto {
  @ApiProperty({ example: 'Güncellenmiş yorum' })
  @IsString()
  @IsNotEmpty()
  text: string;
}

export class CardFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  listId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  boardId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  overdue?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  archived?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;
}

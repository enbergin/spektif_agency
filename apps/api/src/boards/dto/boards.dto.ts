import { IsString, IsOptional, IsArray, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBoardDto {
  @ApiProperty({ example: 'org-123' })
  @IsString()
  @IsNotEmpty()
  organizationId: string;

  @ApiProperty({ example: 'Sosyal Medya Projeleri' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: false, example: 'Müşteri projelerini takip etmek için kullanılan ana board' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, example: '#4ADE80' })
  @IsOptional()
  @IsString()
  color?: string;
}

export class UpdateBoardDto {
  @ApiProperty({ required: false, example: 'Güncellenmiş Board Adı' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false, example: 'Güncellenmiş açıklama' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, example: '#22C55E' })
  @IsOptional()
  @IsString()
  color?: string;
}

export class CreateListDto {
  @ApiProperty({ example: 'board-123' })
  @IsString()
  @IsNotEmpty()
  boardId: string;

  @ApiProperty({ example: 'Yapılacak' })
  @IsString()
  @IsNotEmpty()
  title: string;
}

export class UpdateListDto {
  @ApiProperty({ required: false, example: 'Güncellenmiş Liste Adı' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false, example: 2 })
  @IsOptional()
  @IsNumber()
  position?: number;
}

export class ReorderListsDto {
  @ApiProperty({ type: [Object], example: [{ id: 'list-1', position: 1 }, { id: 'list-2', position: 2 }] })
  @IsArray()
  listOrders: { id: string; position: number }[];
}

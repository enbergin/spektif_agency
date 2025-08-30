import { IsString, IsOptional, IsEmail, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrganizationDto {
  @ApiProperty({ example: 'Spektif Digital Agency' })
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  branding?: any;
}

export class UpdateOrganizationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  branding?: any;
}

export class InviteUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ required: false, example: 'John Doe' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    required: false,
    enum: ['ADMIN', 'EMPLOYEE', 'ACCOUNTANT', 'CLIENT'],
    default: 'EMPLOYEE'
  })
  @IsOptional()
  @IsEnum(['ADMIN', 'EMPLOYEE', 'ACCOUNTANT', 'CLIENT'])
  role?: string;
}

export class UpdateUserRoleDto {
  @ApiProperty({
    enum: ['ADMIN', 'EMPLOYEE', 'ACCOUNTANT', 'CLIENT']
  })
  @IsEnum(['ADMIN', 'EMPLOYEE', 'ACCOUNTANT', 'CLIENT'])
  role: string;
}

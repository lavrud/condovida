import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { Role } from '@condovida/shared';

export class CreateResidentDto {
  @ApiProperty({ example: 'Durval Martins' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'durval@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'senha123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ enum: Role, default: Role.RESIDENT })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiProperty({ example: '304' })
  @IsString()
  @MinLength(1)
  unit: string;

  @ApiProperty({ example: 'B' })
  @IsString()
  @MinLength(1)
  block: string;

  @ApiPropertyOptional({ example: '(11) 99999-9999' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: '123.456.789-00' })
  @IsString()
  @IsOptional()
  cpf?: string;

  @ApiPropertyOptional({ example: '2024-01-15' })
  @IsString()
  @IsOptional()
  moveInDate?: string;
}

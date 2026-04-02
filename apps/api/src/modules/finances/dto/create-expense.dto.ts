import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsPositive, IsDateString, IsOptional, MinLength } from 'class-validator';

export class CreateExpenseDto {
  @ApiProperty({ example: 'Folha de funcionários' })
  @IsString()
  @MinLength(3)
  description: string;

  @ApiProperty({ example: 12500 })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ example: 'pessoal' })
  @IsString()
  category: string;

  @ApiProperty({ example: '2026-04-05' })
  @IsDateString()
  date: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsPositive, IsDateString, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ example: 'resident-uuid' })
  @IsString()
  residentId: string;

  @ApiProperty({ example: 'Abr/2026' })
  @IsString()
  month: string;

  @ApiProperty({ example: 980 })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ example: '2026-04-10' })
  @IsDateString()
  dueDate: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  barcode?: string;
}

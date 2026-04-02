import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional, Matches } from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({ example: 'churrasqueira' })
  @IsString()
  areaId: string;

  @ApiProperty({ example: '2026-04-15' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: '14:00-16:00' })
  @IsString()
  @Matches(/^\d{2}:\d{2}-\d{2}:\d{2}$/, { message: 'Formato de horário inválido (HH:MM-HH:MM)' })
  timeSlot: string;

  @ApiPropertyOptional({ example: 'Aniversário de 20 pessoas' })
  @IsString()
  @IsOptional()
  notes?: string;
}

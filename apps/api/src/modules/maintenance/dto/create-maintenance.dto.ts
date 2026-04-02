import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsDateString, IsOptional, MinLength } from 'class-validator';
import { MaintenanceFrequency } from '@condovida/shared';

export class CreateMaintenanceDto {
  @ApiProperty({ example: 'Revisão elevadores' })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({ enum: MaintenanceFrequency })
  @IsEnum(MaintenanceFrequency)
  frequency: MaintenanceFrequency;

  @ApiProperty({ example: '2026-04-15' })
  @IsDateString()
  nextDate: string;

  @ApiProperty({ example: 'ThyssenKrupp' })
  @IsString()
  @MinLength(2)
  provider: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsDateString, IsOptional, MinLength } from 'class-validator';
import { VisitorType } from '@condovida/shared';

export class CreateVisitorDto {
  @ApiProperty({ example: 'João Eletricista' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ enum: VisitorType })
  @IsEnum(VisitorType)
  type: VisitorType;

  @ApiProperty({ example: '2026-04-15' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: '09:00' })
  @IsString()
  time: string;

  @ApiProperty({ example: '304-B' })
  @IsString()
  unit: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreatePackageDto {
  @ApiProperty({ example: 'Amazon — Caixa grande' })
  @IsString()
  @MinLength(2)
  description: string;

  @ApiProperty({ example: '304-B' })
  @IsString()
  unit: string;

  @ApiProperty({ example: 'resident-uuid' })
  @IsString()
  residentId: string;
}

export class CreateProviderDto {
  @ApiProperty({ example: 'Carlos — Encanador' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'Reparo vazamento' })
  @IsString()
  service: string;

  @ApiProperty({ example: '203-B' })
  @IsString()
  unit: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  document?: string;
}

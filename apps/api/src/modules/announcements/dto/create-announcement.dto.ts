import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsBoolean, IsOptional, MinLength } from 'class-validator';
import { AnnouncementPriority } from '@condovida/shared';

export class CreateAnnouncementDto {
  @ApiProperty({ example: 'Assembleia Geral Ordinária' })
  @IsString()
  @MinLength(5)
  title: string;

  @ApiProperty({ example: 'Dia 15/04 às 19h no salão de festas.' })
  @IsString()
  @MinLength(10)
  body: string;

  @ApiPropertyOptional({ enum: AnnouncementPriority, default: AnnouncementPriority.LOW })
  @IsEnum(AnnouncementPriority)
  @IsOptional()
  priority?: AnnouncementPriority;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  pinned?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  expiresAt?: string;
}

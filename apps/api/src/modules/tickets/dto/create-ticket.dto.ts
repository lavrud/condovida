import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsBoolean, IsOptional, MinLength } from 'class-validator';
import { TicketCategory } from '@condovida/shared';

export class CreateTicketDto {
  @ApiProperty({ example: 'Interfone sem som 304B' })
  @IsString()
  @MinLength(5)
  title: string;

  @ApiProperty({ example: 'O interfone do apartamento 304B não está funcionando desde segunda-feira.' })
  @IsString()
  @MinLength(10)
  description: string;

  @ApiProperty({ enum: TicketCategory })
  @IsEnum(TicketCategory)
  category: TicketCategory;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  hasPhoto?: boolean;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsUrl, IsOptional, Min, MinLength } from 'class-validator';
import { MarketplaceType } from '@condovida/shared';

export class CreateListingDto {
  @ApiProperty({ example: 'Sofá 3 lugares cinza' })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({ example: 'Bom estado, 2 anos de uso.' })
  @IsString()
  @MinLength(10)
  description: string;

  @ApiProperty({ example: 800 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ enum: MarketplaceType })
  @IsEnum(MarketplaceType)
  type: MarketplaceType;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  imageUrl?: string;
}

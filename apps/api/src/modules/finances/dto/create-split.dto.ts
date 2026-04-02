import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsPositive, IsInt, MinLength } from 'class-validator';

export class CreateSplitDto {
  @ApiProperty({ example: 'Reparo bomba piscina' })
  @IsString()
  @MinLength(3)
  description: string;

  @ApiProperty({ example: 4800 })
  @IsNumber()
  @IsPositive()
  total: number;

  @ApiProperty({ example: 40 })
  @IsInt()
  @IsPositive()
  units: number;
}

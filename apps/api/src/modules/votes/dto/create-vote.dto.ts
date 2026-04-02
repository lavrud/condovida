import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsDateString, IsInt, IsPositive, MinLength, ArrayMinSize } from 'class-validator';

export class CreateVoteDto {
  @ApiProperty({ example: 'Pintura da fachada' })
  @IsString()
  @MinLength(5)
  title: string;

  @ApiProperty({ example: 'Investimento de R$ 85.000 para pintura completa da fachada.' })
  @IsString()
  @MinLength(10)
  description: string;

  @ApiProperty({ example: ['Aprovar', 'Reprovar', 'Abster'] })
  @IsArray()
  @ArrayMinSize(2)
  @IsString({ each: true })
  options: string[];

  @ApiProperty({ example: '2026-04-30' })
  @IsDateString()
  deadline: string;

  @ApiProperty({ example: 26, description: 'Número mínimo de votos para aprovação' })
  @IsInt()
  @IsPositive()
  quorum: number;

  @ApiProperty({ example: 40, description: 'Total de unidades elegíveis' })
  @IsInt()
  @IsPositive()
  totalEligible: number;
}

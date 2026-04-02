import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsDateString, MinLength, ArrayMinSize } from 'class-validator';

export class CreatePollDto {
  @ApiProperty({ example: 'Instalar câmeras no playground?' })
  @IsString()
  @MinLength(5)
  question: string;

  @ApiProperty({ example: ['Sim', 'Não', 'Indiferente'] })
  @IsArray()
  @ArrayMinSize(2)
  @IsString({ each: true })
  options: string[];

  @ApiProperty({ example: '2026-04-30' })
  @IsDateString()
  deadline: string;
}

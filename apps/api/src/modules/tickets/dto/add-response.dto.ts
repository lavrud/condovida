import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class AddResponseDto {
  @ApiProperty({ example: 'Técnico agendado para amanhã às 10h.' })
  @IsString()
  @MinLength(1)
  text: string;
}

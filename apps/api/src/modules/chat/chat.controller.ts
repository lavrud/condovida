import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('channels')
  @ApiOperation({ summary: 'Listar canais de chat' })
  findChannels() {
    return this.chatService.findAllChannels();
  }

  @Get('channels/:id/messages')
  @ApiOperation({ summary: 'Histórico de mensagens do canal' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findMessages(@Param('id') id: string, @Query('limit') limit?: number) {
    return this.chatService.findMessages(id, limit || 50);
  }
}

import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { AddResponseDto } from './dto/add-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role, JwtPayload } from '@condovida/shared';
import { TicketStatus } from '@prisma/client';

@ApiTags('tickets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar chamados' })
  findAll(@CurrentUser() user: JwtPayload) {
    return this.ticketsService.findAll(user.sub, user.role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar chamado por ID' })
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Abrir novo chamado' })
  create(@Body() dto: CreateTicketDto, @CurrentUser() user: JwtPayload) {
    return this.ticketsService.create(dto, user.sub);
  }

  @Patch(':id/status')
  @Roles(Role.SINDICO, Role.COUNCIL)
  @ApiOperation({ summary: 'Atualizar status do chamado' })
  updateStatus(@Param('id') id: string, @Body('status') status: TicketStatus) {
    return this.ticketsService.updateStatus(id, status);
  }

  @Post(':id/responses')
  @ApiOperation({ summary: 'Adicionar resposta ao chamado' })
  addResponse(
    @Param('id') id: string,
    @Body() dto: AddResponseDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const isAdmin = user.role === Role.SINDICO || user.role === Role.COUNCIL;
    return this.ticketsService.addResponse(id, dto, user.sub, isAdmin);
  }

  @Delete(':id')
  @Roles(Role.SINDICO)
  @ApiOperation({ summary: 'Remover chamado (síndico)' })
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(id);
  }
}

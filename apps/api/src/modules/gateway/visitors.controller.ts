import { Controller, Get, Post, Delete, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GatewayService } from './gateway.service';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role, JwtPayload } from '@condovida/shared';
import { VisitorStatus } from '@prisma/client';

@ApiTags('gateway')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('gateway/visitors')
export class VisitorsController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Get()
  @ApiOperation({ summary: 'Listar visitantes' })
  findAll() {
    return this.gatewayService.findAllVisitors();
  }

  @Post()
  @ApiOperation({ summary: 'Autorizar visitante e gerar QR code' })
  create(@Body() dto: CreateVisitorDto, @CurrentUser() user: JwtPayload) {
    return this.gatewayService.createVisitor(dto, user.sub);
  }

  @Patch(':id/status')
  @Roles(Role.PORTEIRO, Role.SINDICO)
  @ApiOperation({ summary: 'Atualizar status do visitante (entrada/saída)' })
  updateStatus(@Param('id') id: string, @Body('status') status: VisitorStatus) {
    return this.gatewayService.updateVisitorStatus(id, status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover autorização de visitante' })
  remove(@Param('id') id: string) {
    return this.gatewayService.removeVisitor(id);
  }
}

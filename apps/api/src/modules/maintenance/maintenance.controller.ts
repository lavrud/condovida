import { Controller, Get, Post, Delete, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@condovida/shared';

@ApiTags('maintenance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('maintenance')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Get()
  @ApiOperation({ summary: 'Listar tarefas de manutenção preventiva' })
  findAll() {
    return this.maintenanceService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar tarefa por ID' })
  findOne(@Param('id') id: string) {
    return this.maintenanceService.findOne(id);
  }

  @Post()
  @Roles(Role.SINDICO)
  @ApiOperation({ summary: 'Criar tarefa de manutenção (síndico)' })
  create(@Body() dto: CreateMaintenanceDto) {
    return this.maintenanceService.create(dto);
  }

  @Patch(':id/done')
  @Roles(Role.SINDICO)
  @ApiOperation({ summary: 'Marcar tarefa como concluída e recalcular próxima data' })
  markDone(@Param('id') id: string) {
    return this.maintenanceService.markDone(id);
  }

  @Delete(':id')
  @Roles(Role.SINDICO)
  @ApiOperation({ summary: 'Remover tarefa (síndico)' })
  remove(@Param('id') id: string) {
    return this.maintenanceService.remove(id);
  }
}

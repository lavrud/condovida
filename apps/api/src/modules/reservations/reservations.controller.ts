import { Controller, Get, Post, Delete, Body, Param, Patch, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role, JwtPayload } from '@condovida/shared';

@ApiTags('reservations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get('areas')
  @ApiOperation({ summary: 'Listar áreas comuns disponíveis' })
  getAreas() {
    return this.reservationsService.getAreas();
  }

  @Get()
  @ApiOperation({ summary: 'Listar reservas' })
  @ApiQuery({ name: 'mine', required: false, type: Boolean })
  findAll(@CurrentUser() user: JwtPayload, @Query('mine') mine?: boolean) {
    if (mine) {
      return this.reservationsService.findAll(user.sub);
    }
    return this.reservationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar reserva por ID' })
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar nova reserva' })
  create(@Body() dto: CreateReservationDto, @CurrentUser() user: JwtPayload) {
    return this.reservationsService.create(dto, user.sub);
  }

  @Patch(':id/approve')
  @Roles(Role.SINDICO)
  @ApiOperation({ summary: 'Aprovar reserva (síndico)' })
  approve(@Param('id') id: string) {
    return this.reservationsService.approve(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancelar reserva' })
  cancel(@Param('id') id: string) {
    return this.reservationsService.cancel(id);
  }
}

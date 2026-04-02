import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ResidentsService } from './residents.service';
import { CreateResidentDto } from './dto/create-resident.dto';
import { UpdateResidentDto } from './dto/update-resident.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@condovida/shared';

@ApiTags('residents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('residents')
export class ResidentsController {
  constructor(private readonly residentsService: ResidentsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os moradores' })
  findAll() {
    return this.residentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar morador por ID' })
  findOne(@Param('id') id: string) {
    return this.residentsService.findOne(id);
  }

  @Post()
  @Roles(Role.SINDICO)
  @ApiOperation({ summary: 'Criar novo morador (síndico)' })
  create(@Body() dto: CreateResidentDto) {
    return this.residentsService.create(dto);
  }

  @Put(':id')
  @Roles(Role.SINDICO)
  @ApiOperation({ summary: 'Atualizar morador (síndico)' })
  update(@Param('id') id: string, @Body() dto: UpdateResidentDto) {
    return this.residentsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.SINDICO)
  @ApiOperation({ summary: 'Desativar morador (síndico)' })
  remove(@Param('id') id: string) {
    return this.residentsService.remove(id);
  }
}

import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role, JwtPayload } from '@condovida/shared';

@ApiTags('announcements')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar comunicados' })
  findAll() {
    return this.announcementsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar comunicado por ID' })
  findOne(@Param('id') id: string) {
    return this.announcementsService.findOne(id);
  }

  @Post()
  @Roles(Role.SINDICO, Role.COUNCIL)
  @ApiOperation({ summary: 'Criar comunicado' })
  create(@Body() dto: CreateAnnouncementDto, @CurrentUser() user: JwtPayload) {
    return this.announcementsService.create(dto, user.sub);
  }

  @Put(':id')
  @Roles(Role.SINDICO, Role.COUNCIL)
  @ApiOperation({ summary: 'Atualizar comunicado' })
  update(@Param('id') id: string, @Body() dto: CreateAnnouncementDto) {
    return this.announcementsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.SINDICO)
  @ApiOperation({ summary: 'Remover comunicado' })
  remove(@Param('id') id: string) {
    return this.announcementsService.remove(id);
  }
}

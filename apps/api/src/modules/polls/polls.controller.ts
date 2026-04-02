import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PollsService } from './polls.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role, JwtPayload } from '@condovida/shared';

@ApiTags('polls')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('polls')
export class PollsController {
  constructor(private readonly pollsService: PollsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar enquetes' })
  findAll(@CurrentUser() user: JwtPayload) {
    return this.pollsService.findAll(user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar enquete por ID' })
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.pollsService.findOne(id, user.sub);
  }

  @Post()
  @Roles(Role.SINDICO, Role.COUNCIL)
  @ApiOperation({ summary: 'Criar enquete' })
  create(@Body() dto: CreatePollDto, @CurrentUser() user: JwtPayload) {
    return this.pollsService.create(dto, user.sub);
  }

  @Post(':id/vote')
  @ApiOperation({ summary: 'Votar na enquete' })
  vote(
    @Param('id') id: string,
    @Body('optionId') optionId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.pollsService.vote(id, optionId, user.sub);
  }

  @Delete(':id')
  @Roles(Role.SINDICO)
  @ApiOperation({ summary: 'Remover enquete' })
  remove(@Param('id') id: string) {
    return this.pollsService.remove(id);
  }
}

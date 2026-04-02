import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VotesService } from './votes.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role, JwtPayload } from '@condovida/shared';

@ApiTags('votes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar votações de assembleia' })
  findAll(@CurrentUser() user: JwtPayload) {
    return this.votesService.findAll(user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar votação por ID' })
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.votesService.findOne(id, user.sub);
  }

  @Post()
  @Roles(Role.SINDICO)
  @ApiOperation({ summary: 'Criar votação de assembleia (síndico)' })
  create(@Body() dto: CreateVoteDto, @CurrentUser() user: JwtPayload) {
    return this.votesService.create(dto, user.sub);
  }

  @Post(':id/vote')
  @ApiOperation({ summary: 'Registrar voto na assembleia' })
  vote(
    @Param('id') id: string,
    @Body('optionId') optionId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.votesService.vote(id, optionId, user.sub);
  }

  @Post(':id/generate-minutes')
  @Roles(Role.SINDICO)
  @ApiOperation({ summary: 'Gerar ata e encerrar votação (síndico)' })
  generateMinutes(@Param('id') id: string) {
    return this.votesService.generateMinutes(id);
  }

  @Patch(':id/close')
  @Roles(Role.SINDICO)
  @ApiOperation({ summary: 'Encerrar votação sem gerar ata (síndico)' })
  close(@Param('id') id: string) {
    return this.votesService.close(id);
  }
}

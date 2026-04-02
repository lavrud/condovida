import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GatewayService } from './gateway.service';
import { CreateProviderDto } from './dto/create-visitor.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '@condovida/shared';

@ApiTags('gateway')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('gateway/providers')
export class ProvidersController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Get()
  @ApiOperation({ summary: 'Listar prestadores de serviço' })
  findAll() {
    return this.gatewayService.findAllProviders();
  }

  @Post()
  @ApiOperation({ summary: 'Registrar entrada de prestador' })
  create(@Body() dto: CreateProviderDto, @CurrentUser() user: JwtPayload) {
    return this.gatewayService.createProvider(dto, user.sub);
  }

  @Patch(':id/exit')
  @ApiOperation({ summary: 'Registrar saída de prestador' })
  registerExit(@Param('id') id: string) {
    return this.gatewayService.registerProviderExit(id);
  }
}

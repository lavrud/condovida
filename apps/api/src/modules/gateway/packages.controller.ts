import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GatewayService } from './gateway.service';
import { CreatePackageDto } from './dto/create-visitor.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '@condovida/shared';

@ApiTags('gateway')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('gateway/packages')
export class PackagesController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Get()
  @ApiOperation({ summary: 'Listar encomendas' })
  findAll() {
    return this.gatewayService.findAllPackages();
  }

  @Post()
  @ApiOperation({ summary: 'Registrar encomenda recebida' })
  create(@Body() dto: CreatePackageDto, @CurrentUser() user: JwtPayload) {
    return this.gatewayService.createPackage(dto, user.sub);
  }

  @Patch(':id/pickup')
  @ApiOperation({ summary: 'Registrar retirada de encomenda' })
  pickup(@Param('id') id: string) {
    return this.gatewayService.pickupPackage(id);
  }
}

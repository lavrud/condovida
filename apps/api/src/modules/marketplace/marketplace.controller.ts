import { Controller, Get, Post, Delete, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MarketplaceService } from './marketplace.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '@condovida/shared';

@ApiTags('marketplace')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Get()
  @ApiOperation({ summary: 'Listar anúncios ativos' })
  findAll() {
    return this.marketplaceService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar anúncio por ID' })
  findOne(@Param('id') id: string) {
    return this.marketplaceService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar anúncio' })
  create(@Body() dto: CreateListingDto, @CurrentUser() user: JwtPayload) {
    return this.marketplaceService.create(dto, user.sub);
  }

  @Patch(':id/sold')
  @ApiOperation({ summary: 'Marcar anúncio como vendido' })
  markAsSold(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.marketplaceService.markAsSold(id, user.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover anúncio' })
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.marketplaceService.remove(id, user.sub);
  }
}

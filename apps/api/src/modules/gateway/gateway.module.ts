import { Module } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { VisitorsController } from './visitors.controller';
import { PackagesController } from './packages.controller';
import { ProvidersController } from './providers.controller';

@Module({
  controllers: [VisitorsController, PackagesController, ProvidersController],
  providers: [GatewayService],
  exports: [GatewayService],
})
export class GatewayModule {}

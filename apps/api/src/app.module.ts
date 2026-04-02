import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app.config';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ResidentsModule } from './modules/residents/residents.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { FinancesModule } from './modules/finances/finances.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { GatewayModule } from './modules/gateway/gateway.module';
import { PollsModule } from './modules/polls/polls.module';
import { VotesModule } from './modules/votes/votes.module';
import { ChatModule } from './modules/chat/chat.module';
import { MarketplaceModule } from './modules/marketplace/marketplace.module';
import { MaintenanceModule } from './modules/maintenance/maintenance.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    AppConfigModule,
    PrismaModule,
    AuthModule,
    ResidentsModule,
    ReservationsModule,
    FinancesModule,
    TicketsModule,
    AnnouncementsModule,
    GatewayModule,
    PollsModule,
    VotesModule,
    ChatModule,
    MarketplaceModule,
    MaintenanceModule,
    NotificationsModule,
  ],
})
export class AppModule {}

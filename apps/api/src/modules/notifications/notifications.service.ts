import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findMine(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markRead(id: string, userId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id, userId },
    });

    if (!notification) throw new NotFoundException(`Notificação #${id} não encontrada`);

    return this.prisma.notification.update({ where: { id }, data: { read: true } });
  }

  async markAllRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
    return { message: 'Todas as notificações marcadas como lidas' };
  }

  async create(userId: string, type: NotificationType, title: string, body: string, relatedId?: string) {
    return this.prisma.notification.create({
      data: { userId, type, title, body, relatedId },
    });
  }

  async createForAll(type: NotificationType, title: string, body: string, relatedId?: string) {
    const users = await this.prisma.user.findMany({ where: { active: true }, select: { id: true } });

    await this.prisma.notification.createMany({
      data: users.map((u) => ({ userId: u.id, type, title, body, relatedId: relatedId || null })),
    });

    return { count: users.length };
  }

  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({ where: { userId, read: false } });
  }
}

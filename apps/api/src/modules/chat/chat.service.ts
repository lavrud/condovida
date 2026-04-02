import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllChannels() {
    return this.prisma.chatChannel.findMany({ orderBy: { name: 'asc' } });
  }

  async findMessages(channelId: string, limit = 50) {
    return this.prisma.chatMessage.findMany({
      where: { channelId },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: 'asc' },
      take: limit,
    });
  }

  async saveMessage(channelId: string, authorId: string, text: string) {
    return this.prisma.chatMessage.create({
      data: { channelId, authorId, text },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        channel: { select: { id: true, name: true } },
      },
    });
  }

  async ensureDefaultChannels() {
    const channels = [
      { id: 'geral', name: 'Geral', iconName: 'Globe', description: 'Canal geral do condomínio' },
      { id: 'sindico', name: 'Síndico', iconName: 'Shield', description: 'Comunicação com o síndico' },
    ];

    for (const channel of channels) {
      await this.prisma.chatChannel.upsert({
        where: { id: channel.id },
        update: {},
        create: channel,
      });
    }
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';

@Injectable()
export class AnnouncementsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.announcement.findMany({
      include: { author: { select: { id: true, name: true } } },
      orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(id: string) {
    const announcement = await this.prisma.announcement.findUnique({
      where: { id },
      include: { author: { select: { id: true, name: true } } },
    });

    if (!announcement) throw new NotFoundException(`Comunicado #${id} não encontrado`);
    return announcement;
  }

  async create(dto: CreateAnnouncementDto, authorId: string) {
    return this.prisma.announcement.create({
      data: {
        title: dto.title,
        body: dto.body,
        priority: (dto.priority as string) || 'LOW',
        authorId,
        pinned: dto.pinned || false,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      },
      include: { author: { select: { id: true, name: true } } },
    });
  }

  async update(id: string, dto: Partial<CreateAnnouncementDto>) {
    await this.findOne(id);
    return this.prisma.announcement.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.body && { body: dto.body }),
        ...(dto.priority && { priority: dto.priority as string }),
        ...(dto.pinned !== undefined && { pinned: dto.pinned }),
        ...(dto.expiresAt && { expiresAt: new Date(dto.expiresAt) }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.announcement.delete({ where: { id } });
  }
}

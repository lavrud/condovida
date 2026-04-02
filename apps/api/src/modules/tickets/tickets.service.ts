import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { AddResponseDto } from './dto/add-response.dto';
import { TicketStatus } from '@prisma/client';
import { Role } from '@condovida/shared';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId?: string, role?: string) {
    const where = role === Role.RESIDENT ? { authorId: userId } : undefined;
    return this.prisma.ticket.findMany({
      where,
      include: {
        author: { select: { id: true, name: true, email: true } },
        responses: {
          include: { author: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, email: true } },
        responses: {
          include: { author: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!ticket) throw new NotFoundException(`Chamado #${id} não encontrado`);
    return ticket;
  }

  async create(dto: CreateTicketDto, userId: string) {
    return this.prisma.ticket.create({
      data: {
        title: dto.title,
        description: dto.description,
        category: dto.category as string,
        hasPhoto: dto.hasPhoto || false,
        authorId: userId,
        status: TicketStatus.OPEN,
      },
      include: { author: { select: { id: true, name: true } } },
    });
  }

  async updateStatus(id: string, status: TicketStatus) {
    await this.findOne(id);
    return this.prisma.ticket.update({
      where: { id },
      data: { status },
    });
  }

  async addResponse(id: string, dto: AddResponseDto, userId: string, isAdmin: boolean) {
    await this.findOne(id);
    return this.prisma.ticketResponse.create({
      data: {
        ticketId: id,
        authorId: userId,
        text: dto.text,
        isAdmin,
      },
      include: { author: { select: { id: true, name: true } } },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.ticket.delete({ where: { id } });
  }
}

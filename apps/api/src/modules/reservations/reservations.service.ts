import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { COMMON_AREAS } from '@condovida/shared';
import { ReservationStatus } from '@prisma/client';

@Injectable()
export class ReservationsService {
  constructor(private readonly prisma: PrismaService) {}

  getAreas() {
    return COMMON_AREAS;
  }

  async findAll(residentId?: string) {
    return this.prisma.reservation.findMany({
      where: residentId ? { residentId } : undefined,
      include: {
        area: true,
        resident: {
          include: { user: { select: { name: true } } },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: { area: true, resident: { include: { user: { select: { name: true } } } } },
    });

    if (!reservation) {
      throw new NotFoundException(`Reserva #${id} não encontrada`);
    }

    return reservation;
  }

  async create(dto: CreateReservationDto, userId: string) {
    // Get resident for this user
    const resident = await this.prisma.resident.findFirst({
      where: { user: { id: userId } },
    });

    if (!resident) {
      throw new BadRequestException('Usuário não possui perfil de morador');
    }

    // Check area exists
    const areaConfig = COMMON_AREAS.find((a) => a.id === dto.areaId);
    if (!areaConfig) {
      throw new NotFoundException(`Área '${dto.areaId}' não encontrada`);
    }

    const reservationDate = new Date(dto.date);

    // Validate minimum days in advance
    if (areaConfig.minDays > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((reservationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays < areaConfig.minDays) {
        throw new BadRequestException(
          `Esta área exige agendamento com no mínimo ${areaConfig.minDays} dias de antecedência`,
        );
      }
    }

    // Check maxPerMonth
    if (areaConfig.maxPerMonth > 0) {
      const startOfMonth = new Date(reservationDate.getFullYear(), reservationDate.getMonth(), 1);
      const endOfMonth = new Date(reservationDate.getFullYear(), reservationDate.getMonth() + 1, 0);

      const monthCount = await this.prisma.reservation.count({
        where: {
          residentId: resident.id,
          areaId: dto.areaId,
          date: { gte: startOfMonth, lte: endOfMonth },
          status: { not: ReservationStatus.CANCELLED },
        },
      });

      if (monthCount >= areaConfig.maxPerMonth) {
        throw new ConflictException(
          `Você atingiu o limite de ${areaConfig.maxPerMonth} reservas por mês para esta área`,
        );
      }
    }

    // Check time slot conflict
    const conflict = await this.prisma.reservation.findFirst({
      where: {
        areaId: dto.areaId,
        date: reservationDate,
        timeSlot: dto.timeSlot,
        status: { not: ReservationStatus.CANCELLED },
      },
    });

    if (conflict) {
      throw new ConflictException('Este horário já está reservado para esta área');
    }

    // Ensure area record exists in DB
    let areaRecord = await this.prisma.commonArea.findUnique({ where: { id: dto.areaId } });
    if (!areaRecord) {
      areaRecord = await this.prisma.commonArea.create({
        data: {
          id: areaConfig.id,
          name: areaConfig.name,
          iconName: areaConfig.iconName,
          capacity: areaConfig.capacity,
          rules: areaConfig.rules,
          rate: areaConfig.rate,
          minDays: areaConfig.minDays,
          maxPerMonth: areaConfig.maxPerMonth,
        },
      });
    }

    return this.prisma.reservation.create({
      data: {
        areaId: dto.areaId,
        residentId: resident.id,
        date: reservationDate,
        timeSlot: dto.timeSlot,
        notes: dto.notes,
        status: ReservationStatus.PENDING,
      },
      include: { area: true },
    });
  }

  async approve(id: string) {
    await this.findOne(id);
    return this.prisma.reservation.update({
      where: { id },
      data: { status: ReservationStatus.CONFIRMED },
    });
  }

  async cancel(id: string) {
    await this.findOne(id);
    return this.prisma.reservation.update({
      where: { id },
      data: { status: ReservationStatus.CANCELLED },
    });
  }
}

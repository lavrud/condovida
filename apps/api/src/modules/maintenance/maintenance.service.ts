import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { MaintenanceStatus } from '@prisma/client';

@Injectable()
export class MaintenanceService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.maintenanceTask.findMany({
      orderBy: { nextDate: 'asc' },
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.maintenanceTask.findUnique({ where: { id } });
    if (!task) throw new NotFoundException(`Tarefa #${id} não encontrada`);
    return task;
  }

  async create(dto: CreateMaintenanceDto) {
    return this.prisma.maintenanceTask.create({
      data: {
        title: dto.title,
        frequency: dto.frequency as string,
        nextDate: new Date(dto.nextDate),
        provider: dto.provider,
        status: MaintenanceStatus.SCHEDULED,
        notes: dto.notes,
      },
    });
  }

  async markDone(id: string) {
    const task = await this.findOne(id);
    const nextDate = this.calculateNextDate(task.nextDate, task.frequency as string);

    return this.prisma.maintenanceTask.update({
      where: { id },
      data: {
        status: MaintenanceStatus.DONE,
        lastDate: task.nextDate,
        nextDate,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.maintenanceTask.delete({ where: { id } });
  }

  private calculateNextDate(from: Date, frequency: string): Date {
    const d = new Date(from);
    switch (frequency) {
      case 'WEEKLY': d.setDate(d.getDate() + 7); break;
      case 'MONTHLY': d.setMonth(d.getMonth() + 1); break;
      case 'QUARTERLY': d.setMonth(d.getMonth() + 3); break;
      case 'SEMIANNUAL': d.setMonth(d.getMonth() + 6); break;
      case 'ANNUAL': d.setFullYear(d.getFullYear() + 1); break;
      default: d.setMonth(d.getMonth() + 1);
    }
    return d;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateVisitorDto, CreatePackageDto, CreateProviderDto } from './dto/create-visitor.dto';
import { VisitorStatus } from '@prisma/client';

function generateQrCode(): string {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
}

@Injectable()
export class GatewayService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Visitors ─────────────────────────────────────────────────────────────

  async findAllVisitors() {
    return this.prisma.visitor.findMany({
      include: { authorizedBy: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createVisitor(dto: CreateVisitorDto, authorizedById: string) {
    return this.prisma.visitor.create({
      data: {
        name: dto.name,
        type: dto.type as string,
        date: new Date(dto.date),
        time: dto.time,
        unit: dto.unit,
        qrCode: generateQrCode(),
        status: VisitorStatus.AUTHORIZED,
        authorizedById,
        notes: dto.notes,
      },
    });
  }

  async removeVisitor(id: string) {
    const visitor = await this.prisma.visitor.findUnique({ where: { id } });
    if (!visitor) throw new NotFoundException(`Visitante #${id} não encontrado`);
    return this.prisma.visitor.delete({ where: { id } });
  }

  async updateVisitorStatus(id: string, status: VisitorStatus) {
    const visitor = await this.prisma.visitor.findUnique({ where: { id } });
    if (!visitor) throw new NotFoundException(`Visitante #${id} não encontrado`);
    return this.prisma.visitor.update({ where: { id }, data: { status } });
  }

  // ─── Packages ─────────────────────────────────────────────────────────────

  async findAllPackages() {
    return this.prisma.package.findMany({
      include: {
        resident: { include: { user: { select: { name: true } } } },
        receivedBy: { select: { id: true, name: true } },
      },
      orderBy: { arrivedAt: 'desc' },
    });
  }

  async createPackage(dto: CreatePackageDto, receivedById: string) {
    return this.prisma.package.create({
      data: {
        description: dto.description,
        unit: dto.unit,
        residentId: dto.residentId,
        receivedById,
        status: 'WAITING',
      },
    });
  }

  async pickupPackage(id: string) {
    const pkg = await this.prisma.package.findUnique({ where: { id } });
    if (!pkg) throw new NotFoundException(`Encomenda #${id} não encontrada`);
    return this.prisma.package.update({
      where: { id },
      data: { status: 'PICKED_UP', pickedAt: new Date() },
    });
  }

  // ─── Providers ────────────────────────────────────────────────────────────

  async findAllProviders() {
    return this.prisma.serviceProvider.findMany({
      orderBy: { entryTime: 'desc' },
    });
  }

  async createProvider(dto: CreateProviderDto, authorizedById: string) {
    return this.prisma.serviceProvider.create({
      data: {
        name: dto.name,
        service: dto.service,
        unit: dto.unit,
        document: dto.document,
        entryTime: new Date(),
        authorizedById,
      },
    });
  }

  async registerProviderExit(id: string) {
    const provider = await this.prisma.serviceProvider.findUnique({ where: { id } });
    if (!provider) throw new NotFoundException(`Prestador #${id} não encontrado`);
    return this.prisma.serviceProvider.update({
      where: { id },
      data: { exitTime: new Date() },
    });
  }
}

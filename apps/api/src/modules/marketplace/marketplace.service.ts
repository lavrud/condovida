import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';

@Injectable()
export class MarketplaceService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.marketplaceListing.findMany({
      where: { status: 'ACTIVE' },
      include: {
        seller: { select: { id: true, name: true } },
        resident: { select: { id: true, unit: true, block: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const listing = await this.prisma.marketplaceListing.findUnique({
      where: { id },
      include: {
        seller: { select: { id: true, name: true } },
        resident: { select: { id: true, unit: true, block: true } },
      },
    });

    if (!listing) throw new NotFoundException(`Anúncio #${id} não encontrado`);
    return listing;
  }

  async create(dto: CreateListingDto, userId: string) {
    const resident = await this.prisma.resident.findFirst({ where: { userId } });
    if (!resident) throw new ForbiddenException('Apenas moradores podem anunciar');

    return this.prisma.marketplaceListing.create({
      data: {
        title: dto.title,
        description: dto.description,
        price: dto.price,
        type: dto.type as string,
        sellerId: userId,
        residentId: resident.id,
        imageUrl: dto.imageUrl,
        status: 'ACTIVE',
      },
      include: { seller: { select: { id: true, name: true } } },
    });
  }

  async markAsSold(id: string, userId: string) {
    const listing = await this.findOne(id);
    if (listing.sellerId !== userId) {
      throw new ForbiddenException('Apenas o vendedor pode marcar como vendido');
    }
    return this.prisma.marketplaceListing.update({ where: { id }, data: { status: 'SOLD' } });
  }

  async remove(id: string, userId: string) {
    const listing = await this.findOne(id);
    if (listing.sellerId !== userId) {
      throw new ForbiddenException('Apenas o vendedor pode remover o anúncio');
    }
    return this.prisma.marketplaceListing.update({ where: { id }, data: { status: 'REMOVED' } });
  }
}

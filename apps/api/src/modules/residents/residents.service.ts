import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateResidentDto } from './dto/create-resident.dto';
import { UpdateResidentDto } from './dto/update-resident.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@condovida/shared';

@Injectable()
export class ResidentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.resident.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, role: true, avatar: true, active: true } },
      },
      orderBy: [{ block: 'asc' }, { unit: 'asc' }],
    });
  }

  async findOne(id: string) {
    const resident = await this.prisma.resident.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, role: true, avatar: true, active: true } },
      },
    });

    if (!resident) {
      throw new NotFoundException(`Morador #${id} não encontrado`);
    }

    return resident;
  }

  async create(dto: CreateResidentDto) {
    const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existingUser) {
      throw new ConflictException('E-mail já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const avatar = dto.name.charAt(0).toUpperCase();

    return this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role: (dto.role as string) || Role.RESIDENT,
        avatar,
        resident: {
          create: {
            unit: dto.unit,
            block: dto.block,
            phone: dto.phone,
            cpf: dto.cpf,
            moveInDate: dto.moveInDate ? new Date(dto.moveInDate) : undefined,
          },
        },
      },
      include: { resident: true },
      omit: { password: true },
    });
  }

  async update(id: string, dto: UpdateResidentDto) {
    const resident = await this.findOne(id);

    return this.prisma.$transaction(async (tx) => {
      const updatedResident = await tx.resident.update({
        where: { id },
        data: {
          unit: dto.unit,
          block: dto.block,
          phone: dto.phone,
          cpf: dto.cpf,
          moveInDate: dto.moveInDate ? new Date(dto.moveInDate) : undefined,
        },
      });

      if (dto.name || dto.email || dto.role) {
        await tx.user.update({
          where: { id: resident.userId },
          data: {
            ...(dto.name && { name: dto.name }),
            ...(dto.email && { email: dto.email }),
            ...(dto.role && { role: dto.role as string }),
          },
        });
      }

      return updatedResident;
    });
  }

  async remove(id: string) {
    const resident = await this.findOne(id);

    await this.prisma.user.update({
      where: { id: resident.userId },
      data: { active: false },
    });

    return { message: 'Morador desativado com sucesso' };
  }
}

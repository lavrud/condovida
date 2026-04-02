import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { CreateSplitDto } from './dto/create-split.dto';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class FinancesService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Payments ─────────────────────────────────────────────────────────────

  async findPayments(residentId?: string) {
    return this.prisma.payment.findMany({
      where: residentId ? { residentId } : undefined,
      include: { resident: { include: { user: { select: { name: true } } } } },
      orderBy: { dueDate: 'desc' },
    });
  }

  async createPayment(dto: CreatePaymentDto) {
    return this.prisma.payment.create({
      data: {
        residentId: dto.residentId,
        month: dto.month,
        amount: dto.amount,
        dueDate: new Date(dto.dueDate),
        barcode: dto.barcode,
        status: PaymentStatus.PENDING,
      },
    });
  }

  async payPayment(id: string) {
    const payment = await this.prisma.payment.findUnique({ where: { id } });
    if (!payment) throw new NotFoundException(`Pagamento #${id} não encontrado`);

    return this.prisma.payment.update({
      where: { id },
      data: { status: PaymentStatus.PAID, paidDate: new Date() },
    });
  }

  // ─── Expenses ─────────────────────────────────────────────────────────────

  async findExpenses() {
    return this.prisma.expense.findMany({ orderBy: { date: 'desc' } });
  }

  async createExpense(dto: CreateExpenseDto) {
    return this.prisma.expense.create({
      data: {
        description: dto.description,
        amount: dto.amount,
        category: dto.category,
        date: new Date(dto.date),
        notes: dto.notes,
      },
    });
  }

  async deleteExpense(id: string) {
    const expense = await this.prisma.expense.findUnique({ where: { id } });
    if (!expense) throw new NotFoundException(`Despesa #${id} não encontrada`);
    return this.prisma.expense.delete({ where: { id } });
  }

  // ─── Splits ───────────────────────────────────────────────────────────────

  async findSplits() {
    return this.prisma.expenseSplit.findMany({ orderBy: { date: 'desc' } });
  }

  async createSplit(dto: CreateSplitDto) {
    const perUnit = Math.round((dto.total / dto.units) * 100) / 100;
    return this.prisma.expenseSplit.create({
      data: {
        description: dto.description,
        total: dto.total,
        units: dto.units,
        perUnit,
        status: 'PENDING',
      },
    });
  }

  async approveSplit(id: string) {
    const split = await this.prisma.expenseSplit.findUnique({ where: { id } });
    if (!split) throw new NotFoundException(`Rateio #${id} não encontrado`);
    return this.prisma.expenseSplit.update({ where: { id }, data: { status: 'APPROVED' } });
  }

  // ─── Summary ──────────────────────────────────────────────────────────────

  async getRevenueSummary() {
    const months = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);

      const [payments, expenses] = await Promise.all([
        this.prisma.payment.aggregate({
          where: { paidDate: { gte: start, lte: end }, status: PaymentStatus.PAID },
          _sum: { amount: true },
        }),
        this.prisma.expense.aggregate({
          where: { date: { gte: start, lte: end } },
          _sum: { amount: true },
        }),
      ]);

      months.push({
        month: d.toLocaleString('pt-BR', { month: 'short' }),
        revenue: payments._sum.amount || 0,
        expenses: expenses._sum.amount || 0,
      });
    }

    return months;
  }
}

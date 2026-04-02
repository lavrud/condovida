import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { FinancesService } from './finances.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { CreateSplitDto } from './dto/create-split.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role, JwtPayload } from '@condovida/shared';

@ApiTags('finances')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('finances')
export class FinancesController {
  constructor(private readonly financesService: FinancesService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Resumo receitas vs despesas (6 meses)' })
  getRevenueSummary() {
    return this.financesService.getRevenueSummary();
  }

  // ─── Payments ─────────────────────────────────────────────────────────────

  @Get('payments')
  @ApiOperation({ summary: 'Listar pagamentos' })
  @ApiQuery({ name: 'mine', required: false, type: Boolean })
  findPayments(@CurrentUser() user: JwtPayload, @Query('mine') mine?: boolean) {
    if (mine) return this.financesService.findPayments(user.sub);
    return this.financesService.findPayments();
  }

  @Post('payments')
  @Roles(Role.SINDICO)
  @ApiOperation({ summary: 'Criar boleto (síndico)' })
  createPayment(@Body() dto: CreatePaymentDto) {
    return this.financesService.createPayment(dto);
  }

  @Patch('payments/:id/pay')
  @ApiOperation({ summary: 'Marcar pagamento como pago' })
  payPayment(@Param('id') id: string) {
    return this.financesService.payPayment(id);
  }

  // ─── Expenses ─────────────────────────────────────────────────────────────

  @Get('expenses')
  @ApiOperation({ summary: 'Listar despesas' })
  findExpenses() {
    return this.financesService.findExpenses();
  }

  @Post('expenses')
  @Roles(Role.SINDICO)
  @ApiOperation({ summary: 'Criar despesa (síndico)' })
  createExpense(@Body() dto: CreateExpenseDto) {
    return this.financesService.createExpense(dto);
  }

  @Delete('expenses/:id')
  @Roles(Role.SINDICO)
  @ApiOperation({ summary: 'Remover despesa (síndico)' })
  deleteExpense(@Param('id') id: string) {
    return this.financesService.deleteExpense(id);
  }

  // ─── Splits ───────────────────────────────────────────────────────────────

  @Get('splits')
  @ApiOperation({ summary: 'Listar rateios' })
  findSplits() {
    return this.financesService.findSplits();
  }

  @Post('splits')
  @Roles(Role.SINDICO)
  @ApiOperation({ summary: 'Criar rateio extraordinário (síndico)' })
  createSplit(@Body() dto: CreateSplitDto) {
    return this.financesService.createSplit(dto);
  }

  @Patch('splits/:id/approve')
  @Roles(Role.SINDICO)
  @ApiOperation({ summary: 'Aprovar rateio (síndico)' })
  approveSplit(@Param('id') id: string) {
    return this.financesService.approveSplit(id);
  }
}

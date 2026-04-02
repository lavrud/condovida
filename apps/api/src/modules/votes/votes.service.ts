import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { VoteSessionStatus } from '@prisma/client';

@Injectable()
export class VotesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    const sessions = await this.prisma.voteSession.findMany({
      include: {
        options: true,
        author: { select: { id: true, name: true } },
        sessionVotes: { where: { userId }, select: { optionId: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return sessions.map((s) => ({
      ...s,
      userVoted: s.sessionVotes.length > 0,
      sessionVotes: undefined,
    }));
  }

  async findOne(id: string, userId: string) {
    const session = await this.prisma.voteSession.findUnique({
      where: { id },
      include: {
        options: true,
        author: { select: { id: true, name: true } },
        sessionVotes: { where: { userId }, select: { optionId: true } },
      },
    });

    if (!session) throw new NotFoundException(`Votação #${id} não encontrada`);
    return { ...session, userVoted: session.sessionVotes.length > 0, sessionVotes: undefined };
  }

  async create(dto: CreateVoteDto, authorId: string) {
    return this.prisma.voteSession.create({
      data: {
        title: dto.title,
        description: dto.description,
        deadline: new Date(dto.deadline),
        quorum: dto.quorum,
        totalEligible: dto.totalEligible,
        authorId,
        status: VoteSessionStatus.OPEN,
        options: {
          create: dto.options.map((text) => ({ text })),
        },
      },
      include: { options: true },
    });
  }

  async vote(sessionId: string, optionId: string, userId: string) {
    const session = await this.prisma.voteSession.findUnique({
      where: { id: sessionId },
      include: { sessionVotes: { where: { userId } } },
    });

    if (!session) throw new NotFoundException(`Votação #${sessionId} não encontrada`);
    if (session.status === VoteSessionStatus.CLOSED) throw new ConflictException('Esta votação está encerrada');
    if (session.sessionVotes.length > 0) throw new ConflictException('Você já votou nesta votação');
    if (new Date() > session.deadline) throw new ConflictException('O prazo para votação expirou');

    await this.prisma.$transaction([
      this.prisma.sessionVote.create({ data: { voteSessionId: sessionId, optionId, userId } }),
      this.prisma.voteOption.update({ where: { id: optionId }, data: { votes: { increment: 1 } } }),
    ]);

    return this.findOne(sessionId, userId);
  }

  async generateMinutes(id: string) {
    const session = await this.prisma.voteSession.findUnique({
      where: { id },
      include: { options: true },
    });

    if (!session) throw new NotFoundException(`Votação #${id} não encontrada`);

    const totalVotes = session.options.reduce((sum, o) => sum + o.votes, 0);
    const winner = [...session.options].sort((a, b) => b.votes - a.votes)[0];
    const quorumReached = totalVotes >= session.quorum;

    const lines: string[] = [
      'ATA DA VOTAÇÃO ONLINE',
      '',
      `Assunto: ${session.title}`,
      `Descrição: ${session.description}`,
      `Data de encerramento: ${new Date().toLocaleDateString('pt-BR')}`,
      `Total de votos: ${totalVotes}`,
      `Quórum necessário: ${session.quorum}/${session.totalEligible}`,
      '',
      'RESULTADO:',
    ];

    session.options.forEach((o) => {
      const pct = totalVotes > 0 ? Math.round((o.votes / totalVotes) * 100) : 0;
      lines.push(`  ${o.text}: ${o.votes} votos (${pct}%)`);
    });

    lines.push('');
    if (quorumReached) {
      lines.push(`APROVADA — "${winner.text}" com ${winner.votes} votos.`);
    } else {
      lines.push(`NÃO ATINGIU QUÓRUM (${totalVotes}/${session.quorum}). Votação inválida.`);
    }

    const minutes = lines.join('\n');

    return this.prisma.voteSession.update({
      where: { id },
      data: { status: VoteSessionStatus.CLOSED, minutes },
    });
  }

  async close(id: string) {
    await this.prisma.voteSession.findUniqueOrThrow({ where: { id } });
    return this.prisma.voteSession.update({
      where: { id },
      data: { status: VoteSessionStatus.CLOSED },
    });
  }
}

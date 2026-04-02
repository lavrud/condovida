import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreatePollDto } from './dto/create-poll.dto';

@Injectable()
export class PollsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    const polls = await this.prisma.poll.findMany({
      include: {
        options: true,
        author: { select: { id: true, name: true } },
        votes: { where: { userId }, select: { optionId: true } },
      },
      orderBy: { deadline: 'asc' },
    });

    return polls.map((poll) => ({
      ...poll,
      userVoted: poll.votes.length > 0,
      votes: undefined,
    }));
  }

  async findOne(id: string, userId: string) {
    const poll = await this.prisma.poll.findUnique({
      where: { id },
      include: {
        options: true,
        author: { select: { id: true, name: true } },
        votes: { where: { userId }, select: { optionId: true } },
      },
    });

    if (!poll) throw new NotFoundException(`Enquete #${id} não encontrada`);
    return { ...poll, userVoted: poll.votes.length > 0, votes: undefined };
  }

  async create(dto: CreatePollDto, authorId: string) {
    const totalResidents = await this.prisma.resident.count({ where: { active: true } });

    return this.prisma.poll.create({
      data: {
        question: dto.question,
        deadline: new Date(dto.deadline),
        authorId,
        totalEligible: totalResidents,
        options: {
          create: dto.options.map((text) => ({ text })),
        },
      },
      include: { options: true },
    });
  }

  async vote(pollId: string, optionId: string, userId: string) {
    const poll = await this.prisma.poll.findUnique({
      where: { id: pollId },
      include: { votes: { where: { userId } } },
    });

    if (!poll) throw new NotFoundException(`Enquete #${pollId} não encontrada`);
    if (poll.votes.length > 0) throw new ConflictException('Você já votou nesta enquete');
    if (new Date() > poll.deadline) throw new ConflictException('Esta enquete está encerrada');

    await this.prisma.$transaction([
      this.prisma.pollVote.create({ data: { pollId, optionId, userId } }),
      this.prisma.pollOption.update({ where: { id: optionId }, data: { votes: { increment: 1 } } }),
    ]);

    return this.findOne(pollId, userId);
  }

  async remove(id: string) {
    await this.prisma.poll.findUniqueOrThrow({ where: { id } });
    return this.prisma.poll.delete({ where: { id } });
  }
}

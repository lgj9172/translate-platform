import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ok, paginated } from "../common/response";
import { PrismaService } from "../prisma/prisma.service";
import type { CreateAnswerDto, CreateCounselDto, QueryCounselDto } from "./counsels.dto";

@Injectable()
export class CounselsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, query: QueryCounselDto) {
    const where = {
      user_id: userId,
      is_deleted: false,
      ...(query.is_done !== undefined ? { is_done: query.is_done === "true" } : {}),
    };
    const [data, total_count] = await this.prisma.$transaction([
      this.prisma.counsel.findMany({
        where,
        include: { answers: true },
        orderBy: { created_at: "desc" },
      }),
      this.prisma.counsel.count({ where }),
    ]);
    return paginated(data, total_count, data.length);
  }

  async create(userId: string, dto: CreateCounselDto) {
    const counsel = await this.prisma.counsel.create({
      data: {
        content: dto.content,
        category: dto.category as never,
        file_id: dto.file_id,
        user_id: userId,
      },
    });
    return ok(counsel);
  }

  async findOne(counselId: string, userId: string) {
    const counsel = await this.prisma.counsel.findUnique({
      where: { counsel_id: counselId },
      include: { answers: true },
    });
    if (!counsel) throw new NotFoundException("문의를 찾을 수 없습니다.");
    if (counsel.user_id !== userId) throw new ForbiddenException();
    return ok(counsel);
  }

  async addAnswer(counselId: string, dto: CreateAnswerDto) {
    const answer = await this.prisma.counselAnswer.create({
      data: { content: dto.content, counsel_id: counselId },
    });
    await this.prisma.counsel.update({
      where: { counsel_id: counselId },
      data: { is_done: true },
    });
    return ok(answer);
  }
}

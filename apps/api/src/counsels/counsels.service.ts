import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ok, paginated } from "../common/response";
import { FilesService } from "../files/files.service";
import { PrismaService } from "../prisma/prisma.service";
import {
  CreateAnswerDto,
  CreateCounselDto,
  QueryCounselDto,
  UpdateAnswerDto,
} from "./counsels.dto";

@Injectable()
export class CounselsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly filesService: FilesService,
  ) {}

  async findAll(userId: string, query: QueryCounselDto) {
    const take = query.size ?? 20;
    const skip = query.start ?? 0;
    const where = {
      user_id: userId,
      is_deleted: false,
      ...(query.is_done !== undefined
        ? { is_done: query.is_done === "true" }
        : {}),
    };
    const [data, total_count] = await this.prisma.$transaction([
      this.prisma.counsel.findMany({
        where,
        include: { answers: true },
        skip,
        take,
        orderBy: { created_at: "desc" },
      }),
      this.prisma.counsel.count({ where }),
    ]);
    return paginated(data, total_count, data.length);
  }

  async findAllAdmin(query: QueryCounselDto) {
    const take = query.size ?? 20;
    const skip = query.start ?? 0;
    const where = {
      is_deleted: false,
      ...(query.is_done !== undefined
        ? { is_done: query.is_done === "true" }
        : {}),
    };
    const [data, total_count] = await this.prisma.$transaction([
      this.prisma.counsel.findMany({
        where,
        include: {
          answers: true,
          user: { select: { name: true, email: true } },
        },
        skip,
        take,
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
    });
    if (!counsel) throw new NotFoundException("문의를 찾을 수 없습니다.");
    if (counsel.user_id !== userId) throw new ForbiddenException();

    const fileInfo = counsel.file_id
      ? await this.filesService.enrichFileInfo(counsel.file_id)
      : null;

    return ok({ ...counsel, file: fileInfo });
  }

  async getAnswer(counselId: string, userId: string) {
    const counsel = await this.prisma.counsel.findUnique({
      where: { counsel_id: counselId },
      include: { answers: { orderBy: { answered_at: "desc" }, take: 1 } },
    });
    if (!counsel) throw new NotFoundException("문의를 찾을 수 없습니다.");
    if (counsel.user_id !== userId) throw new ForbiddenException();
    return ok(counsel.answers[0] ?? null);
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

  async updateAnswer(counselId: string, dto: UpdateAnswerDto) {
    const answer = await this.prisma.counselAnswer.findFirst({
      where: { counsel_id: counselId },
      orderBy: { answered_at: "desc" },
    });
    if (!answer) throw new NotFoundException("답변을 찾을 수 없습니다.");
    const updated = await this.prisma.counselAnswer.update({
      where: { answer_id: answer.answer_id },
      data: { content: dto.content },
    });
    return ok(updated);
  }

  async removeAnswer(counselId: string) {
    const answer = await this.prisma.counselAnswer.findFirst({
      where: { counsel_id: counselId },
      orderBy: { answered_at: "desc" },
    });
    if (!answer) throw new NotFoundException("답변을 찾을 수 없습니다.");
    await this.prisma.counselAnswer.delete({
      where: { answer_id: answer.answer_id },
    });
    await this.prisma.counsel.update({
      where: { counsel_id: counselId },
      data: { is_done: false },
    });
    return ok(null);
  }
}

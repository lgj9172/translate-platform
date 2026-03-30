import { Injectable, NotFoundException } from "@nestjs/common";
import { ok, paginated } from "../common/response";
import type { PrismaService } from "../prisma/prisma.service";
import type { CreateFaqDto, UpdateFaqDto } from "./faqs.dto";

@Injectable()
export class FaqsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: { start?: number; size?: number }) {
    const take = query.size ?? 20;
    const skip = query.start ?? 0;
    const [data, total_count] = await this.prisma.$transaction([
      this.prisma.faq.findMany({ skip, take, orderBy: { created_at: "desc" } }),
      this.prisma.faq.count(),
    ]);
    return paginated(data, total_count, data.length);
  }

  async findOne(faqId: string) {
    const faq = await this.prisma.faq.findUnique({ where: { faq_id: faqId } });
    if (!faq) throw new NotFoundException("FAQ를 찾을 수 없습니다.");
    return ok(faq);
  }

  async create(userId: string, dto: CreateFaqDto) {
    const faq = await this.prisma.faq.create({
      data: { ...dto, created_by: userId, updated_by: userId },
    });
    return ok(faq);
  }

  async update(faqId: string, userId: string, dto: UpdateFaqDto) {
    const faq = await this.prisma.faq.update({
      where: { faq_id: faqId },
      data: { ...dto, updated_by: userId },
    });
    return ok(faq);
  }

  async remove(faqId: string) {
    await this.prisma.faq.delete({ where: { faq_id: faqId } });
    return ok(null);
  }
}

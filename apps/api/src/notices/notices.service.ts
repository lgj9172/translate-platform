import { Injectable, NotFoundException } from "@nestjs/common";
import { ok, paginated } from "../common/response";
import type { PrismaService } from "../prisma/prisma.service";
import type { CreateNoticeDto, UpdateNoticeDto } from "./notices.dto";

@Injectable()
export class NoticesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: { start?: number; size?: number }) {
    const take = query.size ?? 20;
    const skip = query.start ?? 0;
    const [data, total_count] = await this.prisma.$transaction([
      this.prisma.notice.findMany({
        skip,
        take,
        orderBy: [{ is_important: "desc" }, { created_at: "desc" }],
      }),
      this.prisma.notice.count(),
    ]);
    return paginated(data, total_count, data.length);
  }

  async findOne(noticeId: string) {
    const notice = await this.prisma.notice.findUnique({
      where: { notice_id: noticeId },
    });
    if (!notice) throw new NotFoundException("공지사항을 찾을 수 없습니다.");
    return ok(notice);
  }

  async create(userId: string, dto: CreateNoticeDto) {
    const notice = await this.prisma.notice.create({
      data: { ...dto, created_by: userId, updated_by: userId },
    });
    return ok(notice);
  }

  async update(noticeId: string, userId: string, dto: UpdateNoticeDto) {
    const notice = await this.prisma.notice.update({
      where: { notice_id: noticeId },
      data: { ...dto, updated_by: userId },
    });
    return ok(notice);
  }

  async remove(noticeId: string) {
    await this.prisma.notice.delete({ where: { notice_id: noticeId } });
    return ok(null);
  }
}

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ok, paginated } from "../common/response";
import { PrismaService } from "../prisma/prisma.service";
import type { CreateQuotationDto, UpdateQuotationDto } from "./quotations.dto";

@Injectable()
export class QuotationsService {
  constructor(private readonly prisma: PrismaService) {}

  /** 번역사 자신의 견적 목록 또는 특정 번역의 견적 목록 */
  async findAll(query: { translatorId?: string; translationId?: string }) {
    const where = {
      is_deleted: false,
      ...(query.translatorId ? { translator_id: query.translatorId } : {}),
      ...(query.translationId ? { translation_id: query.translationId } : {}),
    };
    const [data, total_count] = await this.prisma.$transaction([
      this.prisma.quotation.findMany({ where, orderBy: { created_at: "desc" } }),
      this.prisma.quotation.count({ where }),
    ]);
    return paginated(data, total_count, data.length);
  }

  async create(translatorId: string, dto: CreateQuotationDto) {
    const quotation = await this.prisma.quotation.create({
      data: {
        translation_id: dto.translation_id,
        translator_id: translatorId,
        fee: dto.fee,
        detail: dto.detail,
      },
    });
    return ok(quotation);
  }

  async findOne(quotationId: string) {
    const quotation = await this.prisma.quotation.findUnique({
      where: { quotation_id: quotationId },
    });
    if (!quotation) throw new NotFoundException("견적을 찾을 수 없습니다.");
    return ok(quotation);
  }

  async update(quotationId: string, translatorId: string, dto: UpdateQuotationDto) {
    const quotation = await this.prisma.quotation.findUnique({
      where: { quotation_id: quotationId },
    });
    if (!quotation) throw new NotFoundException();
    if (quotation.translator_id !== translatorId) throw new ForbiddenException();

    const updated = await this.prisma.quotation.update({
      where: { quotation_id: quotationId },
      data: dto,
    });
    return ok(updated);
  }

  async cancel(quotationId: string, translatorId: string) {
    const quotation = await this.prisma.quotation.findUnique({
      where: { quotation_id: quotationId },
    });
    if (!quotation) throw new NotFoundException();
    if (quotation.translator_id !== translatorId) throw new ForbiddenException();

    await this.prisma.quotation.update({
      where: { quotation_id: quotationId },
      data: { is_canceled: true },
    });
    return ok(null);
  }

  /** 의뢰인이 견적(번역사)을 선택 */
  async select(quotationId: string, userId: string) {
    const quotation = await this.prisma.quotation.findUnique({
      where: { quotation_id: quotationId },
      include: { translation: true },
    });
    if (!quotation) throw new NotFoundException();
    if (quotation.translation.user_id !== userId) throw new ForbiddenException();

    await this.prisma.$transaction([
      this.prisma.quotation.update({
        where: { quotation_id: quotationId },
        data: { is_selected: true },
      }),
      this.prisma.translation.update({
        where: { translation_id: quotation.translation_id },
        data: { status: "TRANSLATOR_SELECTED" },
      }),
    ]);
    return ok(null);
  }
}

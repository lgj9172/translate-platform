import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { ok, paginated } from "../common/response";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateQuotationDto } from "./quotations.dto";

@Injectable()
export class QuotationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByUser(
    userId: string,
    query: { start?: number; size?: number },
  ) {
    const translator = await this.prisma.translator.findUnique({
      where: { user_id: userId },
    });
    if (!translator) return paginated([], 0, 0);

    const take = query.size ?? 20;
    const skip = query.start ?? 0;
    const where = {
      translator_id: translator.translator_id,
      is_deleted: false,
    };

    const [data, total_count] = await this.prisma.$transaction([
      this.prisma.quotation.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: "desc" },
      }),
      this.prisma.quotation.count({ where }),
    ]);
    return paginated(data, total_count, data.length);
  }

  async findOne(quotationId: string, userId: string) {
    const quotation = await this.prisma.quotation.findUnique({
      where: { quotation_id: quotationId },
      include: { translation: { select: { user_id: true } } },
    });
    if (!quotation) throw new NotFoundException("견적을 찾을 수 없습니다.");

    // 의뢰인 또는 견적을 낸 번역사만 조회 가능
    const isOwner = quotation.translation.user_id === userId;
    if (!isOwner) {
      const translator = await this.prisma.translator.findUnique({
        where: { user_id: userId },
      });
      if (translator?.translator_id !== quotation.translator_id)
        throw new ForbiddenException();
    }

    return ok(quotation);
  }

  async update(quotationId: string, userId: string, dto: UpdateQuotationDto) {
    const translator = await this.prisma.translator.findUnique({
      where: { user_id: userId },
    });
    if (!translator) throw new ForbiddenException();

    const quotation = await this.prisma.quotation.findUnique({
      where: { quotation_id: quotationId },
    });
    if (!quotation) throw new NotFoundException();
    if (quotation.translator_id !== translator.translator_id)
      throw new ForbiddenException();
    if (quotation.is_canceled)
      throw new BadRequestException("취소된 견적은 수정할 수 없습니다.");
    if (quotation.is_selected)
      throw new BadRequestException("선택된 견적은 수정할 수 없습니다.");

    const updated = await this.prisma.quotation.update({
      where: { quotation_id: quotationId },
      data: dto,
    });
    return ok(updated);
  }

  async cancel(quotationId: string, userId: string) {
    const translator = await this.prisma.translator.findUnique({
      where: { user_id: userId },
    });
    if (!translator) throw new ForbiddenException();

    const quotation = await this.prisma.quotation.findUnique({
      where: { quotation_id: quotationId },
      include: { translation: true },
    });
    if (!quotation) throw new NotFoundException();
    if (quotation.translator_id !== translator.translator_id)
      throw new ForbiddenException();
    if (quotation.is_canceled)
      throw new BadRequestException("이미 취소된 견적입니다.");

    // 선택된 견적 취소 시 → translation 상태도 QUOTE_SENT로 롤백
    if (quotation.is_selected) {
      await this.prisma.$transaction([
        this.prisma.quotation.update({
          where: { quotation_id: quotationId },
          data: { is_canceled: true, is_selected: false },
        }),
        this.prisma.translation.update({
          where: { translation_id: quotation.translation_id },
          data: { status: "QUOTE_SENT" },
        }),
      ]);
    } else {
      await this.prisma.quotation.update({
        where: { quotation_id: quotationId },
        data: { is_canceled: true },
      });
    }
    return ok(null);
  }

  /** 의뢰인이 견적(번역사)을 선택 */
  async select(quotationId: string, userId: string) {
    const quotation = await this.prisma.quotation.findUnique({
      where: { quotation_id: quotationId },
      include: { translation: true },
    });
    if (!quotation) throw new NotFoundException();
    if (quotation.translation.user_id !== userId)
      throw new ForbiddenException();

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

  // ── 중첩 라우트용 (/translations/:id/quotations) ─────────────────────────────

  async findAllByTranslation(translationId: string) {
    const data = await this.prisma.quotation.findMany({
      where: {
        translation_id: translationId,
        is_deleted: false,
        is_canceled: false,
      },
      orderBy: { created_at: "desc" },
    });
    return paginated(data, data.length, data.length);
  }

  /** 현재 로그인한 번역사가 이 번역에 보낸 견적 */
  async findMyQuotationByTranslation(translationId: string, userId: string) {
    const translator = await this.prisma.translator.findUnique({
      where: { user_id: userId },
    });
    if (!translator) return ok(null);

    const quotation = await this.prisma.quotation.findFirst({
      where: {
        translation_id: translationId,
        translator_id: translator.translator_id,
        is_deleted: false,
        is_canceled: false,
      },
    });
    return ok(quotation ?? null);
  }

  /** 중첩 라우트에서 견적 생성 (translation_id는 URL에서) */
  async createNested(
    translationId: string,
    userId: string,
    fee: { unit: string; value: number },
    detail?: string,
  ) {
    const translation = await this.prisma.translation.findUnique({
      where: { translation_id: translationId },
    });
    if (!translation) throw new NotFoundException("번역을 찾을 수 없습니다.");
    if (translation.status !== "QUOTE_SENT")
      throw new BadRequestException(
        "견적 모집 중인 번역에만 견적을 제출할 수 있습니다.",
      );

    const translator = await this.prisma.translator.findUnique({
      where: { user_id: userId },
    });
    if (!translator)
      throw new UnprocessableEntityException("번역사 프로필이 없습니다.");

    // 이미 제출한 견적이 있으면 중복 방지
    const existing = await this.prisma.quotation.findFirst({
      where: {
        translation_id: translationId,
        translator_id: translator.translator_id,
        is_canceled: false,
      },
    });
    if (existing)
      throw new ConflictException("이미 이 번역에 견적을 제출하셨습니다.");

    const quotation = await this.prisma.quotation.create({
      data: {
        translation_id: translationId,
        translator_id: translator.translator_id,
        fee,
        detail,
      },
    });
    return ok(quotation);
  }
}

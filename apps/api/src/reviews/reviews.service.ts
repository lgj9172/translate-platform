import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { ok, paginated } from "../common/response";
import type { PrismaService } from "../prisma/prisma.service";
import type { CreateReviewDto, QueryReviewDto } from "./reviews.dto";

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByTranslator(translatorId: string, query: QueryReviewDto) {
    const take = query.size ?? 20;
    const skip = query.start ?? 0;
    const where = { translator_id: translatorId };
    const [data, total_count] = await this.prisma.$transaction([
      this.prisma.review.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: "desc" },
      }),
      this.prisma.review.count({ where }),
    ]);
    return paginated(data, total_count, data.length);
  }

  async create(userId: string, dto: CreateReviewDto) {
    const translation = await this.prisma.translation.findUnique({
      where: { translation_id: dto.translation_id },
    });
    if (!translation) throw new NotFoundException("번역을 찾을 수 없습니다.");
    if (translation.user_id !== userId)
      throw new ForbiddenException(
        "본인의 번역에만 리뷰를 작성할 수 있습니다.",
      );
    if (translation.status !== "TRANSLATION_RESOLVED")
      throw new UnprocessableEntityException(
        "완료된 번역에만 리뷰를 작성할 수 있습니다.",
      );

    const selectedQuotation = await this.prisma.quotation.findFirst({
      where: { translation_id: dto.translation_id, is_selected: true },
    });
    if (!selectedQuotation)
      throw new UnprocessableEntityException("선택된 번역사가 없습니다.");

    const existing = await this.prisma.review.findFirst({
      where: { translation_id: dto.translation_id },
    });
    if (existing) throw new ConflictException("이미 리뷰를 작성하셨습니다.");

    const review = await this.prisma.review.create({
      data: {
        user_id: userId,
        translator_id: selectedQuotation.translator_id,
        translation_id: dto.translation_id,
        ratings: dto.ratings,
        comment: dto.comment,
      },
    });
    return ok(review);
  }
}

import { Injectable } from "@nestjs/common";
import { ok, paginated } from "../common/response";
import { PrismaService } from "../prisma/prisma.service";
import type { CreateReviewDto, QueryReviewDto } from "./reviews.dto";

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByTranslator(translatorId: string, query: QueryReviewDto) {
    const take = query.size ?? 20;
    const skip = query.start ?? 0;
    const where = { translator_id: translatorId };
    const [data, total_count] = await this.prisma.$transaction([
      this.prisma.review.findMany({ where, skip, take, orderBy: { created_at: "desc" } }),
      this.prisma.review.count({ where }),
    ]);
    return paginated(data, total_count, data.length);
  }

  async create(dto: CreateReviewDto) {
    const review = await this.prisma.review.create({
      data: {
        translator_id: dto.translator_id,
        translation_id: dto.translation_id,
        ratings: dto.ratings,
        comment: dto.comment,
      },
    });
    return ok(review);
  }
}

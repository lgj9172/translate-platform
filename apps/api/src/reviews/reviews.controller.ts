import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Public } from "../common/decorators/public.decorator";
import type { CreateReviewDto, QueryReviewDto } from "./reviews.dto";
import type { ReviewsService } from "./reviews.service";

@ApiTags("Reviews")
@Controller("reviews")
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get("translator/:translatorId")
  @Public()
  @ApiOperation({ summary: "번역사 리뷰 목록" })
  findByTranslator(
    @Param("translatorId") translatorId: string,
    @Query() query: QueryReviewDto,
  ) {
    return this.reviewsService.findByTranslator(translatorId, query);
  }

  @Post()
  @ApiOperation({ summary: "리뷰 작성" })
  create(@CurrentUser() user: SupabaseUser, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(user.id, dto);
  }
}

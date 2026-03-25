import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { QuotationsService } from "../quotations/quotations.service";
import {
  CreateCommentDto,
  CreateTranslationDto,
  CreateTranslationQuotationDto,
  QueryTranslationDto,
  UpdateTranslationDto,
} from "./translations.dto";
import { TranslationsService } from "./translations.service";

@ApiTags("Translations")
@Controller("translations")
export class TranslationsController {
  constructor(
    private readonly translationsService: TranslationsService,
    private readonly quotationsService: QuotationsService,
  ) {}

  @Get()
  @ApiOperation({ summary: "번역 목록 조회 (공개 마켓플레이스)" })
  findAll(@Query() query: QueryTranslationDto) {
    return this.translationsService.findAll(query);
  }

  @Get("client")
  @ApiOperation({ summary: "내가 보낸 번역 요청 목록 조회" })
  findAllByUser(
    @CurrentUser() user: SupabaseUser,
    @Query() query: QueryTranslationDto,
  ) {
    return this.translationsService.findAllByUser(user.id, query);
  }

  @Get("translator")
  @ApiOperation({ summary: "번역사로 받은 번역 요청 목록 조회" })
  findAllByTranslator(
    @CurrentUser() user: SupabaseUser,
    @Query() query: QueryTranslationDto,
  ) {
    return this.translationsService.findAllByTranslator(user.id, query);
  }

  @Post()
  @ApiOperation({ summary: "번역 요청 생성" })
  create(
    @CurrentUser() user: SupabaseUser,
    @Body() dto: CreateTranslationDto,
  ) {
    return this.translationsService.create(user.id, dto);
  }

  @Get(":translationId")
  @ApiOperation({ summary: "번역 상세 조회" })
  findOne(@Param("translationId") translationId: string) {
    return this.translationsService.findOne(translationId);
  }

  @Patch(":translationId")
  @ApiOperation({ summary: "번역 수정" })
  update(
    @CurrentUser() user: SupabaseUser,
    @Param("translationId") translationId: string,
    @Body() dto: UpdateTranslationDto,
  ) {
    return this.translationsService.update(translationId, user.id, dto);
  }

  @Delete(":translationId")
  @ApiOperation({ summary: "번역 삭제" })
  remove(
    @CurrentUser() user: SupabaseUser,
    @Param("translationId") translationId: string,
  ) {
    return this.translationsService.remove(translationId, user.id);
  }

  @Post(":translationId/cancel")
  @ApiOperation({ summary: "번역 취소" })
  cancel(
    @CurrentUser() user: SupabaseUser,
    @Param("translationId") translationId: string,
  ) {
    return this.translationsService.cancel(translationId, user.id);
  }

  @Post(":translationId/resolve")
  @ApiOperation({ summary: "번역 완료 처리" })
  resolve(
    @CurrentUser() user: SupabaseUser,
    @Param("translationId") translationId: string,
  ) {
    return this.translationsService.resolve(translationId, user.id);
  }

  @Get(":translationId/comments")
  @ApiOperation({ summary: "번역 댓글 목록" })
  getComments(@Param("translationId") translationId: string) {
    return this.translationsService.getComments(translationId);
  }

  @Post(":translationId/comments")
  @ApiOperation({ summary: "번역 댓글 작성" })
  addComment(
    @CurrentUser() user: SupabaseUser,
    @Param("translationId") translationId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.translationsService.addComment(translationId, user.id, dto);
  }

  // ── Quotations (중첩 라우트) ─────────────────────────────────────────────────

  @Get(":translationId/quotations")
  @ApiOperation({ summary: "번역의 견적 목록" })
  getQuotations(@Param("translationId") translationId: string) {
    return this.quotationsService.findAllByTranslation(translationId);
  }

  @Get(":translationId/quotations/translator")
  @ApiOperation({ summary: "현재 번역사가 이 번역에 보낸 견적" })
  getMyQuotation(
    @CurrentUser() user: SupabaseUser,
    @Param("translationId") translationId: string,
  ) {
    return this.quotationsService.findMyQuotationByTranslation(translationId, user.id);
  }

  @Post(":translationId/quotations")
  @ApiOperation({ summary: "견적 제출" })
  createQuotation(
    @CurrentUser() user: SupabaseUser,
    @Param("translationId") translationId: string,
    @Body() dto: CreateTranslationQuotationDto,
  ) {
    return this.quotationsService.createNested(translationId, user.id, dto.fee, dto.detail);
  }

  @Post(":translationId/quotations/:quotationId/cancel")
  @ApiOperation({ summary: "견적 취소" })
  cancelQuotation(
    @CurrentUser() user: SupabaseUser,
    @Param("quotationId") quotationId: string,
  ) {
    return this.quotationsService.cancel(quotationId, user.id);
  }

  @Post(":translationId/quotations/:quotationId/select")
  @ApiOperation({ summary: "견적 선택 (의뢰인)" })
  selectQuotation(
    @CurrentUser() user: SupabaseUser,
    @Param("quotationId") quotationId: string,
  ) {
    return this.quotationsService.select(quotationId, user.id);
  }

  @Get(":translationId/selected-quotation")
  @ApiOperation({ summary: "선택된 견적 조회" })
  getSelectedQuotation(@Param("translationId") translationId: string) {
    return this.quotationsService.findSelectedQuotation(translationId);
  }
}

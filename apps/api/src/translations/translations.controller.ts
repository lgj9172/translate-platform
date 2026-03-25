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
import {
  CreateCommentDto,
  CreateTranslationDto,
  QueryTranslationDto,
  UpdateTranslationDto,
} from "./translations.dto";
import { TranslationsService } from "./translations.service";

@ApiTags("Translations")
@Controller("translations")
export class TranslationsController {
  constructor(private readonly translationsService: TranslationsService) {}

  @Get()
  @ApiOperation({ summary: "내 번역 목록 조회" })
  findAll(
    @CurrentUser() user: SupabaseUser,
    @Query() query: QueryTranslationDto,
  ) {
    return this.translationsService.findAll(user.id, query);
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
}

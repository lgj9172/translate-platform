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
import { Public } from "../common/decorators/public.decorator";
import {
  CreateTranslatorDto,
  UpdateTranslatorDto,
  UpsertCareerDto,
  UpsertCertificationDto,
  UpsertEducationDto,
  UpsertSampleDto,
} from "./translators.dto";
import { TranslatorsService } from "./translators.service";

@ApiTags("Translators")
@Controller("translators")
export class TranslatorsController {
  constructor(private readonly translatorsService: TranslatorsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: "번역사 목록 조회" })
  findAll(
    @Query("start") start?: number,
    @Query("size") size?: number,
    @Query("category") category?: string,
  ) {
    return this.translatorsService.findAll({ start, size, category });
  }

  @Get("me")
  @ApiOperation({ summary: "내 번역사 프로필" })
  findMe(@CurrentUser() user: SupabaseUser) {
    return this.translatorsService.findByUserId(user.id);
  }

  @Post()
  @ApiOperation({ summary: "번역사 프로필 생성" })
  create(@CurrentUser() user: SupabaseUser, @Body() dto: CreateTranslatorDto) {
    return this.translatorsService.create(user.id, dto);
  }

  @Get(":translatorId")
  @Public()
  @ApiOperation({ summary: "번역사 상세 조회" })
  findOne(@Param("translatorId") translatorId: string) {
    return this.translatorsService.findOne(translatorId);
  }

  @Patch(":translatorId")
  @ApiOperation({ summary: "번역사 프로필 수정" })
  update(
    @CurrentUser() user: SupabaseUser,
    @Param("translatorId") translatorId: string,
    @Body() dto: UpdateTranslatorDto,
  ) {
    return this.translatorsService.update(translatorId, user.id, dto);
  }

  @Get(":translatorId/reviews")
  @Public()
  @ApiOperation({ summary: "번역사 리뷰 목록" })
  getReviews(@Param("translatorId") translatorId: string) {
    return this.translatorsService.getReviews(translatorId);
  }

  // ── Education ──────────────────────────────────────────────────────────────

  @Post(":translatorId/educations")
  @ApiOperation({ summary: "학력 추가/수정" })
  upsertEducation(
    @CurrentUser() user: SupabaseUser,
    @Param("translatorId") translatorId: string,
    @Body() dto: UpsertEducationDto,
  ) {
    return this.translatorsService.upsertEducation(translatorId, user.id, dto);
  }

  @Delete(":translatorId/educations/:educationId")
  @ApiOperation({ summary: "학력 삭제" })
  removeEducation(
    @CurrentUser() user: SupabaseUser,
    @Param("educationId") educationId: string,
  ) {
    return this.translatorsService.removeEducation(educationId, user.id);
  }

  // ── Career ─────────────────────────────────────────────────────────────────

  @Post(":translatorId/careers")
  @ApiOperation({ summary: "경력 추가/수정" })
  upsertCareer(
    @CurrentUser() user: SupabaseUser,
    @Param("translatorId") translatorId: string,
    @Body() dto: UpsertCareerDto,
  ) {
    return this.translatorsService.upsertCareer(translatorId, user.id, dto);
  }

  @Delete(":translatorId/careers/:careerId")
  @ApiOperation({ summary: "경력 삭제" })
  removeCareer(
    @CurrentUser() user: SupabaseUser,
    @Param("careerId") careerId: string,
  ) {
    return this.translatorsService.removeCareer(careerId, user.id);
  }

  // ── Certification ───────────────────────────────────────────────────────────

  @Post(":translatorId/certifications")
  @ApiOperation({ summary: "자격증 추가/수정" })
  upsertCertification(
    @CurrentUser() user: SupabaseUser,
    @Param("translatorId") translatorId: string,
    @Body() dto: UpsertCertificationDto,
  ) {
    return this.translatorsService.upsertCertification(translatorId, user.id, dto);
  }

  @Delete(":translatorId/certifications/:certificationId")
  @ApiOperation({ summary: "자격증 삭제" })
  removeCertification(
    @CurrentUser() user: SupabaseUser,
    @Param("certificationId") certificationId: string,
  ) {
    return this.translatorsService.removeCertification(certificationId, user.id);
  }

  // ── Sample ──────────────────────────────────────────────────────────────────

  @Post(":translatorId/samples")
  @ApiOperation({ summary: "번역 샘플 추가/수정" })
  upsertSample(
    @CurrentUser() user: SupabaseUser,
    @Param("translatorId") translatorId: string,
    @Body() dto: UpsertSampleDto,
  ) {
    return this.translatorsService.upsertSample(translatorId, user.id, dto);
  }

  @Delete(":translatorId/samples/:sampleId")
  @ApiOperation({ summary: "번역 샘플 삭제" })
  removeSample(
    @CurrentUser() user: SupabaseUser,
    @Param("sampleId") sampleId: string,
  ) {
    return this.translatorsService.removeSample(sampleId, user.id);
  }
}

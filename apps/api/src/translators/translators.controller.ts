import {
  Body,
  Controller,
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
import type {
  CreateTranslatorDto,
  QueryTranslatorDto,
  UpdateTranslatorDto,
} from "./translators.dto";
import type { TranslatorsService } from "./translators.service";

@ApiTags("Translators")
@Controller("translators")
export class TranslatorsController {
  constructor(private readonly translatorsService: TranslatorsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: "번역사 목록 조회" })
  findAll(@Query() query: QueryTranslatorDto) {
    return this.translatorsService.findAll(query);
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

  @Post(":translatorId/publish")
  @ApiOperation({ summary: "번역사 프로필 공개" })
  publish(
    @CurrentUser() user: SupabaseUser,
    @Param("translatorId") translatorId: string,
  ) {
    return this.translatorsService.publish(translatorId, user.id);
  }
}

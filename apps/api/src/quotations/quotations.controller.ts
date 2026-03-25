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
import { CreateQuotationDto, UpdateQuotationDto } from "./quotations.dto";
import { QuotationsService } from "./quotations.service";

@ApiTags("Quotations")
@Controller("quotations")
export class QuotationsController {
  constructor(private readonly quotationsService: QuotationsService) {}

  @Get()
  @ApiOperation({ summary: "견적 목록 조회 (?translatorId= or ?translationId=)" })
  findAll(
    @Query("translatorId") translatorId?: string,
    @Query("translationId") translationId?: string,
  ) {
    return this.quotationsService.findAll({ translatorId, translationId });
  }

  @Get("me")
  @ApiOperation({ summary: "내가 보낸 견적 목록 조회 (번역사)" })
  findMine(
    @CurrentUser() user: SupabaseUser,
    @Query("start") start?: number,
    @Query("size") size?: number,
  ) {
    return this.quotationsService.findAllByUser(user.id, { start, size });
  }

  @Post()
  @ApiOperation({ summary: "견적 제출 (번역사)" })
  create(@CurrentUser() user: SupabaseUser, @Body() dto: CreateQuotationDto) {
    return this.quotationsService.create(user.id, dto);
  }

  @Get(":quotationId")
  @ApiOperation({ summary: "견적 상세 조회" })
  findOne(@Param("quotationId") quotationId: string) {
    return this.quotationsService.findOne(quotationId);
  }

  @Patch(":quotationId")
  @ApiOperation({ summary: "견적 수정 (번역사)" })
  update(
    @CurrentUser() user: SupabaseUser,
    @Param("quotationId") quotationId: string,
    @Body() dto: UpdateQuotationDto,
  ) {
    return this.quotationsService.update(quotationId, user.id, dto);
  }

  @Delete(":quotationId")
  @ApiOperation({ summary: "견적 취소 (번역사)" })
  cancel(
    @CurrentUser() user: SupabaseUser,
    @Param("quotationId") quotationId: string,
  ) {
    return this.quotationsService.cancel(quotationId, user.id);
  }

  @Post(":quotationId/select")
  @ApiOperation({ summary: "견적 선택 (의뢰인)" })
  select(
    @CurrentUser() user: SupabaseUser,
    @Param("quotationId") quotationId: string,
  ) {
    return this.quotationsService.select(quotationId, user.id);
  }
}

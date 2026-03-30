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
import type { UpdateQuotationDto } from "./quotations.dto";
import type { QuotationsService } from "./quotations.service";

@ApiTags("Quotations")
@Controller("quotations")
export class QuotationsController {
  constructor(private readonly quotationsService: QuotationsService) {}

  @Get("me")
  @ApiOperation({ summary: "내가 보낸 견적 목록 조회 (번역사)" })
  findMine(
    @CurrentUser() user: SupabaseUser,
    @Query("start") start?: number,
    @Query("size") size?: number,
  ) {
    return this.quotationsService.findAllByUser(user.id, { start, size });
  }

  @Get(":quotationId")
  @ApiOperation({ summary: "견적 상세 조회 (의뢰인 또는 해당 번역사만)" })
  findOne(
    @CurrentUser() user: SupabaseUser,
    @Param("quotationId") quotationId: string,
  ) {
    return this.quotationsService.findOne(quotationId, user.id);
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

  @Post(":quotationId/cancel")
  @ApiOperation({ summary: "견적 취소 (번역사)" })
  cancel(
    @CurrentUser() user: SupabaseUser,
    @Param("quotationId") quotationId: string,
  ) {
    return this.quotationsService.cancel(quotationId, user.id);
  }
}

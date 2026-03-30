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
import { Admin } from "../common/decorators/admin.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Public } from "../common/decorators/public.decorator";
import type { CreateFaqDto, UpdateFaqDto } from "./faqs.dto";
import type { FaqsService } from "./faqs.service";

@ApiTags("FAQs")
@Controller("faqs")
export class FaqsController {
  constructor(private readonly faqsService: FaqsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: "FAQ 목록" })
  findAll(@Query("start") start?: number, @Query("size") size?: number) {
    return this.faqsService.findAll({ start, size });
  }

  @Get(":faqId")
  @Public()
  @ApiOperation({ summary: "FAQ 상세" })
  findOne(@Param("faqId") faqId: string) {
    return this.faqsService.findOne(faqId);
  }

  @Post()
  @Admin()
  @ApiOperation({ summary: "FAQ 등록 (관리자)" })
  create(@CurrentUser() user: SupabaseUser, @Body() dto: CreateFaqDto) {
    return this.faqsService.create(user.id, dto);
  }

  @Patch(":faqId")
  @Admin()
  @ApiOperation({ summary: "FAQ 수정 (관리자)" })
  update(
    @CurrentUser() user: SupabaseUser,
    @Param("faqId") faqId: string,
    @Body() dto: UpdateFaqDto,
  ) {
    return this.faqsService.update(faqId, user.id, dto);
  }

  @Delete(":faqId")
  @Admin()
  @ApiOperation({ summary: "FAQ 삭제 (관리자)" })
  remove(@Param("faqId") faqId: string) {
    return this.faqsService.remove(faqId);
  }
}

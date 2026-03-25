import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { Admin } from "../common/decorators/admin.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { CounselsService } from "./counsels.service";
import { CreateAnswerDto, CreateCounselDto, QueryCounselDto } from "./counsels.dto";

@ApiTags("Counsels")
@Controller("counsels")
export class CounselsController {
  constructor(private readonly counselsService: CounselsService) {}

  @Get()
  @ApiOperation({ summary: "내 문의 목록" })
  findAll(
    @CurrentUser() user: SupabaseUser,
    @Query() query: QueryCounselDto,
  ) {
    return this.counselsService.findAll(user.id, query);
  }

  @Post()
  @ApiOperation({ summary: "문의 등록" })
  create(@CurrentUser() user: SupabaseUser, @Body() dto: CreateCounselDto) {
    return this.counselsService.create(user.id, dto);
  }

  @Get(":counselId")
  @ApiOperation({ summary: "문의 상세" })
  findOne(
    @CurrentUser() user: SupabaseUser,
    @Param("counselId") counselId: string,
  ) {
    return this.counselsService.findOne(counselId, user.id);
  }

  @Post(":counselId/answers")
  @Admin()
  @ApiOperation({ summary: "문의 답변 등록 (관리자)" })
  addAnswer(
    @Param("counselId") counselId: string,
    @Body() dto: CreateAnswerDto,
  ) {
    return this.counselsService.addAnswer(counselId, dto);
  }
}

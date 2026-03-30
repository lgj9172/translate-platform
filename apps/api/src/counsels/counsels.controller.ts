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
import { User as SupabaseUser } from "@supabase/supabase-js";
import { Admin } from "../common/decorators/admin.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import type {
  CreateAnswerDto,
  CreateCounselDto,
  QueryCounselDto,
  UpdateAnswerDto,
} from "./counsels.dto";
import { CounselsService } from "./counsels.service";

@ApiTags("Counsels")
@Controller("counsels")
export class CounselsController {
  constructor(private readonly counselsService: CounselsService) {}

  @Get()
  @ApiOperation({ summary: "내 문의 목록" })
  findAll(@CurrentUser() user: SupabaseUser, @Query() query: QueryCounselDto) {
    return this.counselsService.findAll(user.id, query);
  }

  @Get("admin")
  @Admin()
  @ApiOperation({ summary: "전체 문의 목록 (관리자)" })
  findAllAdmin(@Query() query: QueryCounselDto) {
    return this.counselsService.findAllAdmin(query);
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

  @Get(":counselId/answer")
  @ApiOperation({ summary: "문의 답변 조회" })
  getAnswer(
    @CurrentUser() user: SupabaseUser,
    @Param("counselId") counselId: string,
  ) {
    return this.counselsService.getAnswer(counselId, user.id);
  }

  @Post(":counselId/answer")
  @Admin()
  @ApiOperation({ summary: "문의 답변 등록 (관리자)" })
  addAnswer(
    @Param("counselId") counselId: string,
    @Body() dto: CreateAnswerDto,
  ) {
    return this.counselsService.addAnswer(counselId, dto);
  }

  @Patch(":counselId/answer")
  @Admin()
  @ApiOperation({ summary: "문의 답변 수정 (관리자)" })
  updateAnswer(
    @Param("counselId") counselId: string,
    @Body() dto: UpdateAnswerDto,
  ) {
    return this.counselsService.updateAnswer(counselId, dto);
  }

  @Delete(":counselId/answer")
  @Admin()
  @ApiOperation({ summary: "문의 답변 삭제 (관리자)" })
  removeAnswer(@Param("counselId") counselId: string) {
    return this.counselsService.removeAnswer(counselId);
  }
}

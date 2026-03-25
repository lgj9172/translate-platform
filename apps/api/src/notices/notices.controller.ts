import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { Admin } from "../common/decorators/admin.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Public } from "../common/decorators/public.decorator";
import { CreateNoticeDto, UpdateNoticeDto } from "./notices.dto";
import { NoticesService } from "./notices.service";

@ApiTags("Notices")
@Controller("notices")
export class NoticesController {
  constructor(private readonly noticesService: NoticesService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: "공지사항 목록" })
  findAll(@Query("start") start?: number, @Query("size") size?: number) {
    return this.noticesService.findAll({ start, size });
  }

  @Get(":noticeId")
  @Public()
  @ApiOperation({ summary: "공지사항 상세" })
  findOne(@Param("noticeId") noticeId: string) {
    return this.noticesService.findOne(noticeId);
  }

  @Post()
  @Admin()
  @ApiOperation({ summary: "공지사항 등록 (관리자)" })
  create(@CurrentUser() user: SupabaseUser, @Body() dto: CreateNoticeDto) {
    return this.noticesService.create(user.id, dto);
  }

  @Patch(":noticeId")
  @Admin()
  @ApiOperation({ summary: "공지사항 수정 (관리자)" })
  update(
    @CurrentUser() user: SupabaseUser,
    @Param("noticeId") noticeId: string,
    @Body() dto: UpdateNoticeDto,
  ) {
    return this.noticesService.update(noticeId, user.id, dto);
  }

  @Delete(":noticeId")
  @Admin()
  @ApiOperation({ summary: "공지사항 삭제 (관리자)" })
  remove(@Param("noticeId") noticeId: string) {
    return this.noticesService.remove(noticeId);
  }
}

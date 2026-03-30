import { Body, Controller, Delete, Get, Param, Patch } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import type { UpdateAgreementDto, UpdateUserDto } from "./users.dto";
import type { UsersService } from "./users.service";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  @ApiOperation({ summary: "내 정보 조회" })
  findMe(@CurrentUser() user: SupabaseUser) {
    return this.usersService.findMe(user.id);
  }

  @Patch("me")
  @ApiOperation({ summary: "내 정보 수정" })
  updateMe(@CurrentUser() user: SupabaseUser, @Body() dto: UpdateUserDto) {
    return this.usersService.updateMe(user.id, dto);
  }

  @Patch("me/agreement")
  @ApiOperation({ summary: "약관 동의 수정" })
  updateAgreement(
    @CurrentUser() user: SupabaseUser,
    @Body() dto: UpdateAgreementDto,
  ) {
    return this.usersService.updateAgreement(user.id, dto);
  }

  @Delete("me")
  @ApiOperation({ summary: "회원 탈퇴" })
  remove(@CurrentUser() user: SupabaseUser) {
    return this.usersService.remove(user.id);
  }

  @Get(":userId")
  @ApiOperation({ summary: "사용자 프로필 조회" })
  findOne(@Param("userId") userId: string) {
    return this.usersService.findOne(userId);
  }
}

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
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Public } from "../common/decorators/public.decorator";
import type {
  CreateBlogCommentDto,
  CreateBlogDto,
  UpdateBlogCommentDto,
  UpdateBlogDto,
} from "./blogs.dto";
import { BlogsService } from "./blogs.service";

@ApiTags("Blogs")
@Controller("blogs")
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: "블로그 목록" })
  findAll(@Query("start") start?: number, @Query("size") size?: number) {
    return this.blogsService.findAll({ start, size });
  }

  @Post()
  @ApiOperation({ summary: "블로그 작성" })
  create(@CurrentUser() user: SupabaseUser, @Body() dto: CreateBlogDto) {
    return this.blogsService.create(user.id, dto);
  }

  @Get(":blogId")
  @Public()
  @ApiOperation({ summary: "블로그 상세" })
  findOne(@Param("blogId") blogId: string) {
    return this.blogsService.findOne(blogId);
  }

  @Patch(":blogId")
  @ApiOperation({ summary: "블로그 수정" })
  update(
    @CurrentUser() user: SupabaseUser,
    @Param("blogId") blogId: string,
    @Body() dto: UpdateBlogDto,
  ) {
    return this.blogsService.update(blogId, user.id, dto);
  }

  @Delete(":blogId")
  @ApiOperation({ summary: "블로그 삭제" })
  remove(@CurrentUser() user: SupabaseUser, @Param("blogId") blogId: string) {
    return this.blogsService.remove(blogId, user.id);
  }

  @Get(":blogId/comments")
  @Public()
  @ApiOperation({ summary: "댓글 목록" })
  getComments(@Param("blogId") blogId: string) {
    return this.blogsService.findComments(blogId);
  }

  @Post(":blogId/comments")
  @ApiOperation({ summary: "댓글 작성" })
  addComment(
    @CurrentUser() user: SupabaseUser,
    @Param("blogId") blogId: string,
    @Body() dto: CreateBlogCommentDto,
  ) {
    return this.blogsService.addComment(blogId, user.id, dto);
  }

  @Patch(":blogId/comments/:commentId")
  @ApiOperation({ summary: "댓글 수정" })
  updateComment(
    @CurrentUser() user: SupabaseUser,
    @Param("commentId") commentId: string,
    @Body() dto: UpdateBlogCommentDto,
  ) {
    return this.blogsService.updateComment(commentId, user.id, dto);
  }

  @Delete(":blogId/comments/:commentId")
  @ApiOperation({ summary: "댓글 삭제" })
  removeComment(
    @CurrentUser() user: SupabaseUser,
    @Param("commentId") commentId: string,
  ) {
    return this.blogsService.removeComment(commentId, user.id);
  }
}

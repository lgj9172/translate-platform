import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ok, paginated } from "../common/response";
import type { PrismaService } from "../prisma/prisma.service";
import type {
  CreateBlogCommentDto,
  CreateBlogDto,
  UpdateBlogCommentDto,
  UpdateBlogDto,
} from "./blogs.dto";

@Injectable()
export class BlogsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: { start?: number; size?: number }) {
    const take = query.size ?? 20;
    const skip = query.start ?? 0;
    const where = { is_deleted: false };
    const [data, total_count] = await this.prisma.$transaction([
      this.prisma.blog.findMany({
        where,
        skip,
        take,
        include: {
          user: { select: { name: true, avatar: true } },
          _count: { select: { comments: { where: { is_deleted: false } } } },
        },
        orderBy: { created_at: "desc" },
      }),
      this.prisma.blog.count({ where }),
    ]);
    return paginated(data, total_count, data.length);
  }

  async create(userId: string, dto: CreateBlogDto) {
    const blog = await this.prisma.blog.create({
      data: { ...dto, user_id: userId },
    });
    return ok(blog);
  }

  async findOne(blogId: string) {
    const blog = await this.prisma.blog.findUnique({
      where: { blog_id: blogId },
      include: {
        user: { select: { name: true, avatar: true } },
        comments: {
          where: { is_deleted: false },
          include: { user: { select: { name: true, avatar: true } } },
          orderBy: { created_at: "asc" },
        },
      },
    });
    if (!blog) throw new NotFoundException("블로그를 찾을 수 없습니다.");
    return ok(blog);
  }

  async update(blogId: string, userId: string, dto: UpdateBlogDto) {
    const blog = await this.prisma.blog.findUnique({
      where: { blog_id: blogId },
    });
    if (!blog) throw new NotFoundException();
    if (blog.user_id !== userId) throw new ForbiddenException();
    const updated = await this.prisma.blog.update({
      where: { blog_id: blogId },
      data: dto,
    });
    return ok(updated);
  }

  async remove(blogId: string, userId: string) {
    const blog = await this.prisma.blog.findUnique({
      where: { blog_id: blogId },
    });
    if (!blog) throw new NotFoundException();
    if (blog.user_id !== userId) throw new ForbiddenException();
    await this.prisma.blog.update({
      where: { blog_id: blogId },
      data: { is_deleted: true },
    });
    return ok(null);
  }

  async findComments(blogId: string) {
    const blog = await this.prisma.blog.findUnique({
      where: { blog_id: blogId, is_deleted: false },
    });
    if (!blog) throw new NotFoundException("블로그를 찾을 수 없습니다.");

    const comments = await this.prisma.blogComment.findMany({
      where: { blog_id: blogId, is_deleted: false },
      include: { user: { select: { name: true, avatar: true } } },
      orderBy: { created_at: "asc" },
    });
    return ok(comments);
  }

  async addComment(blogId: string, userId: string, dto: CreateBlogCommentDto) {
    const comment = await this.prisma.blogComment.create({
      data: { content: dto.content, user_id: userId, blog_id: blogId },
    });
    return ok(comment);
  }

  async updateComment(
    commentId: string,
    userId: string,
    dto: UpdateBlogCommentDto,
  ) {
    const comment = await this.prisma.blogComment.findUnique({
      where: { comment_id: commentId },
    });
    if (!comment) throw new NotFoundException();
    if (comment.user_id !== userId) throw new ForbiddenException();
    const updated = await this.prisma.blogComment.update({
      where: { comment_id: commentId },
      data: { content: dto.content },
    });
    return ok(updated);
  }

  async removeComment(commentId: string, userId: string) {
    const comment = await this.prisma.blogComment.findUnique({
      where: { comment_id: commentId },
    });
    if (!comment) throw new NotFoundException();
    if (comment.user_id !== userId) throw new ForbiddenException();
    await this.prisma.blogComment.update({
      where: { comment_id: commentId },
      data: { is_deleted: true },
    });
    return ok(null);
  }
}

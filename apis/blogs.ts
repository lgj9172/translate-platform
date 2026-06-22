"use server";

import { requireUser } from "@/lib/auth";
import { forbidden, notFound } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import type { Blog, BlogComment, PaginationParams } from "@/types/entities";

export const getBlogs = async ({ params }: { params: PaginationParams }) => {
  const take = params.size ?? 20;
  const skip = params.start ?? 0;
  const data = await prisma.blog.findMany({
    where: { is_deleted: false },
    skip,
    take,
    include: {
      user: { select: { name: true, avatar: true } },
      _count: { select: { comments: { where: { is_deleted: false } } } },
    },
    orderBy: { created_at: "desc" },
  });
  return data as unknown as Blog[];
};

export const getBlog = async ({ blogId }: { blogId: string }) => {
  const blog = await prisma.blog.findUnique({
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
  if (!blog) throw notFound("블로그를 찾을 수 없습니다.");
  return blog as unknown as Blog;
};

export const postBlog = async ({
  payload,
}: {
  payload: { title: string; content: string };
}) => {
  const user = await requireUser();
  const blog = await prisma.blog.create({
    data: { ...payload, user_id: user.id },
  });
  return blog as unknown as Blog;
};

export const putBlog = async ({
  blogId,
  payload,
}: {
  blogId: string;
  payload: { title: string; content: string };
}) => {
  const user = await requireUser();
  const blog = await prisma.blog.findUnique({ where: { blog_id: blogId } });
  if (!blog) throw notFound();
  if (blog.user_id !== user.id) throw forbidden();
  const updated = await prisma.blog.update({
    where: { blog_id: blogId },
    data: payload,
  });
  return updated as unknown as Blog;
};

export const deleteBlog = async ({ blogId }: { blogId: string }) => {
  const user = await requireUser();
  const blog = await prisma.blog.findUnique({ where: { blog_id: blogId } });
  if (!blog) throw notFound();
  if (blog.user_id !== user.id) throw forbidden();
  await prisma.blog.update({
    where: { blog_id: blogId },
    data: { is_deleted: true },
  });
  return null;
};

export const getBlogComments = async ({
  blogId,
}: {
  blogId: string;
  params?: PaginationParams;
}) => {
  const blog = await prisma.blog.findUnique({
    where: { blog_id: blogId, is_deleted: false },
  });
  if (!blog) throw notFound("블로그를 찾을 수 없습니다.");
  const comments = await prisma.blogComment.findMany({
    where: { blog_id: blogId, is_deleted: false },
    include: { user: { select: { name: true, avatar: true } } },
    orderBy: { created_at: "asc" },
  });
  return comments as unknown as BlogComment[];
};

export const postBlogComment = async ({
  blogId,
  payload,
}: {
  blogId: string;
  payload: { content: string };
}) => {
  const user = await requireUser();
  const comment = await prisma.blogComment.create({
    data: { content: payload.content, user_id: user.id, blog_id: blogId },
  });
  return comment as unknown as BlogComment;
};

export const putBlogComment = async ({
  commentId,
  payload,
}: {
  blogId: string;
  commentId: string;
  payload: { content: string };
}) => {
  const user = await requireUser();
  const comment = await prisma.blogComment.findUnique({
    where: { comment_id: commentId },
  });
  if (!comment) throw notFound();
  if (comment.user_id !== user.id) throw forbidden();
  const updated = await prisma.blogComment.update({
    where: { comment_id: commentId },
    data: { content: payload.content },
  });
  return updated as unknown as BlogComment;
};

export const deleteBlogComment = async ({
  commentId,
}: {
  blogId: string;
  commentId: string;
}) => {
  const user = await requireUser();
  const comment = await prisma.blogComment.findUnique({
    where: { comment_id: commentId },
  });
  if (!comment) throw notFound();
  if (comment.user_id !== user.id) throw forbidden();
  await prisma.blogComment.update({
    where: { comment_id: commentId },
    data: { is_deleted: true },
  });
  return null;
};

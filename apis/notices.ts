"use server";

import { requireAdmin } from "@/lib/auth";
import { notFound } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import type { Notice, PaginationParams } from "@/types/entities";

export const getNotices = async ({ params }: { params: PaginationParams }) => {
  const take = params.size ?? 20;
  const skip = params.start ?? 0;
  const data = await prisma.notice.findMany({
    skip,
    take,
    orderBy: [{ is_important: "desc" }, { created_at: "desc" }],
  });
  return data as unknown as Notice[];
};

export const getNotice = async ({ noticeId }: { noticeId: string }) => {
  const notice = await prisma.notice.findUnique({
    where: { notice_id: noticeId },
  });
  if (!notice) throw notFound("공지사항을 찾을 수 없습니다.");
  return notice as unknown as Notice;
};

export const postNotice = async ({
  payload,
}: {
  payload: {
    title: string;
    description: string;
    isImportant: boolean;
  };
}) => {
  const user = await requireAdmin();
  const notice = await prisma.notice.create({
    data: {
      title: payload.title,
      description: payload.description,
      is_important: payload.isImportant,
      created_by: user.id,
      updated_by: user.id,
    },
  });
  return notice as unknown as Notice;
};

export const putNotice = async ({
  noticeId,
  payload,
}: {
  noticeId: string;
  payload: {
    title: string;
    description: string;
    isImportant: boolean;
  };
}) => {
  const user = await requireAdmin();
  const notice = await prisma.notice.update({
    where: { notice_id: noticeId },
    data: {
      title: payload.title,
      description: payload.description,
      is_important: payload.isImportant,
      updated_by: user.id,
    },
  });
  return notice as unknown as Notice;
};

export const deleteNotice = async ({ noticeId }: { noticeId: string }) => {
  await requireAdmin();
  await prisma.notice.delete({ where: { notice_id: noticeId } });
  return null;
};

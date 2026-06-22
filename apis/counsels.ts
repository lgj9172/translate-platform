"use server";

import { requireAdmin, requireUser } from "@/lib/auth";
import { forbidden, notFound } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { enrichFileInfo } from "@/lib/storage";
import type {
  Counsel,
  CounselAnswer,
  CounselCategory,
  PaginationParams,
} from "@/types/entities";

export const getCounsels = async ({ params }: { params: PaginationParams }) => {
  const user = await requireUser();
  const take = params.size ?? 20;
  const skip = params.start ?? 0;
  const data = await prisma.counsel.findMany({
    where: { user_id: user.id, is_deleted: false },
    include: { answers: true },
    skip,
    take,
    orderBy: { created_at: "desc" },
  });
  return data as unknown as Counsel[];
};

export const getCounsel = async ({ counselId }: { counselId: string }) => {
  const user = await requireUser();
  const counsel = await prisma.counsel.findUnique({
    where: { counsel_id: counselId },
  });
  if (!counsel) throw notFound("문의를 찾을 수 없습니다.");
  if (counsel.user_id !== user.id) throw forbidden();

  const fileInfo = counsel.file_id
    ? await enrichFileInfo(counsel.file_id)
    : null;

  return { ...counsel, file: fileInfo } as unknown as Counsel;
};

export const postCounsel = async ({
  payload,
}: {
  payload: {
    content: string;
    category: CounselCategory;
    file_id?: string;
  };
}) => {
  const user = await requireUser();
  const counsel = await prisma.counsel.create({
    data: {
      content: payload.content,
      category: payload.category as never,
      file_id: payload.file_id,
      user_id: user.id,
    },
  });
  return counsel as unknown as Counsel;
};

export const getCounselAnswer = async ({
  counselId,
}: {
  counselId: string;
}) => {
  const user = await requireUser();
  const counsel = await prisma.counsel.findUnique({
    where: { counsel_id: counselId },
    include: { answers: { orderBy: { answered_at: "desc" }, take: 1 } },
  });
  if (!counsel) throw notFound("문의를 찾을 수 없습니다.");
  if (counsel.user_id !== user.id) throw forbidden();
  return (counsel.answers[0] ?? null) as unknown as CounselAnswer;
};

export const postCounselAnswer = async ({
  counselId,
  payload,
}: {
  counselId: string;
  payload: { content: string };
}) => {
  await requireAdmin();
  const answer = await prisma.counselAnswer.create({
    data: { content: payload.content, counsel_id: counselId },
  });
  await prisma.counsel.update({
    where: { counsel_id: counselId },
    data: { is_done: true },
  });
  return answer as unknown as CounselAnswer;
};

export const putCounselAnswer = async ({
  counselId,
  payload,
}: {
  counselId: string;
  payload: { content: string };
}) => {
  await requireAdmin();
  const answer = await prisma.counselAnswer.findFirst({
    where: { counsel_id: counselId },
    orderBy: { answered_at: "desc" },
  });
  if (!answer) throw notFound("답변을 찾을 수 없습니다.");
  const updated = await prisma.counselAnswer.update({
    where: { answer_id: answer.answer_id },
    data: { content: payload.content },
  });
  return updated as unknown as CounselAnswer;
};

export const deleteCounselAnswer = async ({
  counselId,
}: {
  counselId: string;
}) => {
  await requireAdmin();
  const answer = await prisma.counselAnswer.findFirst({
    where: { counsel_id: counselId },
    orderBy: { answered_at: "desc" },
  });
  if (!answer) throw notFound("답변을 찾을 수 없습니다.");
  await prisma.counselAnswer.delete({
    where: { answer_id: answer.answer_id },
  });
  await prisma.counsel.update({
    where: { counsel_id: counselId },
    data: { is_done: false },
  });
  return null;
};

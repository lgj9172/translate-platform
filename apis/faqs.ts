"use server";

import { requireAdmin } from "@/lib/auth";
import { notFound } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import type { Faq, PaginationParams } from "@/types/entities";

export const getFaqs = async ({ params }: { params: PaginationParams }) => {
  const take = params.size ?? 20;
  const skip = params.start ?? 0;
  const data = await prisma.faq.findMany({
    skip,
    take,
    orderBy: { created_at: "desc" },
  });
  return data as unknown as Faq[];
};

export const getFaq = async ({ faqId }: { faqId: string }) => {
  const faq = await prisma.faq.findUnique({ where: { faq_id: faqId } });
  if (!faq) throw notFound("FAQ를 찾을 수 없습니다.");
  return faq as unknown as Faq;
};

export const postFaq = async ({
  payload,
}: {
  payload: {
    title: string;
    description: string;
  };
}) => {
  const user = await requireAdmin();
  const faq = await prisma.faq.create({
    data: { ...payload, created_by: user.id, updated_by: user.id },
  });
  return faq as unknown as Faq;
};

export const putFaq = async ({
  faqId,
  payload,
}: {
  faqId: string;
  payload: {
    title: string;
    description: string;
  };
}) => {
  const user = await requireAdmin();
  const faq = await prisma.faq.update({
    where: { faq_id: faqId },
    data: { ...payload, updated_by: user.id },
  });
  return faq as unknown as Faq;
};

export const deleteFaq = async ({ faqId }: { faqId: string }) => {
  await requireAdmin();
  await prisma.faq.delete({ where: { faq_id: faqId } });
  return null;
};

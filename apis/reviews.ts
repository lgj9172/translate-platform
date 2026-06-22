"use server";

import { requireUser } from "@/lib/auth";
import {
  conflictError,
  forbidden,
  notFound,
  unprocessable,
} from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import type { Review } from "@/types/entities";

export const getReviews = async ({
  translatorId,
}: {
  translatorId: string;
}) => {
  const data = await prisma.review.findMany({
    where: { translator_id: translatorId },
    orderBy: { created_at: "desc" },
  });
  return data as unknown as Review[];
};

export const postReview = async ({
  payload,
}: {
  payload: {
    translation_id: string;
    ratings: {
      translation_quality: number;
      communication: number;
      deadline_compliance: number;
    };
    comment?: string;
  };
}) => {
  const user = await requireUser();

  const translation = await prisma.translation.findUnique({
    where: { translation_id: payload.translation_id },
  });
  if (!translation) throw notFound("번역을 찾을 수 없습니다.");
  if (translation.user_id !== user.id)
    throw forbidden("본인의 번역에만 리뷰를 작성할 수 있습니다.");
  if (translation.status !== "TRANSLATION_RESOLVED")
    throw unprocessable("완료된 번역에만 리뷰를 작성할 수 있습니다.");

  const selectedQuotation = await prisma.quotation.findFirst({
    where: { translation_id: payload.translation_id, is_selected: true },
  });
  if (!selectedQuotation) throw unprocessable("선택된 번역사가 없습니다.");

  const existing = await prisma.review.findFirst({
    where: { translation_id: payload.translation_id },
  });
  if (existing) throw conflictError("이미 리뷰를 작성하셨습니다.");

  const review = await prisma.review.create({
    data: {
      user_id: user.id,
      translator_id: selectedQuotation.translator_id,
      translation_id: payload.translation_id,
      ratings: payload.ratings,
      comment: payload.comment,
    },
  });
  return review as unknown as Review;
};

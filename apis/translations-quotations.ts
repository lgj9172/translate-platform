"use server";

import { requireUser } from "@/lib/auth";
import {
  badRequest,
  conflictError,
  forbidden,
  notFound,
  unprocessable,
} from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import type { PaginationParams, Quotation } from "@/types/entities";

export const getTranslationQuotations = async ({
  translationId,
}: {
  translationId: string;
  params?: PaginationParams;
}) => {
  await requireUser();
  const data = await prisma.quotation.findMany({
    where: {
      translation_id: translationId,
      is_deleted: false,
      is_canceled: false,
    },
    orderBy: { created_at: "desc" },
  });
  return data as unknown as Quotation[];
};

export const getTranslatorQuotation = async ({
  translationId,
}: {
  translationId: string;
}) => {
  const user = await requireUser();
  const translator = await prisma.translator.findUnique({
    where: { user_id: user.id },
  });
  if (!translator) return null as unknown as Quotation;

  const quotation = await prisma.quotation.findFirst({
    where: {
      translation_id: translationId,
      translator_id: translator.translator_id,
      is_deleted: false,
      is_canceled: false,
    },
  });
  return (quotation ?? null) as unknown as Quotation;
};

export const postTranslationQuotation = async ({
  translationId,
  payload,
}: {
  translationId: string;
  payload: {
    fee: { unit: "KRW" | "USD"; value: number };
    detail?: string;
  };
}) => {
  const user = await requireUser();

  const translation = await prisma.translation.findUnique({
    where: { translation_id: translationId },
  });
  if (!translation) throw notFound("번역을 찾을 수 없습니다.");
  if (translation.status !== "QUOTE_SENT")
    throw badRequest("견적 모집 중인 번역에만 견적을 제출할 수 있습니다.");

  const translator = await prisma.translator.findUnique({
    where: { user_id: user.id },
  });
  if (!translator) throw unprocessable("번역사 프로필이 없습니다.");

  const existing = await prisma.quotation.findFirst({
    where: {
      translation_id: translationId,
      translator_id: translator.translator_id,
      is_canceled: false,
    },
  });
  if (existing) throw conflictError("이미 이 번역에 견적을 제출하셨습니다.");

  const quotation = await prisma.quotation.create({
    data: {
      translation_id: translationId,
      translator_id: translator.translator_id,
      fee: payload.fee,
      detail: payload.detail,
    },
  });
  return quotation as unknown as Quotation;
};

export const postTranslationQuotationCancel = async ({
  quotationId,
}: {
  translationId: string;
  quotationId: string;
}) => {
  const user = await requireUser();
  const translator = await prisma.translator.findUnique({
    where: { user_id: user.id },
  });
  if (!translator) throw forbidden();

  const quotation = await prisma.quotation.findUnique({
    where: { quotation_id: quotationId },
    include: { translation: true },
  });
  if (!quotation) throw notFound();
  if (quotation.translator_id !== translator.translator_id) throw forbidden();
  if (quotation.is_canceled) throw badRequest("이미 취소된 견적입니다.");

  if (quotation.is_selected) {
    await prisma.$transaction([
      prisma.quotation.update({
        where: { quotation_id: quotationId },
        data: { is_canceled: true, is_selected: false },
      }),
      prisma.translation.update({
        where: { translation_id: quotation.translation_id },
        data: { status: "QUOTE_SENT" },
      }),
    ]);
  } else {
    await prisma.quotation.update({
      where: { quotation_id: quotationId },
      data: { is_canceled: true },
    });
  }
  return null;
};

export const postTranslationQuotationSelect = async ({
  quotationId,
}: {
  translationId: string;
  quotationId: string;
}) => {
  const user = await requireUser();
  const quotation = await prisma.quotation.findUnique({
    where: { quotation_id: quotationId },
    include: { translation: true },
  });
  if (!quotation) throw notFound();
  if (quotation.translation.user_id !== user.id) throw forbidden();

  await prisma.$transaction([
    prisma.quotation.update({
      where: { quotation_id: quotationId },
      data: { is_selected: true },
    }),
    prisma.translation.update({
      where: { translation_id: quotation.translation_id },
      data: { status: "TRANSLATOR_SELECTED" },
    }),
  ]);
  return null;
};

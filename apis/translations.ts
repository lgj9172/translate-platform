"use server";

import { getOptionalUser, requireUser } from "@/lib/auth";
import { badRequest, forbidden, notFound } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { enrichFileInfo } from "@/lib/storage";
import type {
  PaginationParams,
  Translation,
  TranslationCategory,
  TranslationComment,
  TranslationCurrency,
  TranslationLanguage,
} from "@/types/entities";

export const getTranslations = async ({
  params,
}: {
  params: PaginationParams & { status?: string };
}) => {
  const take = params.size ?? 20;
  const skip = params.start ?? 0;
  // status 미지정 시 기본값: QUOTE_SENT (견적 모집 중인 것만 마켓플레이스에 노출)
  const where = {
    is_deleted: false,
    is_canceled: false,
    status: (params.status ?? "QUOTE_SENT") as never,
  };
  const data = await prisma.translation.findMany({
    where,
    skip,
    take,
    orderBy: { created_at: "desc" },
  });
  return data as unknown as Translation[];
};

export const getTranslationsClient = async ({
  params,
}: {
  params: PaginationParams & { status?: string };
}) => {
  const user = await requireUser();
  const take = params.size ?? 20;
  const skip = params.start ?? 0;
  const where = {
    user_id: user.id,
    is_deleted: false,
    ...(params.status ? { status: params.status as never } : {}),
  };
  const data = await prisma.translation.findMany({
    where,
    skip,
    take,
    orderBy: { created_at: "desc" },
  });
  return data as unknown as Translation[];
};

export const getTranslationsTranslator = async ({
  params,
}: {
  params: PaginationParams & { status?: string };
}) => {
  const user = await requireUser();
  const take = params.size ?? 20;
  const skip = params.start ?? 0;

  const translator = await prisma.translator.findUnique({
    where: { user_id: user.id },
  });
  if (!translator) return [] as unknown as Translation[];

  const where = {
    is_deleted: false,
    quotations: {
      some: {
        translator_id: translator.translator_id,
        is_selected: true,
        is_deleted: false,
      },
    },
    ...(params.status ? { status: params.status as never } : {}),
  };
  const data = await prisma.translation.findMany({
    where,
    skip,
    take,
    orderBy: { created_at: "desc" },
  });
  return data as unknown as Translation[];
};

export const getTranslation = async ({
  translationId,
}: {
  translationId: string;
}) => {
  const authUser = await getOptionalUser();
  const userId = authUser?.id;

  const translation = await prisma.translation.findUnique({
    where: { translation_id: translationId },
    include: { quotations: { where: { is_deleted: false } } },
  });
  if (!translation) throw notFound("번역을 찾을 수 없습니다.");

  const isOwner = !!userId && translation.user_id === userId;
  let canSeeFiles = isOwner;

  if (!isOwner && userId) {
    const translator = await prisma.translator.findUnique({
      where: { user_id: userId },
    });
    if (translator) {
      const selected = await prisma.quotation.findFirst({
        where: {
          translation_id: translationId,
          translator_id: translator.translator_id,
          is_selected: true,
        },
      });
      canSeeFiles = !!selected;
    }
  }

  const sourceFiles = (translation.source_files ?? []) as Array<{
    file_id?: string;
  }>;
  const enrichedSourceFiles = await Promise.all(
    sourceFiles.map(async (sf) => {
      if (!sf.file_id) return sf;
      if (!canSeeFiles) return { ...sf, presigned_url: null };
      const info = await enrichFileInfo(sf.file_id);
      return info ? { ...sf, ...info } : sf;
    }),
  );

  const targetFileIds = (translation.target_files ?? []) as string[];
  const enrichedTargetFiles = await Promise.all(
    targetFileIds.map(async (fileId) => {
      const info = await enrichFileInfo(fileId);
      return {
        file_id: fileId,
        ...(info ?? { name: undefined, presigned_url: null }),
      };
    }),
  );

  return {
    ...translation,
    source_files: enrichedSourceFiles,
    target_files: enrichedTargetFiles,
  } as unknown as Translation;
};

export const postTranslation = async ({
  payload,
}: {
  payload: {
    title: string;
    source_language: TranslationLanguage;
    target_language: TranslationLanguage;
    categories: TranslationCategory[];
    description: string;
    source_files: { file_id: string }[];
    deadline: string;
    fee: { unit: TranslationCurrency; value: number };
    sample: string;
  };
}) => {
  const user = await requireUser();
  const translation = await prisma.translation.create({
    data: {
      title: payload.title,
      source_language: payload.source_language,
      target_language: payload.target_language,
      categories: payload.categories,
      description: payload.description ?? "",
      source_files: payload.source_files as object[],
      target_files: [],
      deadline: new Date(payload.deadline),
      fee: payload.fee,
      sample: payload.sample ?? "",
      user_id: user.id,
    },
  });
  return translation as unknown as Translation;
};

export const getTranslationComments = async ({
  translationId,
}: {
  translationId: string;
}) => {
  const comments = await prisma.translationComment.findMany({
    where: { translation_id: translationId },
    orderBy: { created_at: "asc" },
  });
  return comments as unknown as TranslationComment[];
};

export const postTranslationComment = async ({
  translationId,
  payload,
}: {
  translationId: string;
  payload: { content: string };
}) => {
  const user = await requireUser();
  const comment = await prisma.translationComment.create({
    data: {
      content: payload.content,
      user_id: user.id,
      translation_id: translationId,
    },
  });
  return comment as unknown as TranslationComment;
};

async function getSelectedTranslator(translationId: string, userId: string) {
  const translator = await prisma.translator.findUnique({
    where: { user_id: userId },
  });
  if (!translator) throw forbidden("번역사 프로필이 없습니다.");
  const selected = await prisma.quotation.findFirst({
    where: {
      translation_id: translationId,
      translator_id: translator.translator_id,
      is_selected: true,
    },
  });
  if (!selected) throw forbidden("이 번역의 선택된 번역사가 아닙니다.");
  return translator;
}

export const postTranslationCancel = async ({
  translationId,
}: {
  translationId: string;
}) => {
  const user = await requireUser();
  const translation = await prisma.translation.findUnique({
    where: { translation_id: translationId },
  });
  if (!translation) throw notFound();
  if (translation.user_id !== user.id) throw forbidden();
  await prisma.translation.update({
    where: { translation_id: translationId },
    data: { is_canceled: true },
  });
  return null;
};

export const postTranslationStart = async ({
  translationId,
}: {
  translationId: string;
}) => {
  const user = await requireUser();
  const translation = await prisma.translation.findUnique({
    where: { translation_id: translationId },
  });
  if (!translation) throw notFound();
  if (translation.status !== "TRANSLATOR_SELECTED")
    throw badRequest("번역을 시작할 수 없는 상태입니다.");
  await getSelectedTranslator(translationId, user.id);
  await prisma.translation.update({
    where: { translation_id: translationId },
    data: { status: "TRANSLATION_BEGAN" },
  });
  return null;
};

export const postTranslationSubmit = async ({
  translationId,
  payload,
}: {
  translationId: string;
  payload: { target_files: string[] };
}) => {
  const user = await requireUser();
  const translation = await prisma.translation.findUnique({
    where: { translation_id: translationId },
  });
  if (!translation) throw notFound();
  if (
    !["TRANSLATION_BEGAN", "TRANSLATION_EDIT_REQUESTED"].includes(
      translation.status as string,
    )
  )
    throw badRequest("번역을 제출할 수 없는 상태입니다.");
  await getSelectedTranslator(translationId, user.id);
  await prisma.translation.update({
    where: { translation_id: translationId },
    data: {
      status: "TRANSLATION_SUBMITTED",
      target_files: payload.target_files,
    },
  });
  return null;
};

export const postTranslationConfirm = async ({
  translationId,
}: {
  translationId: string;
}) => {
  const user = await requireUser();
  const translation = await prisma.translation.findUnique({
    where: { translation_id: translationId },
  });
  if (!translation) throw notFound();
  if (translation.user_id !== user.id) throw forbidden();
  if (translation.status !== "TRANSLATION_SUBMITTED")
    throw badRequest("번역을 확정할 수 없는 상태입니다.");
  await prisma.translation.update({
    where: { translation_id: translationId },
    data: { status: "TRANSLATION_RESOLVED", resolved_at: new Date() },
  });
  return null;
};

export const postTranslationRequestRevision = async ({
  translationId,
}: {
  translationId: string;
}) => {
  const user = await requireUser();
  const translation = await prisma.translation.findUnique({
    where: { translation_id: translationId },
  });
  if (!translation) throw notFound();
  if (translation.user_id !== user.id) throw forbidden();
  if (translation.status !== "TRANSLATION_SUBMITTED")
    throw badRequest("수정 요청할 수 없는 상태입니다.");
  if (translation.remaining_revisions <= 0)
    throw badRequest("수정 요청 횟수를 모두 사용했습니다.");
  await prisma.translation.update({
    where: { translation_id: translationId },
    data: {
      status: "TRANSLATION_EDIT_REQUESTED",
      remaining_revisions: { decrement: 1 },
    },
  });
  return null;
};

export const postTranslationResume = async ({
  translationId,
}: {
  translationId: string;
}) => {
  const user = await requireUser();
  const translation = await prisma.translation.findUnique({
    where: { translation_id: translationId },
  });
  if (!translation) throw notFound();
  if (
    !["TRANSLATION_EDIT_REQUESTED", "TRANSLATION_SUBMITTED"].includes(
      translation.status as string,
    )
  )
    throw badRequest("재시작할 수 없는 상태입니다.");
  await getSelectedTranslator(translationId, user.id);
  await prisma.translation.update({
    where: { translation_id: translationId },
    data: { status: "TRANSLATION_BEGAN" },
  });
  return null;
};

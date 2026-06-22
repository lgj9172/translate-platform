"use server";

import { requireUser } from "@/lib/auth";
import { forbidden, notFound } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import type {
  PaginationParams,
  Quotation,
  TranslationCategory,
  TranslationLanguage,
  Translator,
  TranslatorDegree,
  TranslatorGraduationStatus,
} from "@/types/entities";

type EducationInput = {
  name: string;
  major: string;
  degree: TranslatorDegree;
  graduation_status: TranslatorGraduationStatus;
  started_at: string;
  ended_at: string;
  file_id: string;
};

type CareerInput = {
  name: string;
  position: string;
  achievement?: string;
  is_employed?: boolean;
  started_at: string;
  ended_at?: string;
  file_id: string;
};

type CertificationInput = {
  name: string;
  organization: string;
  started_at: string;
  file_id: string;
};

type SampleInput = {
  source_language: TranslationLanguage;
  target_language: TranslationLanguage;
  source_text: string;
  target_text: string;
};

export const getTranslator = async ({
  translatorId,
}: {
  translatorId: string;
}) => {
  const translator = await prisma.translator.findUnique({
    where: { translator_id: translatorId, is_deleted: false },
    include: {
      user: {
        select: { name: true, avatar: true, nickname: true, email: true },
      },
      educations: { where: { is_deleted: false } },
      careers: { where: { is_deleted: false } },
      certifications: { where: { is_deleted: false } },
      translation_samples: { where: { is_deleted: false } },
    },
  });
  if (!translator) throw notFound("번역사를 찾을 수 없습니다.");
  return translator as unknown as Translator;
};

export const getMyTranslator = async () => {
  const user = await requireUser();
  const translator = await prisma.translator.findUnique({
    where: { user_id: user.id },
    include: {
      educations: { where: { is_deleted: false } },
      careers: { where: { is_deleted: false } },
      certifications: { where: { is_deleted: false } },
      translation_samples: { where: { is_deleted: false } },
    },
  });
  if (!translator) throw notFound("번역사 프로필이 없습니다.");
  return translator as unknown as Translator;
};

export const postTranslator = async ({
  payload,
}: {
  payload: {
    categories: TranslationCategory[];
    introduction: string;
    educations: EducationInput[];
    careers: CareerInput[];
    certifications?: CertificationInput[];
    translation_samples?: SampleInput[];
  };
}) => {
  const user = await requireUser();
  const translator = await prisma.$transaction(async (tx) => {
    const created = await tx.translator.create({
      data: {
        user_id: user.id,
        categories: payload.categories ?? [],
        introduction: payload.introduction ?? "",
      },
    });

    if (payload.educations?.length) {
      await tx.translatorEducation.createMany({
        data: payload.educations.map((e) => ({
          translator_id: created.translator_id,
          name: e.name,
          major: e.major,
          degree: e.degree as never,
          graduation_status: e.graduation_status as never,
          started_at: new Date(e.started_at),
          ended_at: new Date(e.ended_at),
          file_id: e.file_id,
        })),
      });
    }

    if (payload.careers?.length) {
      await tx.translatorCareer.createMany({
        data: payload.careers.map((c) => ({
          translator_id: created.translator_id,
          name: c.name,
          position: c.position,
          achievement: c.achievement,
          is_employed: c.is_employed ?? false,
          started_at: new Date(c.started_at),
          ended_at: c.ended_at ? new Date(c.ended_at) : null,
          file_id: c.file_id,
        })),
      });
    }

    if (payload.certifications?.length) {
      await tx.translatorCertification.createMany({
        data: payload.certifications.map((c) => ({
          translator_id: created.translator_id,
          name: c.name,
          organization: c.organization,
          started_at: new Date(c.started_at),
          file_id: c.file_id,
        })),
      });
    }

    if (payload.translation_samples?.length) {
      await tx.translationSample.createMany({
        data: payload.translation_samples.map((s) => ({
          translator_id: created.translator_id,
          source_language: s.source_language,
          target_language: s.target_language,
          source_text: s.source_text,
          target_text: s.target_text,
        })),
      });
    }

    return created;
  });
  return translator as unknown as Translator;
};

export const putTranslator = async ({
  translatorId,
  payload,
}: {
  translatorId: string;
  payload: {
    categories?: TranslationCategory[];
    introduction?: string;
    educations?: EducationInput[];
    careers?: CareerInput[];
    certifications?: CertificationInput[];
    translation_samples?: SampleInput[];
  };
}) => {
  const user = await requireUser();
  const translator = await prisma.translator.findUnique({
    where: { translator_id: translatorId },
  });
  if (!translator) throw notFound();
  if (translator.user_id !== user.id) throw forbidden();

  const updated = await prisma.$transaction(async (tx) => {
    const result = await tx.translator.update({
      where: { translator_id: translatorId },
      data: {
        ...(payload.categories !== undefined
          ? { categories: payload.categories }
          : {}),
        ...(payload.introduction !== undefined
          ? { introduction: payload.introduction }
          : {}),
      },
    });

    if (payload.educations !== undefined) {
      await tx.translatorEducation.updateMany({
        where: { translator_id: translatorId },
        data: { is_deleted: true },
      });
      if (payload.educations.length > 0) {
        await tx.translatorEducation.createMany({
          data: payload.educations.map((e) => ({
            translator_id: translatorId,
            name: e.name,
            major: e.major,
            degree: e.degree as never,
            graduation_status: e.graduation_status as never,
            started_at: new Date(e.started_at),
            ended_at: new Date(e.ended_at),
            file_id: e.file_id,
          })),
        });
      }
    }

    if (payload.careers !== undefined) {
      await tx.translatorCareer.updateMany({
        where: { translator_id: translatorId },
        data: { is_deleted: true },
      });
      if (payload.careers.length > 0) {
        await tx.translatorCareer.createMany({
          data: payload.careers.map((c) => ({
            translator_id: translatorId,
            name: c.name,
            position: c.position,
            achievement: c.achievement,
            is_employed: c.is_employed ?? false,
            started_at: new Date(c.started_at),
            ended_at: c.ended_at ? new Date(c.ended_at) : null,
            file_id: c.file_id,
          })),
        });
      }
    }

    if (payload.certifications !== undefined) {
      await tx.translatorCertification.updateMany({
        where: { translator_id: translatorId },
        data: { is_deleted: true },
      });
      if (payload.certifications.length > 0) {
        await tx.translatorCertification.createMany({
          data: payload.certifications.map((c) => ({
            translator_id: translatorId,
            name: c.name,
            organization: c.organization,
            started_at: new Date(c.started_at),
            file_id: c.file_id,
          })),
        });
      }
    }

    if (payload.translation_samples !== undefined) {
      await tx.translationSample.updateMany({
        where: { translator_id: translatorId },
        data: { is_deleted: true },
      });
      if (payload.translation_samples.length > 0) {
        await tx.translationSample.createMany({
          data: payload.translation_samples.map((s) => ({
            translator_id: translatorId,
            source_language: s.source_language,
            target_language: s.target_language,
            source_text: s.source_text,
            target_text: s.target_text,
          })),
        });
      }
    }

    return result;
  });

  return updated as unknown as Translator;
};

export const postTranslatorPublish = async ({
  translatorId,
}: {
  translatorId: string;
}) => {
  const user = await requireUser();
  const translator = await prisma.translator.findUnique({
    where: { translator_id: translatorId },
  });
  if (!translator) throw notFound();
  if (translator.user_id !== user.id) throw forbidden();

  const updated = await prisma.translator.update({
    where: { translator_id: translatorId },
    data: { is_draft: false },
  });
  return updated as unknown as Translator;
};

export const getTranslatorQuotations = async ({
  params,
}: {
  params: PaginationParams;
}) => {
  const user = await requireUser();
  const translator = await prisma.translator.findUnique({
    where: { user_id: user.id },
  });
  if (!translator) return [] as unknown as Quotation[];

  const take = params.size ?? 20;
  const skip = params.start ?? 0;
  const data = await prisma.quotation.findMany({
    where: { translator_id: translator.translator_id, is_deleted: false },
    skip,
    take,
    orderBy: { created_at: "desc" },
  });
  return data as unknown as Quotation[];
};

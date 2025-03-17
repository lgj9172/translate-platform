import {
  TranslationCategory,
  TranslationLanguage,
  Translator,
  TranslatorDegree,
  TranslatorGraduationStatus,
} from "@/types/entities";
import { ClientWithAuth, Response } from "./clients";

export const getTranslator = async ({
  translatorId,
}: {
  translatorId: string;
}) => {
  const response = await ClientWithAuth.get<Response<Translator>>(
    `/translators/${translatorId}`,
  );
  return response.data.data;
};

export const getMyTranslator = async () => {
  const response =
    await ClientWithAuth.get<Response<Translator>>(`/translators/me`);
  return response.data.data;
};

export const postTranslator = async ({
  payload,
}: {
  payload: {
    categories: TranslationCategory[];
    introduction: string;
    educations: {
      name: string;
      major: string;
      degree: TranslatorDegree;
      graduation_status: TranslatorGraduationStatus;
      started_at: string;
      ended_at: string;
      file_id: string;
    }[];
    careers: {
      name: string;
      position: string;
      achievement?: string;
      is_employed?: boolean;
      started_at: string;
      ended_at?: string;
      file_id: string;
    }[];
    certifications?: {
      name: string;
      organization: string;
      started_at: string;
      file_id: string;
    }[];
    translation_samples: {
      source_language: TranslationLanguage;
      target_language: TranslationLanguage;
      source_text: string;
      target_text: string;
    }[];
  };
}) => {
  const response = await ClientWithAuth.post<Response<Translator>>(
    "/translators",
    payload,
  );
  return response.data.data;
};

export const putTranslator = async ({
  translatorId,
  payload,
}: {
  translatorId: string;
  payload: {
    categories?: TranslationCategory[];
    introduction?: string;
    educations?: {
      name: string;
      major: string;
      degree: TranslatorDegree;
      graduation_status: TranslatorGraduationStatus;
      started_at: string;
      ended_at: string;
      file_id: string;
    }[];
    careers?: {
      name: string;
      position: string;
      achievement?: string;
      is_employed?: boolean;
      started_at: string;
      ended_at?: string;
      file_id: string;
    }[];
    certifications?: {
      name: string;
      organization: string;
      started_at: string;
      file_id: string;
    }[];
    samples?: {
      source_language: TranslationLanguage;
      target_language: TranslationLanguage;
      source_text: string;
      target_text: string;
    }[];
  };
}) => {
  const response = await ClientWithAuth.put<Response<Translator>>(
    `/translators/${translatorId}`,
    payload,
  );
  return response.data.data;
};

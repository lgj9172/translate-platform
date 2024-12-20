import { ClientWithAuth, Response } from "./clients";
import { FileId, FileInfo } from "./files";
import { Translator } from "./translator";
import { User } from "./user";

export const Category = [
  "IT",
  "FINANCE",
  "CONTENTS",
  "GAME",
  "LAW",
  "MEDICAL",
  "CONSTRUCTION",
  "MARKETING",
  "LITERATURE",
  "ETC",
] as const;

export const Language = [
  "ko-KR",
  "en-US",
  "ja-JP",
  "zh-CN",
  "ar-SA",
  "ru-RU",
  "es-ES",
  "fr-FR",
  "de-DE",
] as const;

export const MoneyUnit = ["KRW", "USD"] as const;

export const QuantityUnit = ["CHAR", "WORD"] as const;

export interface SourceFileInfo {
  source_file_id: string;
  char_with_blank: number;
  char_without_blank: number;
  word: number;
  file: FileInfo;
}

export const TranslationStatus = [
  "QUOTE_SENT",
  "TRANSLATOR_SELECTED",
  "TRANSLATION_BEGAN",
  "TRANSLATION_SUBMITTED",
  "TRANSLATION_EDIT_REQUESTED",
  "TRANSLATION_RESOLVED",
] as const;

export interface Translation {
  translation_id: string;
  title: string;
  source_language: (typeof Language)[number];
  target_language: (typeof Language)[number];
  categories: (typeof Category)[number][];
  description: string;
  source_files: SourceFileInfo[];
  target_files: FileInfo[];
  deadline: string;
  fee_unit: string;
  fee_value: number;
  sample: string;
  status: (typeof TranslationStatus)[number];
  is_canceled: boolean;
  user: User;
  translator: Translator;
}
export const getTranslations = async () => {
  const response =
    await ClientWithAuth.get<Response<Translation[]>>(`/translations`);
  return response.data.data;
};

export const getTranslation = async ({
  translationId,
}: {
  translationId: string;
}) => {
  const response = await ClientWithAuth.get<Response<Translation>>(
    `/translations/${translationId}`,
  );
  return response.data.data;
};

interface PostTranslationRequest {
  title: string;
  source_language: (typeof Language)[number];
  target_language: (typeof Language)[number];
  categories: (typeof Category)[number][];
  description: string;
  source_files: FileId[];
  deadline: string;
  fee_unit: (typeof MoneyUnit)[number];
  fee_value: number;
  sample: string;
}

export const postTranslation = async (payload: PostTranslationRequest) => {
  const response = await ClientWithAuth.post<Response<Translation>>(
    "/translations",
    payload,
  );
  return response.data.data;
};

export interface PostTranslationCancelRequest {
  translationId: string;
}

export const postTranslationCancel = async ({
  translationId,
}: PostTranslationCancelRequest) => {
  const response = await ClientWithAuth.post<Response<Translation>>(
    `/translations/${translationId}/cancel`,
  );
  return response.data.data;
};

export interface PostTranslationStartRequest {
  translationId: string;
}

export const postTranslationStart = async ({
  translationId,
}: PostTranslationStartRequest) => {
  const response = await ClientWithAuth.post<Response<Translation>>(
    `/translations/${translationId}/start`,
  );
  return response.data.data;
};

export interface PostTranslationSubmitRequest {
  translationId: string;
  fileId: string;
}

export const postTranslationSubmit = async ({
  translationId,
  fileId,
}: PostTranslationSubmitRequest) => {
  const payload = {
    file_id: fileId,
  };
  const response = await ClientWithAuth.post<Response<Translation>>(
    `/translations/${translationId}/submit/`,
    payload,
  );
  return response.data.data;
};

export const getTranslationsRequest = async () => {
  const response =
    await ClientWithAuth.get<Response<Translation[]>>(`/translations/client`);
  return response.data.data;
};

export const getTranslationsResponse = async () => {
  const response = await ClientWithAuth.get<Response<Translation[]>>(
    `/translations/translator`,
  );
  return response.data.data;
};

export interface Comment {
  comment_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export const getTranslationComments = async ({
  translationId,
}: {
  translationId: string;
}) => {
  const respose = await ClientWithAuth.get<Response<Comment[]>>(
    `/translations/${translationId}/comments`,
  );
  return respose.data.data;
};

export const postTranslationComment = async ({
  translationId,
  content,
}: {
  translationId: string;
  content: string;
}) => {
  const response = await ClientWithAuth.post<Response<Comment>>(
    `/translations/${translationId}/comments`,
    { content },
  );
  return response.data.data;
};

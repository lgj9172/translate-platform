import { objectToFormData } from "@/utils/converter/form";
import { ClientWithAuth, Response } from "./clients";

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

export const FileType = ["PPT", "WORD", "TEXT"] as const;

export const QuantityUnit = ["CHAR", "WORD"] as const;

export interface FileInfo {
  file_id: string;
  name: string;
  extension: (typeof FileType)[number];
  url: string;
}

export interface TranslationSourceFileInfo {
  source_file_id: string;
  char_with_blank: number;
  char_without_blank: number;
  word: number;
  file: FileInfo;
}

export const TranslationStatus = [
  "QUOTE_SENT",
  "TRANSLATION_CANCELLED",
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
  source_files: TranslationSourceFileInfo[];
  target_files: TranslationSourceFileInfo[];
  deadline: string;
  fee_unit: string;
  fee_value: number;
  sample: string;
  status: (typeof TranslationStatus)[number];
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

interface UploadTranslationFileRequest {
  content: File | string;
}

export const postTranslationFile = async (
  input: UploadTranslationFileRequest,
) => {
  const payload = objectToFormData(input);
  const response = await ClientWithAuth.post<Response<FileInfo>>(
    "/translations/upload_file",
    payload,
  );
  return response.data.data;
};

interface PostTranslationRequest {
  title: string;
  description: string;
  categories: (typeof Category)[number][];
  sourceLanguage: (typeof Language)[number];
  targetLanguage: (typeof Language)[number];
  fileId: string;
  desiredFeeUnit: (typeof MoneyUnit)[number];
  desiredFeeValue: number;
  endDateTime: string;
  sample?: string;
}

export const postTranslation = async (input: PostTranslationRequest) => {
  const payload = {
    title: input.title,
    description: input.description,
    categories: input.categories,
    language: {
      source: input.sourceLanguage,
      target: input.targetLanguage,
    },
    file_id: input.fileId,
    desired_fee: {
      unit: input.desiredFeeUnit,
      value: input.desiredFeeValue,
    },
    end_time: input.endDateTime,
    sample: input.sample,
  };
  const response = await ClientWithAuth.post<Response<Translation>>(
    "/translations",
    payload,
  );
  return response.data.data;
};

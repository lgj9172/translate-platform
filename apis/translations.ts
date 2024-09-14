import { objectToFormData } from "@/utils/converter/form";
import { ClientWithAuth, Pagenation, Response } from "./clients";

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

export interface LanguageInfo {
  source: (typeof Language)[number];
  target: (typeof Language)[number];
}

export interface FileInfo {
  file_id: string;
  extension: (typeof FileType)[number];
  url: string;
  char_with_blank: number;
  char_without_blank: number;
  word: number;
}

// export interface Quantity {
//   unit: (typeof QuantityUnit)[number];
//   value: number;
//   blank: boolean;
// }

// export interface DesiredFee {
//   unit: (typeof MoneyUnit)[number];
//   value: number;
// }

export const TranslationStatus = ["CHAR", "WORD"] as const;

export interface Translation {
  translation_id: string;
  title: string;
  source_language: string;
  target_language: string;
  categories: (typeof Category)[number][];
  description: string;
  // language: LanguageInfo;
  // file: FileInfo;
  source_files: FileInfo[];
  target_files: FileInfo[];
  // quantity: Quantity;
  // desired_fee: DesiredFee;
  deadline: string;
  fee_unit: string;
  fee_value: number;
  sample: string;
  status: (typeof TranslationStatus)[number][];
  // likes: number;
  quotations: any[];
  comments: any[];
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

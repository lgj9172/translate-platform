import { ClientWithAuth, Pagenation, Response } from "./clients";

export interface Language {
  source:
    | "ko-KR"
    | "en-US"
    | "ja-JP"
    | "zh-CN"
    | "ar-SA"
    | "ru-RU"
    | "es-ES"
    | "fr-FR"
    | "de-DE";
  target:
    | "ko-KR"
    | "en-US"
    | "ja-JP"
    | "zh-CN"
    | "ar-SA"
    | "ru-RU"
    | "es-ES"
    | "fr-FR"
    | "de-DE";
}

export interface File {
  id: string;
  type: "PPT" | "WORD" | "TEXT";
  url: string;
  char_with_blank: number;
  char_without_blank: number;
  word: number;
}

export interface Quantity {
  unit: "CHAR" | "WORD";
  value: number;
  blank: boolean;
}

export interface DesiredFee {
  unit: "KRW" | "USD";
  value: number;
}

export interface Translation {
  id: string;
  title: string;
  description: string;
  categories: Array<
    | "IT"
    | "FINANCE"
    | "CONTENTS"
    | "GAME"
    | "LAW"
    | "MEDICAL"
    | "CONSTRUCTION"
    | "MARKETING"
    | "LITERATURE"
    | "ETC"
  >;
  language: Language;
  file: File;
  quantity: Quantity;
  desired_fee: DesiredFee;
  quotations: number;
  end_time: string;
  likes: number;
  sample: string;
}

export const getTranslations = async () => {
  const response = await ClientWithAuth.get<Response<Pagenation<Translation>>>(
    "/translations"
  );
  return response.data.data;
};

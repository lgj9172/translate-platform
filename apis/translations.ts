import { ClientWithAuth } from "./clients";

export interface Language {
  source: string;
  target: string;
}

export interface File {
  id: string;
  type: string;
  url: string;
  char_with_blank: number;
  char_without_blank: number;
  word: number;
}

export interface Quantity {
  unit: string;
  value: number;
  blank: boolean;
}

export interface DesiredFee {
  unit: string;
  value: number;
}

export interface Translation {
  id: string;
  title: string;
  description: string;
  categories: string[];
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
  const response = await ClientWithAuth.get<Translation[]>("/translations");
  return response.data;
};

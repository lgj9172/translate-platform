import { ClientWithAuth, Response } from "./clients";

export interface Education {
  name: string;
  major: string;
  degree: string; // TODO: enum 정의 필요 "BACHELOR" | "MASTER" | "DOCTOR";
  graduation_status: string; // TODO: enum 정의 필요= "GRADUATED" | "ATTENDING" | "LEAVE" | "DROPOUT";
  started_at: string;
  ended_at: string;
  is_verified: boolean;
  file: {
    file_id: string;
    name: string;
    extension: string;
  };
}

export interface Career {
  name: string;
  position: string;
  achievement: string;
  is_employed: boolean;
  started_at: string;
  ended_at: string;
  is_verified: boolean;
  file: {
    file_id: string;
    name: string;
    extension: string;
  };
}

export interface Certification {
  name: string;
  organization: string;
  started_at: string;
  is_verified: boolean;
  file: {
    file_id: string;
    name: string;
    extension: string;
  };
}

export interface TranslationSample {
  source_language: string;
  target_language: string;
  source_text: string;
  target_text: string;
}

export interface Translator {
  translator_id: string;
  categories: string[];
  introduction: string;
  educations: Education[];
  careers: Career[];
  certifications: Certification[];
  translation_samples: TranslationSample[];
  created_at: string;
  updated_at: string;
  user_id: string;
  reviews: unknown[]; // TODO: Review 타입 정의 필요
  experience: number;
  recent_translations: number;
}

export const getTranslator = async (translatorId: string) => {
  const response = await ClientWithAuth.get<Response<Translator>>(
    `/translators/${translatorId}`,
  );
  return response.data.data;
};

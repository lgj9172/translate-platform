import { TRANSLATION_CATEGORY, TranslationCategory } from "@/types/entities";
import { z } from "zod";
import { CareerDefaultValue, CareerSchema } from "./career";
import {
  CertificationDefaultValue,
  CertificationSchema,
} from "./certification";
import { EducationDefaultValue, EducationSchema } from "./education";
import {
  TranslationSampleDefaultValue,
  TranslationSampleSchema,
} from "./translationSample";

export const PostTranslatorFormSchema = z.object({
  categories: z
    .array(
      z.union([
        z.literal(TRANSLATION_CATEGORY.IT),
        z.literal(TRANSLATION_CATEGORY.FINANCE),
        z.literal(TRANSLATION_CATEGORY.CONTENTS),
        z.literal(TRANSLATION_CATEGORY.GAME),
        z.literal(TRANSLATION_CATEGORY.LAW),
        z.literal(TRANSLATION_CATEGORY.MEDICAL),
        z.literal(TRANSLATION_CATEGORY.CONSTRUCTION),
        z.literal(TRANSLATION_CATEGORY.MARKETING),
        z.literal(TRANSLATION_CATEGORY.LITERATURE),
        z.literal(TRANSLATION_CATEGORY.ETC),
      ]),
    )
    .refine((value) => value.length > 0, "전문 분야를 선택해주세요.")
    .refine(
      (value) => value.length <= 3,
      "전문 분야는 최대 3개까지만 선택 할 수 있어요.",
    ),
  description: z.string().min(1, "자기소개를 입력해주세요."),
  educations: z.array(EducationSchema).min(1, "교육사항을 입력해주세요."),
  careers: z.array(CareerSchema).min(1, "경력을 입력해주세요."),
  certifications: z.array(CertificationSchema),
  translation_samples: z.array(TranslationSampleSchema),
});

export const PostTranslatorFormDefaultValue = {
  categories: [] as TranslationCategory[],
  description: "",
  educations: [EducationDefaultValue],
  careers: [CareerDefaultValue],
  certifications: [CertificationDefaultValue],
  translation_samples: [TranslationSampleDefaultValue],
};

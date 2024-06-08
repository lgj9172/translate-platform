import { z } from "zod";
import { LanguageSchema } from "./language";

export const TranslationSampleSchema = z.object({
  source_language: LanguageSchema,
  target_language: LanguageSchema,
  source_text: z.string().min(1, "출발어의 번역 샘플을 입력해주세요."),
  target_text: z.string().min(1, "도착어의 번역 샘플을 입력해주세요."),
});

export const TranslationSampleDefaultValue: z.infer<
  typeof TranslationSampleSchema
> = {
  source_language: "ko-KR",
  target_language: "en-US",
  source_text: "",
  target_text: "",
};

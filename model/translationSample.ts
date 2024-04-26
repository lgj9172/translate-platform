import { z } from "zod";
import { LanguageSchema } from "./language";

export const TranslationSampleSchema = z.object({
  source_language: LanguageSchema,
  target_language: LanguageSchema,
  source_text: z.string(),
  target_text: z.string(),
});

export const TranslationSampleDefaultValue: z.infer<
  typeof TranslationSampleSchema
> = {
  source_language: "ko-KR",
  target_language: "en-US",
  source_text: "",
  target_text: "",
};

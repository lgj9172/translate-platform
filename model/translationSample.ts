import { z } from "zod";

export const TranslationSampleSchema = z.object({
  source_language: z.string(),
  target_language: z.string(),
  source_text: z.string(),
  target_text: z.string(),
});

export const TranslationSampleDefaultValue = {
  source_language: "",
  target_language: "",
  source_text: "",
  target_text: "",
};

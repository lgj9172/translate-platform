import { z } from "zod";

export const LanguageSchema = z.enum([
  "ko-KR",
  "en-US",
  "ja-JP",
  "zh-CN",
  "ar-SA",
  "ru-RU",
  "es-ES",
  "fr-FR",
  "de-DE",
]);

import { z } from "zod";

export const PostTranslatorFormSchema = z.object({
  categories: z.array(
    z.enum([
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
    ]),
  ),
  introduction: z.string(),
  educations: z.array(
    z.object({
      name: z.string(),
      major: z.string(),
      degree: z.string(),
      graduation_status: z.string(),
      started_at: z.string(),
      ended_at: z.string(),
      file_id: z.string(),
    }),
  ),
  careers: z.array(
    z.object({
      name: z.string(),
      position: z.string(),
      achievement: z.string().optional(),
      is_employed: z.boolean().optional(),
      started_at: z.string(),
      ended_at: z.string().optional(),
      file_id: z.string(),
    }),
  ),
  certifications: z
    .array(
      z.object({
        name: z.string(),
        organization: z.string(),
        started_at: z.string(),
        file_id: z.string(),
      }),
    )
    .optional(),
  samples: z.array(
    z.object({
      source_language: z.string(),
      source_text: z.string(),
      target_language: z.string(),
      target_text: z.string(),
    }),
  ),
});

export const PostTranslatorFormDefaultValue = {
  categories: [],
  introduction: "",
  educations: [],
  careers: [],
  certifications: [],
  samples: [],
};

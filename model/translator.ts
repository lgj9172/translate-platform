import { Category } from "@/apis/translations";
import { z } from "zod";
import { EducationDefaultValue, EducationSchema } from "./education";
import { CareerDefaultValue, CareerSchema } from "./career";

export const PostTranslatorFormSchema = z.object({
  categories: z
    .array(z.enum(Category))
    .refine((value) => value.length > 0, "분야를 1개 이상 선택해 주세요.")
    .refine(
      (value) => value.length <= 3,
      "분야는 최대 3개까지만 선택 할 수 있어요.",
    ),
  description: z.string(),
  educations: z.array(EducationSchema),
  careers: z.array(CareerSchema),
});

export const PostTranslatorFormDefaultValue = {
  categories: [] as (typeof Category)[number][],
  description: "",
  educations: [EducationDefaultValue],
  careers: [CareerDefaultValue],
};

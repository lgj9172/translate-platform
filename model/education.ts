import { z } from "zod";
import { FileDefaultValue, FileSchema } from "./file";
import { DegreeSchema } from "./degree";
import { EducationStatusSchema } from "./educationStatus";

export const EducationSchema = z.object({
  started_at: z.string().min(1, "학력 시작월을 입력해주세요."),
  ended_at: z.string().min(1, "학력 종료월을 입력해주세요."),
  name: z.string().min(1, "학교 이름을 입력해주세요."),
  major: z.string().min(1, "전공을 입력해주세요."),
  degree: DegreeSchema,
  status: EducationStatusSchema,
  file: FileSchema,
});

export const EducationDefaultValue: z.infer<typeof EducationSchema> = {
  started_at: "",
  ended_at: "",
  name: "",
  major: "",
  degree: "BACHELOR",
  status: "GRADUATED",
  file: FileDefaultValue,
};

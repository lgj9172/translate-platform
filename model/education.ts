import { z } from "zod";
import { FileDefaultValue, FileSchema } from "./file";

export const EducationSchema = z.object({
  startMonth: z.string(),
  endMonth: z.string(),
  schoolName: z.string(),
  major: z.string(),
  degree: z.string(),
  graduation_status: z.string(),
  file: FileSchema,
});

export const EducationDefaultValue = {
  startMonth: "",
  endMonth: "",
  schoolName: "",
  major: "",
  degree: "학사",
  graduation_status: "졸업",
  file: FileDefaultValue,
};

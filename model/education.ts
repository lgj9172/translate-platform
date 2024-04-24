import { z } from "zod";
import { FileDefaultValue, FileSchema } from "./file";

export const EducationSchema = z.object({
  started_at: z.string(),
  ended_at: z.string(),
  name: z.string(),
  major: z.string(),
  degree: z.string(),
  status: z.string(),
  file: FileSchema,
});

export const EducationDefaultValue = {
  started_at: "",
  ended_at: "",
  name: "",
  major: "",
  degree: "학사",
  status: "졸업",
  file: FileDefaultValue,
};

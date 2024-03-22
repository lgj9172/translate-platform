import { z } from "zod";

export const EducationSchema = z.object({
  startMonth: z.string(),
  endMonth: z.string(),
  schoolName: z.string(),
  major: z.string(),
  degree: z.string(),
  graduation_status: z.string(),
});

export const EducationDefaultValue = {
  startMonth: "",
  endMonth: "",
  schoolName: "",
  major: "",
  degree: "학사",
  graduation_status: "졸업",
};

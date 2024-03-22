import { z } from "zod";

export const CareerSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  isWorking: z.boolean(),
  company: z.string(),
  position: z.string(),
  achievements: z.string(),
});

export const CareerDefaultValue = {
  startDate: "",
  endDate: "",
  isWorking: false,
  company: "",
  position: "",
  achievements: "",
};

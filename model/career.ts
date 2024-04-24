import { z } from "zod";

export const CareerSchema = z.object({
  started_at: z.string(),
  ended_at: z.string(),
  is_employed: z.boolean(),
  name: z.string(),
  position: z.string(),
  achievement: z.string(),
});

export const CareerDefaultValue = {
  started_at: "",
  ended_at: "",
  is_employed: false,
  name: "",
  position: "",
  achievement: "",
};

import { z } from "zod";

export const CertificationSchema = z.object({
  name: z.string(),
  organization: z.string(),
  start_at: z.string(),
  file: z.object({
    id: z.number(),
    name: z.string(),
    extention: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
  }),
});

export const CertificationDefaultValue = {
  name: "",
  organization: "",
  start_at: "",
  file: {
    id: 0,
    name: "",
    extention: "",
    created_at: "",
    updated_at: "",
  },
};

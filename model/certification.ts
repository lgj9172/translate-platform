import { z } from "zod";
import { FileDefaultValue, FileSchema } from "./file";

export const CertificationSchema = z.object({
  name: z.string(),
  organization: z.string(),
  start_at: z.string(),
  file: FileSchema,
});

export const CertificationDefaultValue = {
  name: "",
  organization: "",
  start_at: "",
  file: FileDefaultValue,
};

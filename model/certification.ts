import { z } from "zod";
import { FileDefaultValue, FileSchema } from "./file";

export const CertificationSchema = z.object({
  name: z.string(),
  organization: z.string(),
  started_at: z.string(),
  file: FileSchema,
});

export const CertificationDefaultValue = {
  name: "",
  organization: "",
  started_at: "",
  file: FileDefaultValue,
};

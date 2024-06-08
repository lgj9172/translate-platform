import { z } from "zod";
import { FileDefaultValue, FileSchema } from "./file";

export const CertificationSchema = z.object({
  name: z.string().min(1, "자격증 이름을 입력해주세요."),
  organization: z.string().min(1, "자격증을 발급한 기관 이름을 입력해주세요."),
  started_at: z.string().min(1, "자격증 발급일을 입력해주세요."),
  file: FileSchema,
});

export const CertificationDefaultValue = {
  name: "",
  organization: "",
  started_at: "",
  file: FileDefaultValue,
};

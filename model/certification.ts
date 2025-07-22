import { z } from "zod";

export const CertificationSchema = z.object({
  name: z.string().min(1, "자격증 이름을 입력해주세요."),
  organization: z.string().min(1, "자격증을 발급한 기관 이름을 입력해주세요."),
  started_at: z.string().min(1, "자격증 발급일을 입력해주세요."),
  file_id: z.string().min(1, "자격증 증명서를 업로드해주세요."),
});

export const CertificationDefaultValue = {
  name: "",
  organization: "",
  started_at: "",
  file_id: "",
};

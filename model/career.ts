import { z } from "zod";

export const CareerSchema = z.object({
  started_at: z.string().min(1, "경력 시작일을 입력해주세요."),
  ended_at: z.string().min(1, "경력 종료일을 입력해주세요."),
  is_employed: z.boolean(),
  name: z.string().min(1, "회사 이름을 입력해주세요."),
  position: z.string().min(1, "직무를 입력해주세요."),
  achievement: z.string().min(1, "주요성과를 입력해주세요."),
  file_id: z.string().min(1, "경력 증명서를 업로드해주세요."),
});

export const CareerDefaultValue = {
  started_at: "",
  ended_at: "",
  is_employed: false,
  name: "",
  position: "",
  achievement: "",
  file_id: "",
};

import { z } from "zod";

export const FileSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "파일을 선택해주세요."),
  extension: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const FileDefaultValue = {
  id: 0,
  name: "",
  extension: "",
  created_at: "",
  updated_at: "",
};

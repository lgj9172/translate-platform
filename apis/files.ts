import { objectToFormData } from "@/utils/converter/form";
import { ClientWithAuth, Response } from "./clients";

export interface FileInfo {
  id: number;
  name: string;
  extension: string;
  created_at: string;
  updated_at: string;
}

interface PostFileRequest {
  content: File | null;
}

export const postFile = async (input: PostFileRequest) => {
  const payload = objectToFormData(input);
  const response = await ClientWithAuth.post<Response<FileInfo>>(
    "/files",
    payload,
  );
  return response.data.data;
};

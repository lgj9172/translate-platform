import { objectToFormData } from "@/utils/converter/form";
import { ClientWithAuth, Response } from "./clients";

export const FileType = ["PPT", "WORD", "TEXT"] as const;

export interface FileId {
  file_id: string;
}

export interface FileInfo {
  file_id: string;
  name: string;
  extension: (typeof FileType)[number];
  url?: string;
  created_at: string;
  updated_at: string;
}

interface PostFileRequest {
  content: File;
}

export const postFile = async (input: PostFileRequest) => {
  const payload = objectToFormData(input);
  const response = await ClientWithAuth.post<Response<FileInfo>>(
    "/files",
    payload,
  );
  return response.data.data;
};

import { objectToFormData } from "@/utils/converter/form";
import { ClientWithAuth, Response } from "./clients";

export interface FileInfo {
  file_id: string;
  name: string;
  extension: string;
  url: string;
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

import { ClientWithoutAuth, Response } from "./clients";

export interface Notice {
  notice_id: string;
  title: string;
  description: string;
  is_important: boolean;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export const getNotices = async () => {
  const response = await ClientWithoutAuth.get<Response<Notice[]>>(`/notices`);
  return response.data.data;
};

export const getNotice = async ({ noticeId }: { noticeId: string }) => {
  const response = await ClientWithoutAuth.get<Response<Notice>>(
    `/notices/${noticeId}`,
  );
  return response.data.data;
};

import { ClientWithAuth, ClientWithoutAuth, Response } from "./clients";
import { FileId, FileInfo } from "./files";

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

export interface FAQ {
  faq_id: string;
  title: string;
  description: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export const getFAQs = async () => {
  const response = await ClientWithoutAuth.get<Response<FAQ[]>>(`/faqs`);
  return response.data.data;
};

export const getFAQ = async ({ faqId }: { faqId: string }) => {
  const response = await ClientWithoutAuth.get<Response<FAQ>>(`/faqs/${faqId}`);
  return response.data.data;
};

export interface CSAsk {
  counsel_id: string;
  category: string; // TODO: enum 정의 필요
  translation_id: string;
  email: string;
  use_registerd_email: boolean;
  content: string;
  files: FileInfo[];
  status: string; // TODO: enum 정의 필요
  created_at: string;
  updated_at: string;
}

export interface CSAnswer {
  reply_id: string;
  content: string;
  counsel_id: string;
  created_at: string;
  updated_at: string;
}

interface PostCSAskRequest {
  category: string;
  content: string;
  files: FileId[];
}

export const postCSAsk = async (payload: PostCSAskRequest) => {
  const response = await ClientWithAuth.post<Response<CSAsk>>(
    `/counsels`,
    payload,
  );
  return response.data.data;
};

export const getCSAsks = async () => {
  const response = await ClientWithAuth.get<Response<CSAsk[]>>(`/counsels`);
  return response.data.data;
};

export const getCSAsk = async ({ counselId }: { counselId: string }) => {
  const response = await ClientWithAuth.get<Response<CSAsk>>(
    `/counsels/${counselId}`,
  );
  return response.data.data;
};

export const getCSAnswer = async ({ counselId }: { counselId: string }) => {
  const response = await ClientWithAuth.get<Response<CSAnswer>>(
    `/counsels/${counselId}/reply`,
  );
  return response.data.data;
};

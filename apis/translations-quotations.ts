import { ClientWithAuth, Response } from "./clients";
import { TranslationStatus } from "./translations";

export interface TranslationQuote {
  quotation_id: string;
  translation_fee: number;
  detail: string;
  status: (typeof TranslationStatus)[number];
  translation_id: string;
  translator_id: string;
  name: string;
  experience: number;
  recent_translations: number;
  created_at: string;
  updated_at: string;
}

interface PostTranslationQuote {
  translation_fee: number;
  detail: string;
  translation_id: string;
}

export const getTranslationQuotes = async ({
  translationId,
}: {
  translationId: string;
}) => {
  const response = await ClientWithAuth.get<Response<TranslationQuote[]>>(
    `/translations/${translationId}/quotations`,
  );
  return response.data.data;
};

export const postTranslationQuote = async (input: PostTranslationQuote) => {
  const payload = {
    translation_fee: input.translation_fee,
    detail: input.detail,
  };
  const response = await ClientWithAuth.post<Response<TranslationQuote>>(
    `/translations/${input.translation_id}/quotations`,
    payload,
  );
  return response.data.data;
};

export interface PostTranslationQuoteCancelRequest {
  translationId: string;
  quotationId: string;
}

export const postTranslationQuoteCancel = async ({
  translationId,
  quotationId,
}: PostTranslationQuoteCancelRequest) => {
  const response = await ClientWithAuth.post<Response<TranslationQuote>>(
    `/translations/${translationId}/quotations/${quotationId}/cancel`,
  );
  return response.data.data;
};

export interface PostTranslationQuoteSelectRequest {
  translationId: string;
  quotationId: string;
}

export const postTranslationQuoteSelect = async ({
  translationId,
  quotationId,
}: PostTranslationQuoteSelectRequest) => {
  const response = await ClientWithAuth.post<Response<TranslationQuote>>(
    `/translations/${translationId}/quotations/${quotationId}/assign`,
  );
  return response.data.data;
};

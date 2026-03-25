import { Review } from "@/types/entities";
import { ClientWithAuth, PaginatedResponse, Response } from "./clients";

export const getReviews = async ({
  translatorId,
}: {
  translatorId: string;
}) => {
  const response = await ClientWithAuth.get<PaginatedResponse<Review>>(
    `/reviews/translator/${translatorId}`,
  );
  return response.data.data;
};

export const postReview = async ({
  payload,
}: {
  payload: {
    translatorId: string;
    translationId: string;
    ratings: {
      translation_quality: number;
      communication: number;
      deadline_compliance: number;
    };
    comment?: string;
  };
}) => {
  const response = await ClientWithAuth.post<Response<Review>>(
    "/reviews",
    payload,
  );
  return response.data.data;
};

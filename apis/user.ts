import { User, UserProvider, Token } from "@/types/entities";
import { ClientWithAuth, ClientWithoutAuth, Response } from "./clients";

export const getUser = async () => {
  const response = await ClientWithAuth.get<Response<User>>("/users/me");
  return response.data.data;
};

export const getOtherUser = async ({ userId }: { userId: string }) => {
  const response = await ClientWithAuth.get<Response<User>>(`/users/${userId}`);
  return response.data.data;
};

export const getOAuthLogin = async ({
  provider,
}: {
  provider: UserProvider;
}) => {
  const response = await ClientWithoutAuth.get<Response<null>>(
    `/oauth/${provider}/login`,
  );
  return response.data.data;
};

export const getOAuthCallback = async ({
  provider,
}: {
  provider: UserProvider;
}) => {
  const response = await ClientWithoutAuth.get<Response<null>>(
    `/oauth/${provider}/callback`,
  );
  return response.data.data;
};

export const postRefreshToken = async ({
  payload,
}: {
  payload: {
    refresh_token: string;
  };
}) => {
  const response = await ClientWithoutAuth.post<Response<Token>>(
    "/token",
    payload,
  );
  return response.data.data;
};

export const postLogout = async () => {
  const response = await ClientWithAuth.post<string>("/logout");
  return response.data;
};

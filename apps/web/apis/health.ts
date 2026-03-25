import { ClientWithoutAuth } from "./clients";

export const getHealth = async () => {
  const response = await ClientWithoutAuth.get<string>("/health");
  return response.data;
};

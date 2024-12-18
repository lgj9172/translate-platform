import { ClientWithAuth } from "./clients";

export interface User {
  id: string;
  type: string;
  name: string;
  nickname: string;
  email: string;
  is_agree_privacy_policy: boolean;
  is_agree_use_policy: boolean;
  is_agree_marketing: boolean;
  is_age_verification: boolean;
  is_agree_marketing_email: boolean;
  is_agree_marketing_sms: boolean;
  profile_image: string;
}

export const getUser = async () => {
  const response = await ClientWithAuth.get<User>("/users/me");
  return response.data;
};

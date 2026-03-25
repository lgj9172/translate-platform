import axios from "axios";
import type {
  PaginatedResponse,
  PaginationParams,
  Response,
} from "@/types/entities";
import { createClient } from "@/utils/supabase/client";

export const ClientWithAuth = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// 매 요청마다 Supabase 세션의 access_token을 Bearer 헤더로 주입
ClientWithAuth.interceptors.request.use(async (config) => {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }

  return config;
});

export const ClientWithoutAuth = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export type { PaginatedResponse, PaginationParams, Response };

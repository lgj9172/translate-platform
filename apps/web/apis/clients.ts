import axios from "axios";
import type {
  PaginatedResponse,
  PaginationParams,
  Response,
} from "@/types/entities";

export const ClientWithAuth = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export const ClientWithoutAuth = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export type { PaginatedResponse, PaginationParams, Response };

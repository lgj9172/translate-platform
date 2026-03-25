import axios from "axios";
import {
  Response,
  PaginatedResponse,
  PaginationParams,
} from "@/types/entities";

export const ClientWithAuth = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export const ClientWithoutAuth = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export type { Response, PaginatedResponse, PaginationParams };

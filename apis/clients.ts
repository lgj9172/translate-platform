import axios from "axios";

export const ClientWithAuth = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  // withCredentials: true,
});

export const ClientWithoutAuth = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
});

export interface Response<T> {
  code: number;
  message: string;
  data: T;
}

export interface Pagenation<T> {
  results: T[];
  page: number;
  size: number;
  total_pages: number;
  total_items: number;
}

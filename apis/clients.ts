import axios from "axios";

export const ClientWithAuth = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
});

export const ClientWithoutAuth = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
});

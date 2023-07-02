"use client";

import { useQuery } from "@tanstack/react-query";
import { redirect, useSearchParams } from "next/navigation";
import { ClientWithoutAuth } from "@/apis/clients";
import { REACT_QUERY } from "@/constants/key";

export default function Index() {
  const searchParams = useSearchParams();

  const code = searchParams.get("code");

  const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/sign-in/naver`;

  const { data } = useQuery({
    queryKey: [REACT_QUERY.OAUTH.NAVER],
    queryFn: () =>
      ClientWithoutAuth.post(url, {
        redirection_uri: process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI,
        code: `${
          true ? process.env.NEXT_PUBLIC_NAVER_FAKE_RESPONSE_CODE : code
        }`,
      }),
  });

  if (!data) return <>소셜 로그인 진행중입니다.</>;

  redirect("/");
}

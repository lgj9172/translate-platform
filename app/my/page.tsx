"use client";

import {
  getTranslationsRequest,
  getTranslationsResponse,
} from "@/apis/translations";
import Card from "@/components/Card";
import PageHeader from "@/components/PageHeader";
import PageTitle from "@/components/PageTitle";
import { ActionIcon, Avatar, Group, Loader, Stack } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa6";

export default function Page() {
  const { data: translationRequest, isLoading: isLoadingTranslationRequest } =
    useQuery({
      queryKey: ["translation-request"],
      queryFn: () => getTranslationsRequest(),
    });

  const { data: translationResponse, isLoading: isLoadingTranslationResponse } =
    useQuery({
      queryKey: ["translation-request"],
      queryFn: () => getTranslationsResponse(),
    });

  // const { data: translator, isLoading: isLoadingTranslator } = useQuery({
  //   queryKey: ["translator"],
  //   queryFn: () => getTranslationsResponse(),
  // });

  return (
    <Stack>
      <PageHeader>
        <Group>
          <ActionIcon
            variant="transparent"
            color="black"
            component={Link}
            href="/"
          >
            <FaChevronLeft />
          </ActionIcon>
          <PageTitle>마이 페이지</PageTitle>
        </Group>
      </PageHeader>

      <div className="flex gap-[8px]">
        <Avatar src="avatar.png" />
        <div>
          <div className="text-[14px] text-[#4B4D4D]">회원이름</div>
          <div className="text-[14px] text-[#8B8C8D]">고객 또는 번역사</div>
        </div>
      </div>

      <Link className="hover:cursor-pointer" href="/my/translation/request">
        <Card>
          <div className="flex justify-between items-center">
            <div>보낸 번역 요청</div>
            {isLoadingTranslationRequest ? (
              <Loader color="orange" type="bars" size="sm" />
            ) : (
              <div className="text-[#8B8C8D] font-bold">
                <span className="text-primary">
                  {translationRequest?.length}
                </span>{" "}
                건
              </div>
            )}
          </div>
        </Card>
      </Link>

      <Link className="hover:cursor-pointer" href="/my/translation/response">
        <Card>
          <div className="flex justify-between items-center">
            <div>받은 번역 요청</div>
            {isLoadingTranslationResponse ? (
              <Loader color="orange" type="bars" size="sm" />
            ) : (
              <div className="text-[#8B8C8D] font-bold">
                <span className="text-primary">
                  {translationResponse?.length}
                </span>{" "}
                건
              </div>
            )}
          </div>
        </Card>
      </Link>

      <Link className="hover:cursor-pointer" href="/my/translator">
        <Card>
          <div className="flex justify-between items-center">
            <div>번역사 등록</div>
            <div className="text-[#8B8C8D] font-bold">등록 필요</div>
          </div>
        </Card>
      </Link>

      <Link className="hover:cursor-pointer" href="/">
        <Card>회원 탈퇴</Card>
      </Link>
    </Stack>
  );
}

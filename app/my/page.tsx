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
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

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

      <Card>
        <div className="flex gap-[8px]">
          <Avatar src="avatar.png" />
          <div>
            <div className="text-[14px] text-[#4B4D4D]">회원이름</div>
            <div className="text-[14px] text-[#8B8C8D]">고객 또는 번역사</div>
          </div>
        </div>
      </Card>

      <Link href="/my/translation/request">
        <Card>
          <div className="flex justify-between items-center py-2">
            <div className="flex flex-col">
              <span className="font-medium text-gray-800">보낸 번역 요청</span>
              <span className="text-sm text-gray-500">
                내가 요청한 번역 현황을 확인하세요
              </span>
            </div>
            <div className="flex items-center gap-2">
              {isLoadingTranslationRequest ? (
                <Loader color="orange" type="bars" size="sm" />
              ) : (
                <div className="text-gray-600 font-medium">
                  <span className="text-orange-500">
                    {translationRequest?.length}
                  </span>{" "}
                  건
                </div>
              )}
              <FaChevronRight className="text-gray-400" />
            </div>
          </div>
        </Card>
      </Link>

      <Link href="/my/translation/response">
        <Card>
          <div className="flex justify-between items-center py-2">
            <div className="flex flex-col">
              <span className="font-medium text-gray-800">받은 번역 요청</span>
              <span className="text-sm text-gray-500">
                나에게 요청된 번역을 확인하세요
              </span>
            </div>
            <div className="flex items-center gap-2">
              {isLoadingTranslationResponse ? (
                <Loader color="orange" type="bars" size="sm" />
              ) : (
                <div className="text-gray-600 font-medium">
                  <span className="text-orange-500">
                    {translationResponse?.length}
                  </span>{" "}
                  건
                </div>
              )}
              <FaChevronRight className="text-gray-400" />
            </div>
          </div>
        </Card>
      </Link>

      <Link href="/my/translator">
        <Card>
          <div className="flex justify-between items-center py-2">
            <div className="flex flex-col">
              <span className="font-medium text-gray-800">번역사 등록</span>
              <span className="text-sm text-gray-500">
                번역사로 활동하고 싶다면 등록해주세요
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-gray-600 font-medium">등록 필요</div>
              <FaChevronRight className="text-gray-400" />
            </div>
          </div>
        </Card>
      </Link>

      <Link href="/my/withdraw">
        <Card>
          <div className="flex justify-between items-center py-2">
            <div className="flex flex-col">
              <span className="font-medium text-gray-800">회원 탈퇴</span>
              <span className="text-sm text-gray-500">
                회원 탈퇴를 진행합니다
              </span>
            </div>
            <FaChevronRight className="text-gray-400" />
          </div>
        </Card>
      </Link>
    </Stack>
  );
}

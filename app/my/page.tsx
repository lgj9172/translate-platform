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

      <div className="flex flex-col gap-16">
        <Card>
          <div className="flex gap-[8px]">
            <Avatar />
            <div>
              <div className="text-[14px] text-[#4B4D4D]">회원이름</div>
              <div className="text-[14px] text-[#8B8C8D]">고객 또는 번역사</div>
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-2">
          <div>
            <div className="text-xl font-bold text-gray-800">
              통번역사 서비스
            </div>
            <div className="text-sm text-gray-600">
              진행중인 작업을 확인하고 통번역사 정보를 관리하세요.
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Link href="/my/translation/response">
              <Card>
                <div className="flex justify-between items-center py-2">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">
                      받은 번역 요청
                    </span>
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
                    <span className="font-medium text-gray-800">
                      번역사 정보 수정
                    </span>
                    <span className="text-sm text-gray-500">
                      번역사 정보를 수정해주세요
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-green-600 font-medium">인증됨</div>
                    <FaChevronRight className="text-gray-400" />
                  </div>
                </div>
              </Card>
            </Link>

            <Card className="bg-gray-200 opacity-50">
              <div className="flex justify-between items-center py-2">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800">
                    받은 통역 요청
                  </span>
                  <span className="text-sm text-gray-500">
                    내에게 요청된 통역을 확인하세요
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-gray-600 font-medium">
                    서비스 제공 예정
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-200 opacity-50">
              <div className="flex justify-between items-center py-2">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800">
                    받은 감수 요청
                  </span>
                  <span className="text-sm text-gray-500">
                    내에게 요청된 감수를 확인하세요
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-gray-600 font-medium">
                    서비스 제공 예정
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-200 opacity-50">
              <div className="flex justify-between items-center py-2">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800">
                    받은 공증 요청
                  </span>
                  <span className="text-sm text-gray-500">
                    내에게 요청된 공증을 확인하세요
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-gray-600 font-medium">
                    서비스 제공 예정
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div>
            <div className="text-xl font-bold text-gray-800">통번역 서비스</div>
            <div className="text-sm text-gray-600">
              요청한 통번역 작업을 확인하세요.
            </div>
          </div>

          <Link href="/my/translation/request">
            <Card>
              <div className="flex justify-between items-center py-2">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800">
                    보낸 번역 요청
                  </span>
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

          <Card className="bg-gray-200 opacity-50">
            <div className="flex justify-between items-center py-2">
              <div className="flex flex-col">
                <span className="font-medium text-gray-800">
                  보낸 통역 요청
                </span>
                <span className="text-sm text-gray-500">
                  내가 요청한 통역 현황을 확인하세요
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-gray-600 font-medium">
                  서비스 제공 예정
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gray-200 opacity-50">
            <div className="flex justify-between items-center py-2">
              <div className="flex flex-col">
                <span className="font-medium text-gray-800">
                  보낸 감수 요청
                </span>
                <span className="text-sm text-gray-500">
                  내가 요청한 감수 현황을 확인하세요
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-gray-600 font-medium">
                  서비스 제공 예정
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gray-200 opacity-50">
            <div className="flex justify-between items-center py-2">
              <div className="flex flex-col">
                <span className="font-medium text-gray-800">
                  보낸 공증 요청
                </span>
                <span className="text-sm text-gray-500">
                  내가 요청한 공증 현황을 확인하세요
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-gray-600 font-medium">
                  서비스 제공 예정
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-2">
          <div>
            <div className="text-xl font-bold text-gray-800">
              혹시 통번역사신가요?
            </div>
            <div className="text-sm text-gray-600">
              통번역 대학원을 졸업하셨다면 등록하고 활동해보세요.
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Link href="/my/translator">
              <Card>
                <div className="flex justify-between items-center py-2">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">
                      번역사 등록
                    </span>
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
          </div>
        </div>

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
      </div>
    </Stack>
  );
}

"use client";

import {
  getTranslationsClient,
  getTranslationsTranslator,
} from "@/apis/translations";
import { getTranslatorQuotations } from "@/apis/translator";
import { getUser } from "@/apis/user";
import Alert from "@/components/Alert";
import PageHeader from "@/components/PageHeader";
import PageTitle from "@/components/PageTitle";
import { ActionIcon } from "@/components/ui/action-icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Center } from "@/components/ui/center";
import { Group } from "@/components/ui/group";
import { Loader } from "@/components/ui/loader";
import { Stack } from "@/components/ui/stack";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export default function Page() {
  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isErrorUser,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(),
  });

  const { data: translationRequest, isLoading: isLoadingTranslationRequest } =
    useQuery({
      queryKey: ["translations", "client"],
      queryFn: () => getTranslationsClient({ params: { start: 0, size: 10 } }),
    });

  const { data: translationResponse, isLoading: isLoadingTranslationResponse } =
    useQuery({
      queryKey: ["translations", "translator"],
      queryFn: () =>
        getTranslationsTranslator({ params: { start: 0, size: 10 } }),
    });

  const {
    data: translatorQuotations,
    isLoading: isLoadingTranslatorQuotations,
  } = useQuery({
    queryKey: ["quotations"],
    queryFn: () => getTranslatorQuotations({ params: { start: 0, size: 10 } }),
  });

  return (
    <Stack>
      <PageHeader>
        <Group>
          <ActionIcon variant="ghost" asChild>
            <Link href="/">
              <ArrowLeftIcon />
            </Link>
          </ActionIcon>
          <PageTitle>마이 페이지</PageTitle>
        </Group>
      </PageHeader>

      <div className="flex flex-col gap-16">
        {isLoadingUser && (
          <Center className="h-[500px]">
            <Loader />
          </Center>
        )}
        {isErrorUser && (
          <Alert>회원 정보를 불러오는 중 오류가 발생했어요.</Alert>
        )}
        {user && (
          <Card>
            <div className="flex gap-[8px]">
              <Avatar>
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-[14px] text-[#4B4D4D]">{user?.name}</div>
                <div className="text-[14px] text-[#8B8C8D]">
                  {user?.authorization?.is_translator ? "번역사" : "고객"}
                </div>
              </div>
            </div>
          </Card>
        )}

        {user?.authorization?.is_translator && (
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
                      <div className="text-green-600 font-medium">
                        번역사로 인증되었어요.
                      </div>
                      <ArrowRightIcon className="text-gray-400" />
                    </div>
                  </div>
                </Card>
              </Link>

              <Link href="/my/translator/quotations">
                <Card>
                  <div className="flex justify-between items-center py-2">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800">
                        보낸 견적 요청
                      </span>
                      <span className="text-sm text-gray-500">
                        내가 보낸 견적을 확인하세요
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isLoadingTranslatorQuotations ? (
                        <Loader color="primary" size="sm" />
                      ) : (
                        <div className="text-gray-600 font-medium">
                          <span className="text-orange-500">
                            {translatorQuotations?.length}
                          </span>{" "}
                          건
                        </div>
                      )}
                      <ArrowRightIcon className="text-gray-400" />
                    </div>
                  </div>
                </Card>
              </Link>

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
                        <Loader color="primary" size="sm" />
                      ) : (
                        <div className="text-gray-600 font-medium">
                          <span className="text-orange-500">
                            {translationResponse?.length}
                          </span>{" "}
                          건
                        </div>
                      )}
                      <ArrowRightIcon className="text-gray-400" />
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
        )}

        <div className="flex flex-col gap-2">
          <div>
            <div className="text-xl font-bold text-gray-800">통번역 서비스</div>
            <div className="text-sm text-gray-600">
              요청한 통번역 작업을 확인하세요
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
                    <Loader color="primary" size="sm" />
                  ) : (
                    <div className="text-gray-600 font-medium">
                      <span className="text-orange-500">
                        {translationRequest?.length}
                      </span>{" "}
                      건
                    </div>
                  )}
                  <ArrowRightIcon className="text-gray-400" />
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

        {!user?.authorization?.is_translator && (
          <div className="flex flex-col gap-2">
            <div>
              <div className="text-xl font-bold text-gray-800">
                혹시 통번역사신가요?
              </div>
              <div className="text-sm text-gray-600">
                통번역 대학원을 졸업하셨다면 등록하고 활동해보세요
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
                      <ArrowRightIcon className="text-gray-400" />
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <div>
            <div className="text-xl font-bold text-gray-800">회원정보</div>
            <div className="text-sm text-gray-600">
              회원정보를 수정하거나 플루언스 서비스를 탈퇴 할 수 있어요
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
                <ArrowRightIcon className="text-gray-400" />
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </Stack>
  );
}

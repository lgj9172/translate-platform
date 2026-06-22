"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BadgeCheckIcon,
  SendIcon,
  UserCogIcon,
  UserPlusIcon,
} from "lucide-react";
import Link from "next/link";
import { getTranslationsClient } from "@/apis/translations";
import { getUser } from "@/apis/user";
import PageHeader from "@/components/PageHeader";
import PageTitle from "@/components/PageTitle";
import { ActionIcon } from "@/components/ui/action-icon";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Center } from "@/components/ui/center";
import { Loader } from "@/components/ui/loader";
import TranslatorSection from "./_component/TranslatorSection";

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}

function MenuItem({
  href,
  icon,
  title,
  description,
  badge,
  disabled,
}: {
  href?: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: React.ReactNode;
  disabled?: boolean;
}) {
  const inner = (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
        disabled
          ? "bg-gray-50 border-gray-100 cursor-not-allowed"
          : "bg-white border-gray-100 hover:border-orange-200 hover:bg-orange-50 cursor-pointer"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
          disabled ? "bg-gray-100 text-gray-400" : "bg-orange-50 text-primary"
        }`}
      >
        {icon}
      </div>
      <div className="flex-1 flex flex-col gap-0.5">
        <span
          className={`font-medium text-sm ${disabled ? "text-gray-400" : "text-gray-900"}`}
        >
          {title}
        </span>
        <span className="text-xs text-gray-400">{description}</span>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {badge}
        {!disabled && <ArrowRightIcon className="w-4 h-4 text-gray-300" />}
      </div>
    </div>
  );

  if (disabled || !href) return inner;
  return <Link href={href}>{inner}</Link>;
}

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

  return (
    <div className="flex flex-col gap-0">
      <PageHeader>
        <div className="flex items-center gap-2">
          <ActionIcon variant="ghost" asChild>
            <Link href="/">
              <ArrowLeftIcon />
            </Link>
          </ActionIcon>
          <PageTitle>마이 페이지</PageTitle>
        </div>
      </PageHeader>

      <div className="flex flex-col gap-8 pt-4">
        {isLoadingUser && (
          <Center className="h-40">
            <Loader />
          </Center>
        )}
        {isErrorUser && (
          <Alert>
            <AlertDescription>
              회원 정보를 불러오는 중 오류가 발생했어요.
            </AlertDescription>
          </Alert>
        )}

        {/* 프로필 카드 */}
        {user && (
          <div className="relative rounded-2xl bg-gradient-to-br from-orange-50 to-white border border-orange-100 p-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 ring-2 ring-orange-200 ring-offset-2">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-xl bg-orange-100 text-primary">
                  {user.name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">
                    {user.name}
                  </span>
                  {user.authorization?.is_translator && (
                    <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      <BadgeCheckIcon className="w-3 h-3" />
                      인증 번역사
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-500">{user.email}</span>
                <span className="text-xs text-gray-400">
                  {user.authorization?.is_translator ? "번역사" : "고객"} 계정
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 번역사 서비스 섹션 */}
        {user?.authorization?.is_translator && <TranslatorSection />}

        {/* 번역 서비스 */}
        <div className="flex flex-col gap-3">
          <SectionHeader
            title="번역 서비스"
            description="요청한 번역 작업을 확인하세요"
          />
          <div className="flex flex-col gap-2">
            <MenuItem
              href="/my/requests"
              icon={<SendIcon className="w-5 h-5" />}
              title="보낸 번역 요청"
              description="내가 요청한 번역 현황을 확인하세요"
              badge={
                isLoadingTranslationRequest ? (
                  <Loader color="primary" size="sm" />
                ) : (
                  <span className="text-sm font-semibold text-primary">
                    {translationRequest?.length ?? 0}건
                  </span>
                )
              }
            />
          </div>
        </div>

        {/* 번역사 등록 유도 */}
        {!user?.authorization?.is_translator && user && (
          <div className="flex flex-col gap-3">
            <SectionHeader
              title="번역사이신가요?"
              description="통번역 대학원을 졸업하셨다면 등록하고 활동해보세요"
            />
            <MenuItem
              href="/my/translator"
              icon={<UserPlusIcon className="w-5 h-5" />}
              title="번역사 등록"
              description="번역사로 활동하고 싶다면 등록해주세요"
              badge={
                <span className="text-xs font-medium text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                  등록 필요
                </span>
              }
            />
          </div>
        )}

        {/* 회원 정보 */}
        <div className="flex flex-col gap-3">
          <SectionHeader
            title="회원 정보"
            description="회원정보를 수정하거나 서비스를 탈퇴할 수 있어요"
          />
          <MenuItem
            href="/my/withdraw"
            icon={<UserCogIcon className="w-5 h-5" />}
            title="회원 탈퇴"
            description="회원 탈퇴를 진행합니다"
          />
        </div>
      </div>
    </div>
  );
}

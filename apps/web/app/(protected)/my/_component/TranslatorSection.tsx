"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowRightIcon,
  BadgeCheckIcon,
  ClipboardListIcon,
  ReceiptIcon,
  SearchIcon,
  UserPenIcon,
} from "lucide-react";
import Link from "next/link";
import { getTranslationsTranslator } from "@/apis/translations";
import { getTranslatorQuotations } from "@/apis/translator";
import { Loader } from "@/components/ui/loader";

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

export default function TranslatorSection() {
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
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-lg font-bold text-gray-900">번역사 서비스</h2>
        <p className="text-sm text-gray-500">
          진행중인 작업을 확인하고 번역사 정보를 관리하세요.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <MenuItem
          href="/my/translator"
          icon={<UserPenIcon className="w-5 h-5" />}
          title="번역사 프로필"
          description="프로필, 경력, 포트폴리오를 관리하세요"
          badge={
            <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              <BadgeCheckIcon className="w-3 h-3" />
              인증됨
            </span>
          }
        />
        <MenuItem
          href="/market"
          icon={<SearchIcon className="w-5 h-5" />}
          title="새 번역 의뢰"
          description="견적을 낼 수 있는 번역 의뢰를 둘러보세요"
        />
        <MenuItem
          href="/my/work"
          icon={<ClipboardListIcon className="w-5 h-5" />}
          title="진행 중인 번역"
          description="수락한 번역 의뢰와 작업 현황을 확인하세요"
          badge={
            isLoadingTranslationResponse ? (
              <Loader color="primary" size="sm" />
            ) : (
              <span className="text-sm font-semibold text-primary">
                {translationResponse?.length ?? 0}건
              </span>
            )
          }
        />
        <MenuItem
          href="/my/translator/quotations"
          icon={<ReceiptIcon className="w-5 h-5" />}
          title="제출한 견적"
          description="고객에게 보낸 견적 현황을 확인하세요"
          badge={
            isLoadingTranslatorQuotations ? (
              <Loader color="primary" size="sm" />
            ) : (
              <span className="text-sm font-semibold text-primary">
                {translatorQuotations?.length ?? 0}건
              </span>
            )
          }
        />
      </div>
    </div>
  );
}

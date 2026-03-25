"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { getTranslationsTranslator } from "@/apis/translations";
import { getTranslatorQuotations } from "@/apis/translator";
import { Card } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";

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
    <div className="flex flex-col gap-2">
      <div>
        <div className="text-xl font-bold text-gray-800">통번역사 서비스</div>
        <div className="text-sm text-gray-600">
          진행중인 작업을 확인하고 통번역사 정보를 관리하세요.
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Link href="/my/translator">
          <Card>
            <div className="flex justify-between items-center py-2">
              <div className="flex flex-col">
                <span className="font-medium text-gray-800">번역사 정보 수정</span>
                <span className="text-sm text-gray-500">
                  번역사 정보를 수정해주세요
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-green-600 font-medium">인증됨</div>
                <ArrowRightIcon className="text-gray-400" />
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/my/translator/quotations">
          <Card>
            <div className="flex justify-between items-center py-2">
              <div className="flex flex-col">
                <span className="font-medium text-gray-800">보낸 견적 요청</span>
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
                <span className="font-medium text-gray-800">받은 번역 요청</span>
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
              <span className="font-medium text-gray-800">받은 통역 요청</span>
              <span className="text-sm text-gray-500">
                내에게 요청된 통역을 확인하세요
              </span>
            </div>
            <div className="text-gray-600 font-medium">서비스 제공 예정</div>
          </div>
        </Card>

        <Card className="bg-gray-200 opacity-50">
          <div className="flex justify-between items-center py-2">
            <div className="flex flex-col">
              <span className="font-medium text-gray-800">받은 감수 요청</span>
              <span className="text-sm text-gray-500">
                내에게 요청된 감수를 확인하세요
              </span>
            </div>
            <div className="text-gray-600 font-medium">서비스 제공 예정</div>
          </div>
        </Card>

        <Card className="bg-gray-200 opacity-50">
          <div className="flex justify-between items-center py-2">
            <div className="flex flex-col">
              <span className="font-medium text-gray-800">받은 공증 요청</span>
              <span className="text-sm text-gray-500">
                내에게 요청된 공증을 확인하세요
              </span>
            </div>
            <div className="text-gray-600 font-medium">서비스 제공 예정</div>
          </div>
        </Card>
      </div>
    </div>
  );
}

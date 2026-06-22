"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getTranslations } from "@/apis/translations";
import PageHeader from "@/components/PageHeader";
import PageTitle from "@/components/PageTitle";
import TranslationCard from "@/components/TranslationCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Center } from "@/components/ui/center";
import { Loader } from "@/components/ui/loader";
import { Stack } from "@/components/ui/stack";
import useUser from "@/hooks/useUser";

export default function Page() {
  const router = useRouter();
  const { user, isLoading: isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && !user?.authorization?.is_translator) {
      router.replace("/my/requests");
    }
  }, [isUserLoading, user, router]);

  const {
    data: translations,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["translations", { status: "QUOTE_SENT" }],
    queryFn: () =>
      getTranslations({
        params: { start: 0, size: 100, status: "QUOTE_SENT" },
      }),
    enabled: !!user?.authorization?.is_translator,
  });

  return (
    <Stack>
      <PageHeader>
        <PageTitle>새 번역 의뢰</PageTitle>
      </PageHeader>
      {isLoading && (
        <Center className="h-[500px]">
          <Loader />
        </Center>
      )}
      {isError && (
        <Alert>
          <AlertDescription>
            번역 요청 목록을 불러오는 중 오류가 발생했어요.
          </AlertDescription>
        </Alert>
      )}
      {translations?.length === 0 && (
        <Alert>
          <AlertDescription>아직 번역 요청이 없어요.</AlertDescription>
        </Alert>
      )}
      {translations?.length !== 0 && (
        <div className="flex flex-col gap-[8px]">
          {translations?.map((translation) => (
            <Link
              className="hover:cursor-pointer"
              href={`/market/${translation.translation_id}`}
              key={translation.translation_id}
            >
              <TranslationCard
                key={translation.translation_id}
                translation={translation}
              />
            </Link>
          ))}
        </div>
      )}
    </Stack>
  );
}

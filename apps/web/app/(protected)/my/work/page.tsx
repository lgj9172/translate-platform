"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { getTranslationsTranslator } from "@/apis/translations";
import PageHeader from "@/components/PageHeader";
import PageTitle from "@/components/PageTitle";
import TranslationCard from "@/components/TranslationCard";
import { ActionIcon } from "@/components/ui/action-icon";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Center } from "@/components/ui/center";
import { Group } from "@/components/ui/group";
import { Loader } from "@/components/ui/loader";
import { Stack } from "@/components/ui/stack";

export default function Page() {
  const {
    data: translations,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["translations", "translator"],
    queryFn: () =>
      getTranslationsTranslator({ params: { start: 0, size: 100 } }),
  });

  return (
    <Stack>
      <PageHeader>
        <Group>
          <ActionIcon variant="ghost" asChild>
            <Link href="/my">
              <ArrowLeftIcon />
            </Link>
          </ActionIcon>
          <PageTitle>진행 중인 번역</PageTitle>
        </Group>
      </PageHeader>
      {isLoading && (
        <Center className="h-[500px]">
          <Loader />
        </Center>
      )}
      {isError && (
        <Alert>
          <AlertDescription>
            진행 중인 번역 목록을 불러오는 중 오류가 발생했어요.
          </AlertDescription>
        </Alert>
      )}
      {translations?.length === 0 && (
        <Alert>
          <AlertDescription>아직 진행 중인 번역이 없어요.</AlertDescription>
        </Alert>
      )}
      {translations?.length !== 0 && (
        <div className="flex flex-col gap-[8px]">
          {translations?.map((translation) => (
            <Link
              className="hover:cursor-pointer"
              href={`/my/work/${translation.translation_id}`}
              key={translation.translation_id}
            >
              <TranslationCard
                key={translation.translation_id}
                translation={translation}
                showStatus
              />
            </Link>
          ))}
        </div>
      )}
    </Stack>
  );
}

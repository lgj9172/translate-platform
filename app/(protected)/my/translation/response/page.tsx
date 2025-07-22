"use client";

import { getTranslationsTranslator } from "@/apis/translations";
import Alert from "@/components/Alert";
import PageHeader from "@/components/PageHeader";
import PageTitle from "@/components/PageTitle";
import TranslationCard from "@/components/TranslationCard";
import { ActionIcon } from "@/components/ui/action-icon";
import { Center } from "@/components/ui/center";
import { Group } from "@/components/ui/group";
import { Loader } from "@/components/ui/loader";
import { Stack } from "@/components/ui/stack";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export default function Page() {
  const {
    data: translationsResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["translations", "translator"],
    queryFn: () =>
      getTranslationsTranslator({ params: { start: 0, size: 10 } }),
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
          <PageTitle>받은 번역 요청</PageTitle>
        </Group>
      </PageHeader>
      {isLoading && (
        <Center className="h-[500px]">
          <Loader />
        </Center>
      )}
      {isError && (
        <Alert>받은 번역 요청 목록을 불러오는 중 오류가 발생했어요.</Alert>
      )}
      {translationsResponse?.length === 0 && (
        <Alert>아직 받은 번역 요청이 없어요.</Alert>
      )}
      {translationsResponse?.length !== 0 && (
        <div className="flex flex-col gap-[8px]">
          {translationsResponse?.map((translation) => (
            <Link
              className="hover:cursor-pointer"
              href={`/translation/${translation.translation_id}`}
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

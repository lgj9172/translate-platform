"use client";

import { getTranslations } from "@/apis/translations";
import Alert from "@/components/Alert";
import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";
import PageTitle from "@/components/PageTitle";
import TranslationCard from "@/components/TranslationCard";
import { Center, Group, Loader, Stack } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function Page() {
  const {
    data: translations,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["translations"],
    queryFn: () => getTranslations({ params: { start: 1, size: 100 } }),
  });

  return (
    <Stack>
      <PageHeader>
        <Group justify="space-between">
          <PageTitle>번역</PageTitle>
          <Group>
            <Link href="/translation/create">
              <Button variant="primary" size="sm">
                번역요청하기
              </Button>
            </Link>
          </Group>
        </Group>
      </PageHeader>
      {isLoading && (
        <Center mih="320px">
          <Loader color="orange" type="bars" />
        </Center>
      )}
      {isError && (
        <Alert>번역 요청 목록을 불러오는 중 오류가 발생했어요.</Alert>
      )}
      {translations?.length === 0 && <Alert>아직 번역 요청이 없어요.</Alert>}
      {translations?.length !== 0 && (
        <div className="flex flex-col gap-[8px]">
          {translations?.map((translation) => (
            <Link
              className="hover:cursor-pointer"
              href={`/translation/${translation.translation_id}`}
              key={translation.translation_id}
            >
              <TranslationCard
                key={translation.translation_id}
                translation={translation}
                // showQuotations
              />
            </Link>
          ))}
        </div>
      )}
    </Stack>
  );
}

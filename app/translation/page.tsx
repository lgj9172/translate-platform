"use client";

import { getTranslations } from "@/apis/translations";
import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";
import PageTitle from "@/components/PageTitle";
import TranslationCard from "@/components/TranslationCard";
import { Center, Group, Loader, Stack } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function Page() {
  const { data: translations, isLoading } = useQuery({
    queryKey: ["translations"],
    queryFn: getTranslations,
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
      {isLoading ? (
        <Center mih="320px">
          <Loader color="orange" type="bars" />
        </Center>
      ) : (
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

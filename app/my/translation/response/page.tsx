"use client";

import { getTranslationsResponse } from "@/apis/translations";
import PageHeader from "@/components/PageHeader";
import PageTitle from "@/components/PageTitle";
import TranslationCard from "@/components/TranslationCard";
import { ActionIcon, Center, Group, Loader, Stack } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa6";

export default function Page() {
  const { data: translationsResponse, isLoading } = useQuery({
    queryKey: ["translations-request"],
    queryFn: getTranslationsResponse,
  });

  return (
    <Stack>
      <PageHeader>
        <Group>
          <ActionIcon
            variant="transparent"
            color="black"
            component={Link}
            href="/my"
          >
            <FaChevronLeft />
          </ActionIcon>
          <PageTitle>받은 번역 요청</PageTitle>
        </Group>
      </PageHeader>
      {isLoading ? (
        <Center mih="320px">
          <Loader color="orange" type="bars" />
        </Center>
      ) : (
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

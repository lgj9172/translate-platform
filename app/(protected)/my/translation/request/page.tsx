"use client";

import { getTranslationsClient } from "@/apis/translations";
import Alert from "@/components/Alert";
import PageHeader from "@/components/PageHeader";
import PageTitle from "@/components/PageTitle";
import TranslationCard from "@/components/TranslationCard";
import { ActionIcon, Center, Group, Loader, Stack } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa6";

export default function Page() {
  const {
    data: translationsRequest,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["translations", "client"],
    queryFn: () => getTranslationsClient({ params: { start: 0, size: 10 } }),
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
          <PageTitle>보낸 번역 요청</PageTitle>
        </Group>
      </PageHeader>
      {isLoading && (
        <Center mih="320px">
          <Loader color="orange" type="bars" />
        </Center>
      )}
      {isError && (
        <Alert>보낸 번역 요청 목록을 불러오는 중 오류가 발생했어요.</Alert>
      )}
      {translationsRequest?.length === 0 && (
        <Alert>아직 보낸 번역 요청이 없어요.</Alert>
      )}
      {translationsRequest?.length !== 0 && (
        <div className="flex flex-col gap-[8px]">
          {translationsRequest?.map((translation) => (
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

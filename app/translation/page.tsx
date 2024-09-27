"use client";

import { getTranslations } from "@/apis/translations";
import PageHeader from "@/components/PageHeader";
import PageTitle from "@/components/PageTitle";
import TranslationCard from "@/components/TranslationCard";
import { Button, Center, Group, Loader, Stack } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function Page() {
  const { data: translations, isLoading } = useQuery({
    queryKey: ["translations"],
    queryFn: getTranslations,
  });

  return (
    <Stack gap={16}>
      <PageHeader>
        <Group justify="space-between">
          <PageTitle>번역</PageTitle>
          <Group>
            {/* <Text c="gray" size="xs">
              전체 선택됨(미구현)
            </Text>
            <ActionIcon variant="light" color="gray" disabled>
              <MdFilterList />
            </ActionIcon> */}
            <Button
              component={Link}
              href="/translation/create"
              color="orange"
              size="xs"
            >
              번역요청하기
            </Button>
          </Group>
        </Group>
      </PageHeader>
      {isLoading ? (
        <Center h="320px">
          <Loader color="orange" type="bars" />
        </Center>
      ) : (
        <div className="flex flex-col gap-[8px]">
          {translations?.map((translation) => (
            <Link
              className="hover:cursor-pointer"
              href={`/translation/${translation.translation_id}`}
            >
              <TranslationCard
                key={translation.translation_id}
                translation={translation}
                showQuotations
              />
            </Link>
          ))}
          {/* {translations?.flatMap((translation, index) =>
            index < translations.length - 1
              ? [
                  <Link
                    className="hover:cursor-pointer"
                    href={`/translation/${translation.translation_id}`}
                  >
                    <TranslationCard
                      key={translation.translation_id}
                      translation={translation}
                    />
                  </Link>,
                  <hr />,
                ]
              : [
                  <Link
                    className="hover:cursor-pointer"
                    href={`/translation/${translation.translation_id}`}
                  >
                    <TranslationCard
                      key={translation.translation_id}
                      translation={translation}
                    />
                  </Link>,
                ],
          )} */}
        </div>
      )}
    </Stack>
  );
}

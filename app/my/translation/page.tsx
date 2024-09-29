"use client";

import PageHeader from "@/components/PageHeader";
import PageTitle from "@/components/PageTitle";
import { ActionIcon, Center, Group, Loader, Stack } from "@mantine/core";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import { getTranslations } from "@/apis/translations";
import TranslationCard from "@/components/TranslationCard";

export default function Page() {
  const { data: translations, isLoading } = useQuery({
    queryKey: ["translations"],
    queryFn: getTranslations,
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
          <PageTitle>내 번역 요청</PageTitle>
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
            >
              <TranslationCard
                key={translation.translation_id}
                translation={translation}
                showStatus
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
      {/* <Tabs color="orange" variant="pills" defaultValue="before">
        <Tabs.List mb="md">
          <Tabs.Tab value="before">번역 전</Tabs.Tab>
          <Tabs.Tab value="ongoing">번역 진행 중</Tabs.Tab>
          <Tabs.Tab value="finished">번역 종료</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="before">
          <Before />
        </Tabs.Panel>

        <Tabs.Panel value="ongoing">
          <Ongoing />
        </Tabs.Panel>

        <Tabs.Panel value="finished">
          <Finished />
        </Tabs.Panel>
      </Tabs> */}
    </Stack>
  );
}

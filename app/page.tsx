"use client";

import { getTranslations } from "@/apis/translations";
import MantineTranslationCard from "@/components/MantineTranslationCard";
import PageHeader from "@/components/PageHeader";
import {
  ActionIcon,
  Button,
  Center,
  Group,
  Loader,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { AiOutlinePlus } from "react-icons/ai";
import { MdFilterList } from "react-icons/md";

export default function Home() {
  const { data: translations, isLoading } = useQuery({
    queryKey: ["translations"],
    queryFn: getTranslations,
  });

  return (
    <Stack>
      <PageHeader>
        <Group justify="space-between">
          <Group>
            <Title>번역</Title>
          </Group>
          <Group>
            <Button
              component={Link}
              href="/translation/create"
              variant="light"
              color="orange"
              leftSection={<AiOutlinePlus size={14} />}
              size="xs"
            >
              번역요청
            </Button>
          </Group>
        </Group>
      </PageHeader>
      {isLoading ? (
        <Center h="320px">
          <Loader color="orange" type="bars" />
        </Center>
      ) : (
        <Stack>
          <Group gap={4} justify="end">
            <Text c="gray" size="xs">
              전체 선택됨(미구현)
            </Text>
            <ActionIcon variant="light" color="gray" disabled>
              <MdFilterList />
            </ActionIcon>
          </Group>
          {translations?.results?.map((translation) => (
            <MantineTranslationCard
              key={translation.id}
              translation={translation}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}

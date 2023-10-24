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

export default function Page() {
  const { data: translations, isLoading } = useQuery({
    queryKey: ["translations"],
    queryFn: getTranslations,
  });

  return (
    <Stack gap={16}>
      <Group justify="end" mb={-2}>
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
      <PageHeader>
        <Group justify="space-between">
          <Title>번역</Title>
          <Group gap={4} justify="end">
            <Text c="gray" size="xs">
              전체 선택됨(미구현)
            </Text>
            <ActionIcon variant="light" color="gray" disabled>
              <MdFilterList />
            </ActionIcon>
          </Group>
        </Group>
      </PageHeader>
      {isLoading ? (
        <Center h="320px">
          <Loader color="orange" type="bars" />
        </Center>
      ) : (
        <Stack>
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

"use client";

import { getCounsels } from "@/apis/counsels";
import Alert from "@/components/Alert";
import PageHeader from "@/components/PageHeader";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { ActionIcon, Center, Group, Loader, Stack } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa6";
import AskCard from "./_component/AskCard";

export default function Page() {
  const {
    data: asks,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["asks"],
    queryFn: () => getCounsels({ params: { start: 0, size: 10 } }),
  });

  return (
    <Stack>
      <PageHeader>
        <Group justify="space-between">
          <div className="flex items-center gap-2">
            <ActionIcon
              variant="transparent"
              color="black"
              component={Link}
              href="/cs"
            >
              <FaChevronLeft />
            </ActionIcon>
            <PageTitle>1:1 문의하기</PageTitle>
          </div>
          <Group>
            <Link href="/cs/ask/create">
              <Button size="sm">문의하기</Button>
            </Link>
          </Group>
        </Group>
      </PageHeader>

      {isLoading && (
        <Center mih="320px">
          <Loader color="orange" type="bars" />
        </Center>
      )}
      {isError && <Alert>문의 목록을 불러오는 중 오류가 발생했어요.</Alert>}
      {asks?.length === 0 && <Alert>아직 문의가 없어요.</Alert>}
      {asks?.length !== 0 && (
        <div className="flex flex-col gap-[8px]">
          {asks?.map((ask) => (
            <Link
              className="hover:cursor-pointer"
              href={`/cs/ask/${ask.counsel_id}`}
              key={ask.counsel_id}
            >
              <AskCard ask={ask} />
            </Link>
          ))}
        </div>
      )}
    </Stack>
  );
}

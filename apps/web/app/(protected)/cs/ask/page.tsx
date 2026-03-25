"use client";

import { getCounsels } from "@/apis/counsels";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PageHeader from "@/components/PageHeader";
import PageTitle from "@/components/PageTitle";
import { ActionIcon } from "@/components/ui/action-icon";
import { Button } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Group } from "@/components/ui/group";
import { Loader } from "@/components/ui/loader";
import { Stack } from "@/components/ui/stack";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
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
        <Group justify="between">
          <div className="flex items-center gap-2">
            <ActionIcon variant="ghost" asChild>
              <Link href="/cs">
                <ArrowLeftIcon />
              </Link>
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
        <Center className="h-[500px]">
          <Loader />
        </Center>
      )}
      {isError && (
        <Alert>
          <AlertDescription>
            문의 목록을 불러오는 중 오류가 발생했어요.
          </AlertDescription>
        </Alert>
      )}
      {asks?.length === 0 && (
        <Alert>
          <AlertDescription>아직 문의가 없어요.</AlertDescription>
        </Alert>
      )}
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

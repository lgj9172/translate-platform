"use client";

import { getNotices } from "@/apis/notices";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PageHeader from "@/components/PageHeader";
import PageTitle from "@/components/PageTitle";
import { ActionIcon } from "@/components/ui/action-icon";
import { Center } from "@/components/ui/center";
import { Group } from "@/components/ui/group";
import { Loader } from "@/components/ui/loader";
import { Stack } from "@/components/ui/stack";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import NoticeCard from "./_component/NoticeCard";

export default function Page() {
  const {
    data: notices,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["notices"],
    queryFn: () => getNotices({ params: { start: 0, size: 10 } }),
  });

  return (
    <Stack>
      <PageHeader>
        <Group>
          <ActionIcon variant="ghost" asChild>
            <Link href="/cs">
              <ArrowLeftIcon />
            </Link>
          </ActionIcon>
          <PageTitle>공지사항</PageTitle>
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
            공지사항을 불러오는 중 오류가 발생했어요.
          </AlertDescription>
        </Alert>
      )}
      {notices?.length === 0 && (
        <Alert>
          <AlertDescription>아직 공지사항이 없어요.</AlertDescription>
        </Alert>
      )}
      {notices?.length !== 0 && (
        <div className="flex flex-col gap-[8px]">
          {notices?.map((notice) => (
            <Link
              className="hover:cursor-pointer"
              href={`/cs/notice/${notice.notice_id}`}
              key={notice.notice_id}
            >
              <NoticeCard key={notice.notice_id} notice={notice} />
            </Link>
          ))}
        </div>
      )}
    </Stack>
  );
}

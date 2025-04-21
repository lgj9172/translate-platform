"use client";

import { getNotices } from "@/apis/notices";
import PageHeader from "@/components/PageHeader";
import PageTitle from "@/components/PageTitle";
import { ActionIcon, Center, Group, Loader, Stack } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa6";
import Alert from "@/components/Alert";
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
          <ActionIcon
            variant="transparent"
            color="black"
            component={Link}
            href="/cs"
          >
            <FaChevronLeft />
          </ActionIcon>
          <PageTitle>공지사항</PageTitle>
        </Group>
      </PageHeader>
      {isLoading && (
        <Center mih="320px">
          <Loader color="orange" type="bars" />
        </Center>
      )}
      {isError && <Alert>공지사항을 불러오는 중 오류가 발생했어요.</Alert>}
      {notices?.length === 0 && <Alert>아직 공지사항이 없어요.</Alert>}
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

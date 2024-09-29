"use client";

import { getNotices } from "@/apis/notices";
import PageHeader from "@/components/PageHeader";
import PageTitle from "@/components/PageTitle";
import { ActionIcon, Center, Group, Loader, Stack } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa6";
import NoticeCard from "./_component/NoticeCard";

export default function Page() {
  const { data: notices, isLoading } = useQuery({
    queryKey: ["notices"],
    queryFn: getNotices,
  });

  return (
    <Stack>
      <PageHeader>
        <Group>
          <ActionIcon
            variant="transparent"
            color="black"
            component={Link}
            href="/"
          >
            <FaChevronLeft />
          </ActionIcon>
          <PageTitle>공지사항</PageTitle>
        </Group>
      </PageHeader>

      {isLoading ? (
        <Center mih="320px">
          <Loader color="orange" type="bars" />
        </Center>
      ) : (
        <div className="flex flex-col gap-[8px]">
          {notices?.map((notice) => (
            <Link
              className="hover:cursor-pointer"
              href={`/notice/${notice.notice_id}`}
            >
              <NoticeCard
                key={notice.notice_id}
                notice={notice}
                // showQuotations
              />
            </Link>
          ))}
        </div>
      )}
    </Stack>
  );
}

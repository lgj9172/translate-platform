"use client";

import { getNotice } from "@/apis/notices";
import Badge from "@/components/Badge";
import Card from "@/components/Card";
import PageHeader from "@/components/PageHeader";
import PageTitle from "@/components/PageTitle";
import {
  ActionIcon,
  Avatar,
  Center,
  Group,
  Loader,
  Stack,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaChevronLeft } from "react-icons/fa6";

export default function Page() {
  const { noticeId } = useParams<{ noticeId: string }>();

  const { data: notice, isLoading } = useQuery({
    queryKey: ["notice", noticeId],
    queryFn: () => getNotice({ noticeId }),
  });

  if (isLoading)
    return (
      <Center mih="320px">
        <Loader color="orange" type="bars" />
      </Center>
    );

  if (!notice) return null;

  return (
    <Stack>
      <PageHeader>
        <Group>
          <ActionIcon
            variant="transparent"
            color="black"
            component={Link}
            href="/cs/notice"
          >
            <FaChevronLeft />
          </ActionIcon>

          <PageTitle>
            {notice.is_important && <Badge>중요</Badge>}
            {notice.title}
          </PageTitle>
        </Group>
      </PageHeader>
      <Card>
        <div className="flex gap-[8px]">
          <Avatar />
          <div>
            <div className="text-[14px] text-[#4B4D4D]">플루언스</div>
            <div className="text-[14px] text-[#8B8C8D]">
              {dayjs(notice.created_at).format("YYYY.MM.DD")}
            </div>
          </div>
        </div>
      </Card>
      <div className="min-h-[320px]">
        {notice.description.split("\n").map((line, index) => (
          <p key={`${line}-${index}`}>{line}</p>
        ))}
      </div>
    </Stack>
  );
}

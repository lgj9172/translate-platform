"use client";

import { getNotice } from "@/apis/notices";
import PageHeader from "@/components/PageHeader";
import PageTitle from "@/components/PageTitle";
import { ActionIcon } from "@/components/ui/action-icon";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Center } from "@/components/ui/center";
import { Group } from "@/components/ui/group";
import { Loader } from "@/components/ui/loader";
import { Stack } from "@/components/ui/stack";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function Page() {
  const { noticeId } = useParams<{ noticeId: string }>();

  const { data: notice, isLoading } = useQuery({
    queryKey: ["notice", noticeId],
    queryFn: () => getNotice({ noticeId }),
  });

  if (isLoading)
    return (
      <Center className="h-[500px]">
        <Loader />
      </Center>
    );

  if (!notice) return null;

  return (
    <Stack>
      <PageHeader>
        <Group>
          <ActionIcon variant="ghost" asChild>
            <Link href="/cs/notice">
              <ArrowLeftIcon />
            </Link>
          </ActionIcon>

          <PageTitle>
            {notice.is_important && <Badge variant="default">중요</Badge>}
            {notice.title}
          </PageTitle>
        </Group>
      </PageHeader>
      <Card>
        <div className="flex gap-[8px]">
          <Avatar>
            <AvatarFallback className="text-primary-foreground bg-primary">
              플
            </AvatarFallback>
          </Avatar>
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

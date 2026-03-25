"use client";

import { getCounsel } from "@/apis/counsels";
import { getFile } from "@/apis/files";
import { getUser } from "@/apis/user";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import PageHeader from "@/components/PageHeader";
import PageTitle from "@/components/PageTitle";
import { ActionIcon } from "@/components/ui/action-icon";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Center } from "@/components/ui/center";
import { Group } from "@/components/ui/group";
import { Loader } from "@/components/ui/loader";
import { Stack } from "@/components/ui/stack";
import { useFileDownload } from "@/hooks/useFileDownload";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import CSAnswer from "./_component/CSAnswer";

export default function Page() {
  const { askId } = useParams<{ askId: string }>();

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(),
  });

  const { data: ask, isLoading } = useQuery({
    queryKey: ["ask", askId],
    queryFn: () => getCounsel({ counselId: askId }),
  });

  const { data: file } = useQuery({
    queryKey: ["file", ask?.file_id],
    queryFn: () => getFile({ fileId: ask?.file_id ?? "" }),
    enabled: !!ask?.file_id,
  });

  const { downloadFile } = useFileDownload();

  if (isLoading)
    return (
      <Center className="h-[500px]">
        <Loader />
      </Center>
    );

  if (!ask) return null;

  return (
    <Stack>
      <PageHeader>
        <Group>
          <ActionIcon variant="ghost" asChild>
            <Link href="/cs/ask">
              <ArrowLeftIcon />
            </Link>
          </ActionIcon>
          <PageTitle>
            <Badge variant="default">
              {ask.is_done ? "답변완료" : "답변대기"}
            </Badge>
            {ask.category}
          </PageTitle>
        </Group>
      </PageHeader>
      <Card>
        <div className="flex gap-[8px]">
          <Avatar />
          <div>
            <div className="text-[14px] text-[#4B4D4D]">{user?.nickname}</div>
            <div className="text-[14px] text-[#8B8C8D]">
              {dayjs(ask.created_at).format("YYYY.MM.DD")}
            </div>
          </div>
        </div>
      </Card>
      <InputSection>
        <LabelSection>
          <Label>문의 ID</Label>
        </LabelSection>
        <div>{ask.counsel_id}</div>
      </InputSection>
      <InputSection>
        <LabelSection>
          <Label>종류</Label>
        </LabelSection>
        <div>{ask.category}</div>
      </InputSection>
      <InputSection>
        <LabelSection>
          <Label>내용</Label>
        </LabelSection>
        <div>
          {ask.content.split("\n").map((line: string, index: number) => (
            <div key={`${line}-${index}`}>{line}</div>
          ))}
        </div>
      </InputSection>
      <InputSection>
        <LabelSection>
          <Label>첨부파일</Label>
        </LabelSection>
        <div>
          {file ? (
            <button
              type="button"
              className="inline text-[#3B82F6] font-bold"
              onClick={() => {
                if (file?.presigned_url) {
                  downloadFile(file.presigned_url, file.name);
                }
              }}
            >
              {file?.name}
            </button>
          ) : (
            <div>첨부파일이 없습니다.</div>
          )}
        </div>
      </InputSection>
      <CSAnswer askId={askId} />
    </Stack>
  );
}

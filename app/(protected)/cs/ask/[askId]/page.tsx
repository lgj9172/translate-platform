"use client";

import { getCounsel } from "@/apis/counsels";
import { getUser } from "@/apis/user";
import Badge from "@/components/Badge";
import Card from "@/components/Card";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import PageHeader from "@/components/PageHeader";
import PageTitle from "@/components/PageTitle";
import { useFileDownload } from "@/hooks/useFileDownload";
import {
  ActionIcon,
  Avatar,
  Center,
  Group,
  Loader,
  Stack,
  Text,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa6";
import { getFile } from "@/apis/files";
import CSAnswer from "./_component/CSAnswer";

interface Props {
  params: { askId: string };
}

export default function Page({ params: { askId } }: Props) {
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
      <Center mih="320px">
        <Loader color="orange" type="bars" />
      </Center>
    );

  if (!ask) return null;

  return (
    <Stack>
      <PageHeader>
        <Group>
          <ActionIcon
            variant="transparent"
            color="black"
            component={Link}
            href="/cs/ask"
          >
            <FaChevronLeft />
          </ActionIcon>
          <PageTitle>
            <Badge>{ask.is_done ? "답변완료" : "답변대기"}</Badge>
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
        <Text>{ask.counsel_id}</Text>
      </InputSection>

      <InputSection>
        <LabelSection>
          <Label>종류</Label>
        </LabelSection>
        <Text>{ask.category}</Text>
      </InputSection>

      <InputSection>
        <LabelSection>
          <Label>내용</Label>
        </LabelSection>
        <div>
          {ask.content.split("\n").map((line: string, index: number) => (
            // eslint-disable-next-line react/no-array-index-key
            <Text key={index}>{line}</Text>
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
            <Text>첨부파일이 없습니다.</Text>
          )}
        </div>
      </InputSection>

      <CSAnswer askId={askId} />
    </Stack>
  );
}

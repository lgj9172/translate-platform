"use client";

import { getCSAsk } from "@/apis/cs";
import { getUser } from "@/apis/user";
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
import Badge from "@/components/Badge";
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
    queryFn: () => getCSAsk({ counselId: askId }),
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
            <Badge>{ask.status}</Badge>
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
          {ask.content.split("\n").map((line, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Text key={index}>{line}</Text>
          ))}
        </div>
      </InputSection>

      <InputSection>
        <LabelSection>
          <Label>첨부파일</Label>
        </LabelSection>
        {ask.files.map((file) => (
          <div key={file.file_id}>
            <button
              type="button"
              className="inline text-[#3B82F6] font-bold"
              onClick={() => {
                if (file.url) {
                  downloadFile(file.url, file.name);
                }
              }}
            >
              {file.name}
            </button>
          </div>
        ))}
      </InputSection>

      <CSAnswer askId={askId} />
    </Stack>
  );
}

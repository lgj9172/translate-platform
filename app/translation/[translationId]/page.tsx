"use client";

import { getTranslation } from "@/apis/translations";
import Badge from "@/components/Badge";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import PageHeader from "@/components/PageHeader";
import PageTitle from "@/components/PageTitle";
import { getCategoryLabel, getLanguageLabel } from "@/utils/converter/label";
import {
  ActionIcon,
  Avatar,
  Divider,
  Group,
  Input,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/ko"; // 필요한 언어 로케일을 불러옵니다.
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa6";

interface Props {
  params: { translationId: string };
}

export default function Page({ params: { translationId } }: Props) {
  const { data: translation } = useQuery({
    queryKey: ["translation", translationId],
    queryFn: () => getTranslation({ translationId }),
  });

  if (!translation) return null;

  return (
    <Stack w="full" h="full" gap={16}>
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
          <PageTitle>{translation.title}</PageTitle>
        </Group>
      </PageHeader>

      <Group justify="space-between">
        <Group gap={4}>
          <Badge color="black">
            {`${getLanguageLabel(translation.source_language)[0]}${
              getLanguageLabel(translation.target_language)[0]
            }`}
          </Badge>
          {translation.categories.map((category) => (
            <Badge key={category} color="blue">
              {getCategoryLabel(category)}
            </Badge>
          ))}
        </Group>
      </Group>
      <Paper p="xs">
        <Group>
          <Avatar src="avatar.png" />
          <Stack gap={0}>
            <Text>작성자</Text>
            <Text size="xs" c="gray">
              2023.09.21
            </Text>
          </Stack>
        </Group>
      </Paper>

      <Divider />

      <Stack>
        <InputSection>
          <LabelSection>
            <Label>세부 요청사항</Label>
          </LabelSection>
          <Text>{translation.description}</Text>
        </InputSection>

        <InputSection>
          <LabelSection>
            <Label>마감 기한</Label>
          </LabelSection>
          <Text>
            {dayjs(translation.deadline)
              .locale("ko")
              .format("YYYY.MM.DD A hh:mm")}
          </Text>
        </InputSection>

        {/* <Input.Wrapper>
          <Input.Label>분량</Input.Label>
          <Text c="gray">
            {translation.quantity.value} {translation.quantity.unit}{" "}
            {translation.quantity.blank ? "(공백 포함)" : "(공백 제외)"}
          </Text>
        </Input.Wrapper> */}

        <InputSection>
          <LabelSection>
            <Label>원문 샘플</Label>
          </LabelSection>

          <Text>
            <Link href={`/translation/${translationId}/sample`}>
              {translation.sample}
            </Link>
          </Text>
        </InputSection>

        {/* <Input.Wrapper>
          <Flex align="center">
            <Input.Label>원문 샘플</Input.Label>
            <Popover position="right" withArrow>
              <Popover.Target>
                <Input.Label>
                  <ActionIcon variant="transparent" color="gray">
                    <FaCircleQuestion />
                  </ActionIcon>
                </Input.Label>
              </Popover.Target>
              <Popover.Dropdown>
                <Text size="xs">
                  고객에게 견적이 선택되면 모든 내용을 볼 수 있어요.
                </Text>
              </Popover.Dropdown>
            </Popover>
          </Flex>
          <Text c="gray">{translation.sample}</Text>
        </Input.Wrapper> */}

        <Divider />

        <Input.Wrapper>
          <Stack gap={0}>
            <Input.Label>희망 번역료</Input.Label>
            <Text c="gray">
              <Text span c="orange" size="xl">
                {translation.fee_unit}
              </Text>{" "}
              {translation.fee_value}
            </Text>
          </Stack>
        </Input.Wrapper>

        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full max-w-[420px] h-[56px] bg-primary rounded-[8px] text-white font-bold"
          >
            견적 보내기
          </button>
        </div>
      </Stack>
    </Stack>
  );
}

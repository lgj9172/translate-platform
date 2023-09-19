"use client";

import { getTranslation } from "@/apis/translations";
import PageHeader from "@/components/PageHeader";
import { Stack, Text } from "@chakra-ui/react";
import { Divider, Input, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/ko"; // 필요한 언어 로케일을 불러옵니다.

interface Props {
  params: { translationId: string };
}

export default function Page({ params: { translationId } }: Props) {
  const { data: translation } = useQuery({
    queryKey: ["translation", translationId],
    queryFn: () => getTranslation({ translationId }),
  });

  console.log(translation);

  return (
    <Stack w="full" h="full" gap={16}>
      <PageHeader>
        <Title>{translation?.title}</Title>
      </PageHeader>

      <Stack>
        <Input.Wrapper>
          <Input.Label>세부 요청사항</Input.Label>
          <Text>{translation?.description}</Text>
        </Input.Wrapper>

        <Input.Wrapper>
          <Input.Label>분량</Input.Label>
          <Text>
            {translation?.quantity.value} {translation?.quantity.unit}{" "}
            {translation?.quantity.blank ? "(공백 포함)" : "(공백 제외)"}
          </Text>
        </Input.Wrapper>

        <Input.Wrapper>
          <Input.Label>마감기한</Input.Label>
          <Text>
            {dayjs(translation?.end_time)
              .locale("ko")
              .format("YYYY.MM.DD A hh:mm")}
          </Text>
        </Input.Wrapper>

        <Input.Wrapper>
          <Input.Label>원문 샘플</Input.Label>
          <Input.Description>
            고객이 견적을 선택하면 풀버전을 볼 수 있어요.
          </Input.Description>
          <Text>{translation?.sample}</Text>
        </Input.Wrapper>

        <Divider />

        <Input.Wrapper>
          <Input.Label>희망 번역료</Input.Label>
          <Text>
            {translation?.desired_fee.value} {translation?.desired_fee.unit}
          </Text>
        </Input.Wrapper>
      </Stack>
    </Stack>
  );
}

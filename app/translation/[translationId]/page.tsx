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
  Center,
  Divider,
  Group,
  Loader,
  Stack,
  Text,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/ko"; // 필요한 언어 로케일을 불러옵니다.
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa6";
import { NumericFormat } from "react-number-format";

interface Props {
  params: { translationId: string };
}

export default function Page({ params: { translationId } }: Props) {
  const { data: translation, isLoading } = useQuery({
    queryKey: ["translation", translationId],
    queryFn: () => getTranslation({ translationId }),
  });

  const handleClickDownload = async (url: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <Center mih="320px">
        <Loader color="orange" type="bars" />
      </Center>
    );
  }

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
      <div className="flex gap-[8px]">
        <Avatar src="avatar.png" />
        <div>
          <div className="text-[14px] text-[#4B4D4D]">작성자</div>
          <div className="text-[14px] text-[#8B8C8D]">작성일</div>
        </div>
      </div>

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
            <Label>원문</Label>
          </LabelSection>

          {translation.source_files.map(
            ({ char_with_blank, file, source_file_id }) => (
              <div key={source_file_id}>
                <button
                  type="button"
                  onClick={() => handleClickDownload(file.url, file.name)}
                >
                  <span>{file.name}</span>
                </button>
                <span className="text-[#8B8C8D]">
                  {" "}
                  (공백 포함{" "}
                  <NumericFormat
                    displayType="text"
                    value={char_with_blank}
                    thousandsGroupStyle="thousand"
                    thousandSeparator=","
                  />
                  자)
                </span>
              </div>
            ),
          )}
        </InputSection>

        <InputSection>
          <LabelSection>
            <Label>원문 샘플</Label>
          </LabelSection>

          <div>{translation.sample}</div>
        </InputSection>
        <Divider />

        <InputSection>
          <LabelSection>
            <Label>희망 번역료</Label>
          </LabelSection>

          <div className="flex text-primary font-bold text-[16px]">
            <span>
              <NumericFormat
                displayType="text"
                value={translation.fee_value}
                thousandsGroupStyle="thousand"
                thousandSeparator=","
              />
            </span>
            <span>
              {translation.fee_unit === "KRW" && "원"}
              {translation.fee_unit === "USD" && "달러"}
            </span>
          </div>
        </InputSection>

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

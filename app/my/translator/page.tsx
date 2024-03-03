"use client";

import { Language } from "@/apis/translations";
// import { Category } from "@/apis/translations";
import PageHeader from "@/components/PageHeader";
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Center,
  Chip,
  FileInput,
  Group,
  Input,
  SegmentedControl,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { DatePickerInput, MonthPickerInput } from "@mantine/dates";
import Link from "next/link";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaArrowDown, FaArrowLeft } from "react-icons/fa6";

export default function Page() {
  const languageOptions = useMemo<
    { label: string; value: (typeof Language)[number] | "" }[]
  >(
    () => [
      { label: "한국어", value: "ko-KR" },
      { label: "영어", value: "en-US" },
      { label: "일본어", value: "ja-JP" },
    ],
    [],
  );

  const categoryOptions = useMemo(
    () => [
      { label: "IT/기술", value: "IT" },
      { label: "경제/금융", value: "FINANCE" },
      { label: "콘텐츠 자막", value: "CONTENTS" },
      { label: "게임", value: "GAME" },
      { label: "법률/특허", value: "LAW" },
      { label: "의료", value: "MEDICAL" },
      { label: "건설", value: "CONSTRUCTION" },
      { label: "마케팅", value: "MARKETING" },
      { label: "문학", value: "LITERATURE" },
      { label: "기타", value: "ETC" },
    ],
    [],
  );

  const {
    control,
    register,
    trigger,
    formState: { isSubmitting },
  } = useForm();

  return (
    <Stack>
      <Group>
        <ActionIcon
          variant="transparent"
          color="black"
          component={Link}
          href="/my"
        >
          <FaArrowLeft />
        </ActionIcon>
      </Group>

      <PageHeader>
        <Title>번역사 정보</Title>
      </PageHeader>

      <Stack gap="xs">
        <Group justify="space-between">
          <Title size="sm">전문 분야</Title>
          <Group />
        </Group>
        <Controller
          name="categories"
          control={control}
          render={({ field: { ...field }, fieldState: { error } }) => (
            <Input.Wrapper labelProps={{}} error={error?.message}>
              <Chip.Group {...field} multiple>
                <Group mt={5} mb={5} gap="xs">
                  {categoryOptions.map((c) => (
                    <Chip
                      key={c.value}
                      value={c.value}
                      color="orange"
                      variant="outline"
                    >
                      {c.label}
                    </Chip>
                  ))}
                </Group>
              </Chip.Group>
            </Input.Wrapper>
          )}
        />
      </Stack>

      <Stack gap="xs">
        <Group justify="space-between">
          <Title size="sm">자기소개</Title>
          <Group />
        </Group>
        <Textarea
          minRows={3}
          autosize
          color="orange"
          {...register("description")}
          placeholder="본인에 대한 간단한 소개를 입력하세요."
        />
      </Stack>

      <Stack gap="xs">
        <Group justify="space-between">
          <Title size="sm">학력</Title>
          <Group>
            <Button size="xs" variant="subtle">
              추가
            </Button>
          </Group>
        </Group>
        <Card component={Stack} withBorder gap="xs">
          <Title size="lg">년월</Title>
          <Group>
            <Box flex={1}>
              <MonthPickerInput
                type="range"
                valueFormat="YYYY년 MM월"
                placeholder="입학년월 및 졸업년월"
              />
            </Box>
            <SegmentedControl data={["졸업", "수료", "재학"]} size="sm" />
          </Group>
          <TextInput placeholder="학교 이름" />
          <TextInput placeholder="전공" />
          <FileInput placeholder="졸업증명서" />
        </Card>
      </Stack>

      <Stack gap="xs">
        <Group justify="space-between">
          <Title size="sm">경력</Title>
          <Group>
            <Button size="xs" variant="subtle">
              추가
            </Button>
          </Group>
        </Group>
        <Card component={Stack} withBorder gap="xs">
          <Group>
            <Box flex={1}>
              <DatePickerInput
                type="range"
                valueFormat="YYYY년 MM월 DD일"
                placeholder="입사일시 및 퇴사일시"
              />
            </Box>
            <SegmentedControl data={["퇴사", "재직중"]} size="sm" />
          </Group>
          <TextInput placeholder="직장 이름" />
          <TextInput placeholder="성과" />
          <FileInput placeholder="경력증명서 또는 재직증명서" />
        </Card>
      </Stack>

      <Stack gap="xs">
        <Group justify="space-between">
          <Title size="sm">자격증(선택)</Title>
          <Group>
            <Button size="xs" variant="subtle">
              추가
            </Button>
          </Group>
        </Group>
        <Card component={Stack} withBorder gap="xs">
          <Group>
            <Box flex={1}>
              <DatePickerInput
                valueFormat="YYYY년 MM월 DD일"
                placeholder="자격증 발급일시"
              />
            </Box>
          </Group>
          <TextInput placeholder="자격증 이름" />
          <FileInput placeholder="자격증 사본" />
        </Card>
      </Stack>

      <Stack gap="xs">
        <Group justify="space-between">
          <Title size="sm">번역 샘플(선택)</Title>
          <Group>
            <Button size="xs" variant="subtle">
              추가
            </Button>
          </Group>
        </Group>
        <Card component={Stack} withBorder gap="xs">
          <Controller
            name="sourceLanguage"
            control={control}
            render={({ field: { onChange, ...field } }) => (
              <Select
                {...field}
                w={120}
                data={languageOptions}
                onChange={(v) => {
                  onChange(v as (typeof Language)[0]);
                  trigger("targetLanguage");
                }}
                allowDeselect={false}
                checkIconPosition="right"
              />
            )}
          />
          <Textarea
            minRows={3}
            autosize
            color="orange"
            {...register("description")}
            placeholder="번역 샘플 원문"
          />
          <Center>
            <Text c="orange">
              <FaArrowDown />
            </Text>
          </Center>
          <Controller
            name="targetLanguage"
            control={control}
            render={({ field: { onChange, ...field } }) => (
              <Select
                {...field}
                w={120}
                data={languageOptions}
                onChange={(v) => {
                  onChange(v as (typeof Language)[0]);
                  trigger("sourceLanguage");
                }}
                allowDeselect={false}
                checkIconPosition="right"
              />
            )}
          />
          <Textarea
            minRows={3}
            autosize
            color="orange"
            {...register("description")}
            placeholder="번역 샘플 결과"
          />
        </Card>
      </Stack>

      <Group justify="end">
        <Button type="submit" loading={isSubmitting} color="orange">
          저장
        </Button>
      </Group>
    </Stack>
  );
}

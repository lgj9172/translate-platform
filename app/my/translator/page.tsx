"use client";

// import { Category } from "@/apis/translations";
import PageHeader from "@/components/PageHeader";
import {
  PostTranslatorFormDefaultValue,
  PostTranslatorFormSchema,
} from "@/model/translator";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionIcon, Group, Stack, Title } from "@mantine/core";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";
import { FaArrowLeft } from "react-icons/fa6";
import Career from "./_component/Career";
import Educations from "./_component/Educations";
import SelfIntroduction from "./_component/SelfIntroduction";
import Speciality from "./_component/Speciality";

export default function Page() {
  // const languageOptions = useMemo<
  //   { label: string; value: (typeof Language)[number] }[]
  // >(
  //   () => [
  //     { label: "한국어", value: "ko-KR" },
  //     { label: "영어", value: "en-US" },
  //     { label: "일본어", value: "ja-JP" },
  //   ],
  //   [],
  // );

  const methods = useForm({
    resolver: zodResolver(PostTranslatorFormSchema),
    defaultValues: PostTranslatorFormDefaultValue,
    mode: "onChange",
  });

  return (
    <FormProvider {...methods}>
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

        <Stack gap={40}>
          <Speciality />
          <SelfIntroduction />
          <Educations />
          <Career />
        </Stack>

        {/* <Stack gap="xs">
        <Group justify="space-between">
          <Title order={4}>자격증(선택)</Title>
          <Group>
            <Button size="xs" variant="subtle">
              추가
            </Button>
          </Group>
        </Group>
        <Card component={Stack} withBorder gap="xs">
          <Group justify="end">
            <Button size="xs" color="red" variant="subtle">
              삭제
            </Button>
          </Group>
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
      </Stack> */}

        {/* <Stack gap="xs">
        <Group justify="space-between">
          <Title order={4}>번역 샘플(선택)</Title>
          <Group>
            <Button size="xs" variant="subtle">
              추가
            </Button>
          </Group>
        </Group>
        <Card component={Stack} withBorder gap="xs">
          <Group justify="end">
            <Button size="xs" color="red" variant="subtle">
              삭제
            </Button>
          </Group>
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
      </Stack> */}

        {/* <Group justify="end">
          <Button type="submit" loading={isSubmitting} color="orange">
            저장
          </Button>
        </Group> */}
      </Stack>
    </FormProvider>
  );
}

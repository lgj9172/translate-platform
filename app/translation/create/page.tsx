"use client";

import {
  Category,
  Language,
  postTranslation,
  postTranslationFile,
} from "@/apis/translations";
import Speciality from "@/app/my/translator/_component/Speciality";
import ErrorText from "@/components/ErrorText";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import PageHeader from "@/components/PageHeader";
import PageTitle from "@/components/PageTitle";
import SelectBox from "@/components/SelectBox";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActionIcon,
  Button,
  FileInput,
  Group,
  Input,
  NumberInput,
  SegmentedControl,
  Stack,
  TextInput,
  Textarea,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef } from "react";
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { FaArrowRight, FaChevronLeft, FaFile } from "react-icons/fa6";
import { z } from "zod";

const PostTranslationFormSchema = z
  .object({
    title: z.string().nonempty("제목을 입력해 주세요."),
    sourceLanguage: z
      .enum([...Language, ""])
      .refine((value) => value !== "", "번역 할 문서의 언어를 선택해 주세요."),
    targetLanguage: z
      .enum([...Language, ""])
      .refine(
        (value) => value !== "",
        "어떤 언어로 번역되어야 하는지 선택해 주세요.",
      ),
    categories: z
      .array(z.enum(Category))
      .refine((value) => value.length > 0, "분야를 1개 이상 선택해 주세요.")
      .refine(
        (value) => value.length <= 2,
        "분야는 최대 2개까지만 선택 할 수 있어요.",
      ),
    description: z.string(),
    translationFileFormat: z.string(),
    translationFile: z.any().transform((files) => files[0]),
    translationText: z.string(),
    sample: z.string(),
    endDateTime: z
      .date()
      .refine(
        (value) => dayjs().isBefore(value),
        "현재보다 이후 시간을 지정해 주세요.",
      ),
    desiredFeeValue: z
      .number()
      .min(0, "입력된 번역료를 다시 확인해주세요.")
      .max(1000000000, "입력된 번역료를 다시 확인해주세요."),
  })
  .refine(
    ({ sourceLanguage, targetLanguage }) => sourceLanguage !== targetLanguage,
    {
      message: "원문과 번역문의 언어를 다르게 선택해 주세요.",
      path: ["targetLanguage"],
    },
  )
  .refine(
    ({ translationFileFormat, translationFile }) => {
      if (translationFileFormat === "file") return !!translationFile;
      return true;
    },
    {
      message: "원문 파일을 선택해 주세요.",
      path: ["translationFile"],
    },
  )
  .refine(
    ({ translationFileFormat, translationText }) => {
      if (translationFileFormat === "text") return !!translationText;
      return true;
    },
    {
      message: "원문을 입력해 주세요.",
      path: ["translationText"],
    },
  );

type PostTranslationFormType = z.infer<typeof PostTranslationFormSchema>;

const PostTranslationFormDefaultValue = {
  title: "",
  sourceLanguage: "ko-KR" as const,
  targetLanguage: "en-US" as const,
  categories: [],
  description: "",
  translationFileFormat: "file",
  translationFile: "",
  translationText: "",
  sample: "",
  endDateTime: dayjs().toDate(),
  desiredFeeValue: 0,
};

export default function Index() {
  const timeInputRef = useRef<HTMLInputElement>(null);
  const languageOptions = useMemo<
    { label: string; value: (typeof Language)[number] }[]
  >(
    () => [
      { label: "한국어", value: "ko-KR" },
      { label: "영어", value: "en-US" },
      { label: "일본어", value: "ja-JP" },
    ],
    [],
  );

  const router = useRouter();

  const methods = useForm<PostTranslationFormType>({
    resolver: zodResolver(PostTranslationFormSchema),
    defaultValues: PostTranslationFormDefaultValue,
    mode: "onChange",
  });

  const {
    register,
    control,
    watch,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = methods;

  const translationFileFormat = watch("translationFileFormat");

  const { mutateAsync: mutatePostTranslationFile } = useMutation({
    mutationFn: postTranslationFile,
    onSuccess: () => {
      router.push("/translation/create/done");
    },
  });

  const { mutateAsync: mutatePostTranslation } = useMutation({
    mutationFn: postTranslation,
  });

  const handleClickCreate: SubmitHandler<PostTranslationFormType> = async ({
    title,
    sourceLanguage,
    targetLanguage,
    categories,
    description,
    translationFile,
    translationText,
    endDateTime,
    desiredFeeValue,
    sample,
  }) => {
    const translationData =
      translationFileFormat === "file" ? translationFile : translationText;
    const fileUploadResponse = await mutatePostTranslationFile({
      content: translationData,
    });
    const fileId = fileUploadResponse.id;
    if (sourceLanguage && targetLanguage) {
      await mutatePostTranslation({
        title,
        sourceLanguage,
        targetLanguage,
        categories,
        description,
        fileId,
        endDateTime: endDateTime.toUTCString(),
        desiredFeeValue,
        desiredFeeUnit: "KRW",
        sample,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleClickCreate)}>
      <FormProvider {...methods}>
        <Stack w="full" h="full">
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
              <PageTitle>번역요청</PageTitle>
            </Group>
          </PageHeader>

          <InputSection>
            <LabelSection>
              <Label>제목</Label>
            </LabelSection>
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <div className="flex flex-col gap-1">
                  <TextInput
                    {...field}
                    maxLength={100}
                    placeholder="요청에 대해 알려주세요. (최대 30자)"
                  />
                  <ErrorText>{error?.message}</ErrorText>
                </div>
              )}
            />
          </InputSection>

          <InputSection>
            <LabelSection>
              <Label>언어</Label>
            </LabelSection>
            <Group>
              <Controller
                name="sourceLanguage"
                control={control}
                render={({ field: { onChange, ...f } }) => (
                  <SelectBox
                    {...f}
                    w={120}
                    data={languageOptions}
                    onChange={(v) => {
                      onChange(v as (typeof Language)[0]);
                      trigger(`sourceLanguage`);
                    }}
                    allowDeselect={false}
                    checkIconPosition="right"
                  />
                )}
              />
              <div className="flex justify-center items-center text-primary">
                <FaArrowRight />
              </div>
              <Controller
                name="targetLanguage"
                control={control}
                render={({ field: { onChange, ...f } }) => (
                  <SelectBox
                    {...f}
                    w={120}
                    data={languageOptions}
                    onChange={(v) => {
                      onChange(v as (typeof Language)[0]);
                      trigger(`sourceLanguage`);
                    }}
                    allowDeselect={false}
                    checkIconPosition="right"
                  />
                )}
              />
            </Group>
            <ErrorText>
              {errors.sourceLanguage?.message ?? errors.targetLanguage?.message}
            </ErrorText>
          </InputSection>

          <Speciality />

          <Textarea
            label="세부요청"
            description="번역사가 번역 시 고려하거나 주의했으면 하는 내용이 있다면 적어주세요."
            error={errors.description?.message}
            minRows={3}
            autosize
            {...register("description")}
          />

          <Input.Wrapper
            label="자료 형태"
            description="준비된 파일이 있나요? 아니면 직접 입력하시나요?"
            error={errors.translationFileFormat?.message}
            withAsterisk
          >
            <Controller
              name="translationFileFormat"
              control={control}
              render={({ field }) => (
                <SegmentedControl
                  {...field}
                  mt={5}
                  mb={5}
                  data={[
                    { label: "파일", value: "file" },
                    { label: "직접 입력", value: "text" },
                  ]}
                />
              )}
            />
          </Input.Wrapper>

          {translationFileFormat === "file" && (
            <FileInput
              label="번역 파일"
              description={
                <span>
                  번역 할 파일을 선택해 주세요.
                  <br />
                  파일은 확장자가 ppt, pptx, doc, docx, hwp, txt인 파일만 선택
                  가능해요.
                  <br />
                  번역사가 실제로 번역을 시작 할 때까지 공개되지 않아요.
                </span>
              }
              error={errors.translationFile?.message?.toString()}
              placeholder="파일 선택"
              leftSection={<FaFile />}
              withAsterisk
              accept=".ppt,.pptx,.doc,.docx,.hwp,.txt"
            />
          )}

          {translationFileFormat === "text" && (
            <Textarea
              {...register("translationText")}
              label="번역 원문 직접 입력"
              description={
                <span>
                  번역 할 내용을 입력해 주세요.
                  <br />
                  번역사가 실제로 번역을 시작 할 때까지 공개되지 않아요.
                </span>
              }
              error={errors.translationText?.message}
              minRows={3}
              autosize
              withAsterisk
            />
          )}

          <Textarea
            {...register("sample")}
            label="원문 샘플"
            description={
              <span>
                번역사가 번역 원문의 스타일이나 내용을 간단하게 확인 할 수 있는
                예시 문단을 입력해주세요.
                <br />
                원문 샘플은 공개되어서 번역사가 원문이 어떤 문서인지 아는데
                사용돼요.
              </span>
            }
            error={errors.sample?.message}
            minRows={3}
            autosize
          />

          <Controller
            name="endDateTime"
            control={control}
            render={({ field: { onChange, ...field } }) => (
              <DateTimePicker
                {...field}
                error={errors.endDateTime?.message}
                onChange={(v) => {
                  onChange(dayjs(v).toDate());
                }}
                monthLabelFormat="YYYY년 MM월"
                timeInputProps={{
                  ref: timeInputRef,
                  onClick: () => {
                    timeInputRef.current?.showPicker();
                  },
                }}
                minDate={dayjs().toDate()}
                maxDate={dayjs().add(1, "year").toDate()}
                label="마감일시"
                description="이 번역은 언제까지 완료되어야 하나요?"
                valueFormat="YYYY년 MM월 DD일 HH시 mm분"
                withAsterisk
              />
            )}
          />

          {/* <FormControl isInvalid={!!errors.endDateTime?.message}>
          <FormLabel mb={0} fontSize="xl">
            마감일시
          </FormLabel>
          <FormHelperText mt={0} mb={2}>
            이 번역은 언제까지 완료되어야 하나요?
          </FormHelperText>
          <Controller
            name="endDateTime"
            control={control}
            render={({ field: { value, onChange } }) => (
              <DatePicker
                selected={value}
                onChange={(date) => {
                  onChange(date ?? new Date());
                }}
                dateFormat="yyyy-MM-dd HH:mm:ss"
                showTimeSelect
                timeFormat="HH:mm"
                wrapperClassName="w-full"
                filterDate={(time) => dayjs().isBefore(time)}
                filterTime={(time) => dayjs().isBefore(time)}
                customInput={<Input focusBorderColor="orange" />}
              />
            )}
          />
          <FormErrorMessage>{errors.endDateTime?.message}</FormErrorMessage>
        </FormControl> */}

          <Controller
            name="desiredFeeValue"
            control={control}
            render={({ field: { onChange, ...field } }) => (
              <NumberInput
                {...field}
                error={errors.desiredFeeValue?.message}
                onChange={(v) => onChange(Number(v))}
                label="희망 번역료"
                description={
                  <span>
                    이 번역을 위한 번역료의 가격이 어느정도 되나요?
                    <br />
                    번역사들이 이 금액을 기준으로 고객님께 견적을 다시
                    보내드립니다.
                  </span>
                }
                step={1000}
                clampBehavior="strict"
                min={0}
                max={1000000000}
                allowNegative={false}
                allowDecimal={false}
                thousandSeparator=","
                leftSection="₩"
                withAsterisk
              />
            )}
          />

          <Group>
            <Button
              type="submit"
              loading={isSubmitting}
              color="orange"
              fullWidth
            >
              다음
            </Button>
          </Group>
        </Stack>
      </FormProvider>
    </form>
  );
}

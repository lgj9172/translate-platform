"use client";

import {
  Category,
  Language,
  postTranslation,
  postTranslationFile,
} from "@/apis/translations";
import { AutoResizeTextarea } from "@/components/AutoResizeTextArea";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Heading,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  SimpleGrid,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const PostTranslationFormSchema = z
  .object({
    title: z.string().min(1, "제목을 입력해 주세요."),
    sourceLanguage: z.enum(Language, {
      errorMap: () => ({
        message: "번역하고 싶은 문서의 언어를 선택해 주세요.",
      }),
    }),
    targetLanguage: z.enum(Language, {
      errorMap: () => ({
        message: "어떤 언어로 번역되어야 하는지 선택해 주세요.",
      }),
    }),
    categories: z
      .array(z.enum(Category))
      .refine((value) => value.length > 0, "분야를 1개 이상 선택해 주세요.")
      .refine(
        (value) => value.length <= 2,
        "분야는 최대 2개까지만 선택 할 수 있어요.",
      ),
    description: z.string(),
    translationFileFormat: z.number(),
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
      .string()
      .refine(
        (value) => Number.isInteger(Number(value)),
        "입력된 번역료를 다시 확인해주세요.",
      )
      .refine(
        (value) => Number(value) > 0,
        "입력된 번역료를 다시 확인해주세요.",
      ),
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
      if (translationFileFormat === 0) return !!translationFile;
      return true;
    },
    {
      message: "원문 파일을 선택해 주세요.",
      path: ["translationFile"],
    },
  )
  .refine(
    ({ translationFileFormat, translationText }) => {
      if (translationFileFormat === 1) return !!translationText;
      return true;
    },
    {
      message: "원문을 입력해 주세요.",
      path: ["translationText"],
    },
  );

type PostTranslationFormType = z.infer<typeof PostTranslationFormSchema>;

const PostTranslationFormDefaultValue: PostTranslationFormType = {
  title: "",
  sourceLanguage: "en-US",
  targetLanguage: "ko-KR",
  categories: [],
  description: "",
  translationFileFormat: 0,
  translationFile: "",
  translationText: "",
  sample: "",
  endDateTime: dayjs().toDate(),
  desiredFeeValue: "0",
};

export default function Index() {
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PostTranslationFormType>({
    resolver: zodResolver(PostTranslationFormSchema),
    defaultValues: PostTranslationFormDefaultValue,
    mode: "onChange",
  });

  const { mutateAsync: mutatePostTranslationFile, isLoading: isLoading1 } =
    useMutation({
      mutationFn: postTranslationFile,
    });

  const { mutateAsync: mutatePostTranslation, isLoading: isLoading2 } =
    useMutation({
      mutationFn: postTranslation,
    });

  const isLoading = isLoading1 || isLoading2;

  const handleClickCreate: SubmitHandler<PostTranslationFormType> = async ({
    title,
    sourceLanguage,
    targetLanguage,
    categories,
    description,
    translationFileFormat,
    translationFile,
    translationText,
    endDateTime,
    desiredFeeValue,
    sample,
  }) => {
    const translationData =
      translationFileFormat === 0 ? translationFile : translationText;
    const fileUploadResponse = await mutatePostTranslationFile({
      content: translationData,
    });
    const fileId = fileUploadResponse.id;
    await mutatePostTranslation({
      title,
      sourceLanguage,
      targetLanguage,
      categories,
      description,
      fileId,
      endDateTime: endDateTime.toUTCString(),
      desiredFeeValue: Number(desiredFeeValue),
      desiredFeeUnit: "KRW",
      sample,
    });
    router.push("/translation/create/done");
  };

  return (
    <form onSubmit={handleSubmit(handleClickCreate)}>
      <Stack w="full" h="full" p={8} gap={8}>
        <Heading>번역요청하기</Heading>

        <FormControl isInvalid={!!errors.title?.message} isRequired>
          <FormLabel mb={0} fontSize="xl">
            제목
          </FormLabel>
          <FormHelperText mt={0} mb={2}>
            번역가들이 어떤 번역요청인지 알수 있도록 제목을 간단하게 적어주세요.
          </FormHelperText>
          <Input {...register("title")} focusBorderColor="orange" />
          <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
        </FormControl>

        <FormControl
          isInvalid={
            !!errors.sourceLanguage?.message || !!errors.targetLanguage?.message
          }
          isRequired
        >
          <FormLabel mb={0} fontSize="xl">
            언어
          </FormLabel>
          <FormHelperText mt={0} mb={2}>
            원문과 번역문의 언어를 선택해 주세요.
          </FormHelperText>
          <Grid templateColumns="repeat(7, 1fr)" gap={6}>
            <GridItem colSpan={3}>
              <Select
                {...register("sourceLanguage")}
                focusBorderColor="orange"
                placeholder="원문 언어"
                isInvalid={!!errors.sourceLanguage?.message}
              >
                <option value="ko-KR">한국어</option>
                <option value="en-US">영어</option>
                <option value="ja-JP">일본어</option>
              </Select>
            </GridItem>
            <GridItem>
              <Center h="full">
                <ArrowForwardIcon color="orange.500" />
              </Center>
            </GridItem>
            <GridItem colSpan={3}>
              <Select
                {...register("targetLanguage")}
                focusBorderColor="orange"
                placeholder="번역문 언어"
                isInvalid={!!errors.targetLanguage?.message}
              >
                <option value="ko-KR">한국어</option>
                <option value="en-US">영어</option>
                <option value="ja-JP">일본어</option>
              </Select>
            </GridItem>
          </Grid>
          <FormErrorMessage>{errors.sourceLanguage?.message}</FormErrorMessage>
          <FormErrorMessage>{errors.targetLanguage?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.categories?.message} isRequired>
          <FormLabel mb={0} fontSize="xl">
            분야
          </FormLabel>
          <FormHelperText mt={0} mb={2}>
            분야를 골라주시면 전문성 있는 번역가들이 도와드릴 수 있어요.
          </FormHelperText>
          <CheckboxGroup colorScheme="orange">
            <SimpleGrid minChildWidth="120px" spacing="12px">
              <Checkbox {...register("categories")} value="IT">
                IT/기술
              </Checkbox>
              <Checkbox {...register("categories")} value="FINANCE">
                경제/금융
              </Checkbox>
              <Checkbox {...register("categories")} value="CONTENTS">
                콘텐츠 자막
              </Checkbox>
              <Checkbox {...register("categories")} value="GAME">
                게임
              </Checkbox>
              <Checkbox {...register("categories")} value="LAW">
                법률/특허
              </Checkbox>
              <Checkbox {...register("categories")} value="MEDICAL">
                의료
              </Checkbox>
              <Checkbox {...register("categories")} value="CONSTRUCTION">
                건설
              </Checkbox>
              <Checkbox {...register("categories")} value="MARKETING">
                마케팅
              </Checkbox>
              <Checkbox {...register("categories")} value="LITERATURE">
                문학
              </Checkbox>
              <Checkbox {...register("categories")} value="ETC">
                기타
              </Checkbox>
            </SimpleGrid>
          </CheckboxGroup>
          <FormErrorMessage>{errors.categories?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.description?.message}>
          <FormLabel mb={0} fontSize="xl">
            세부요청
          </FormLabel>
          <FormHelperText mt={0} mb={2}>
            번역사가 번역 시 고려했으면 하는 내용이 있다면 적어주세요.
          </FormHelperText>
          <AutoResizeTextarea
            {...register("description")}
            focusBorderColor="orange"
          />
          <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
        </FormControl>

        <FormControl
          isInvalid={
            !!errors.translationFile?.message ||
            !!errors.translationText?.message
          }
          isRequired
        >
          <FormLabel mb={0} fontSize="xl">
            요청자료
          </FormLabel>
          <FormHelperText mt={0} mb={2}>
            번역할 파일을 선택하거나 직접 입력해주세요.
            <br />
            파일은 확장자가 ppt, pptx, doc, docx, hwp, txt인 파일만 선택
            가능합니다.
          </FormHelperText>
          <Controller
            control={control}
            name="translationFileFormat"
            render={({ field }) => (
              <Tabs isFitted variant="enclosed" colorScheme="orange" {...field}>
                <TabList>
                  <Tab>파일 선택하기</Tab>
                  <Tab>직접 입력하기</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <Input
                      {...register("translationFile")}
                      colorScheme="orange"
                      type="file"
                      accept=".ppt,.pptx,.doc,.docx,.hwp,.txt"
                      isInvalid={!!errors.translationFile?.message}
                    />
                    <FormErrorMessage>
                      {errors.translationFile?.message?.toString()}
                    </FormErrorMessage>
                  </TabPanel>
                  <TabPanel>
                    <AutoResizeTextarea
                      {...register("translationText")}
                      focusBorderColor="orange"
                      isInvalid={!!errors.translationText?.message}
                    />
                    <FormErrorMessage>
                      {errors.translationText?.message}
                    </FormErrorMessage>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            )}
          />
        </FormControl>

        <FormControl isInvalid={!!errors.sample?.message}>
          <FormLabel mb={0} fontSize="xl">
            원문 샘플
          </FormLabel>
          <FormHelperText mt={0} mb={2}>
            번역사가 번역 원문의 스타일이나 내용을 간단하게 확인 할 수 있는 예시
            문단을 입력해주세요.
          </FormHelperText>
          <AutoResizeTextarea
            {...register("sample")}
            focusBorderColor="orange"
          />
          <FormErrorMessage>{errors.sample?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.endDateTime?.message} isRequired>
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
                customInput={<Input focusBorderColor="orange" />}
              />
            )}
          />
          <FormErrorMessage>{errors.endDateTime?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.desiredFeeValue?.message} isRequired>
          <FormLabel mb={0} fontSize="xl">
            예상 번역료
          </FormLabel>
          <FormHelperText mt={0} mb={2}>
            이 번역을 위한 번역료의 가격이 어느정도 되나요?
            <br />
            번역사들이 이 금액을 기준으로 고객님께 견적을 다시 보내드립니다.
          </FormHelperText>
          <NumberInput focusBorderColor="orange" step={5000}>
            <NumberInputField {...register("desiredFeeValue")} />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <FormErrorMessage>{errors.desiredFeeValue?.message}</FormErrorMessage>
        </FormControl>

        <HStack justifyContent="center" py="8">
          <Button
            type="submit"
            isLoading={isLoading}
            colorScheme="orange"
            w="full"
            size="lg"
            // isDisabled={!isValid}
          >
            다음
          </Button>
        </HStack>
      </Stack>
    </form>
  );
}

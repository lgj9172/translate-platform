"use client";

import { getTranslation } from "@/apis/translations";
import { postTranslationQuotation } from "@/apis/translations-quotations";
import ControllerSection from "@/components/ControllerSection";
import ErrorText from "@/components/ErrorText";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import PageHeader from "@/components/PageHeader";
import PageTitle from "@/components/PageTitle";
import TextArea from "@/components/TextArea";
import TranslationCard from "@/components/TranslationCard";
import { Button } from "@/components/ui/button";
import { TRANSLATION_CURRENCY } from "@/types/entities";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActionIcon,
  Center,
  Group,
  Loader,
  NumberInput,
  Stack,
} from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { FaChevronLeft } from "react-icons/fa6";
import { z } from "zod";

const PostTranslationQuoteFormSchema = z.object({
  translation_fee: z
    .number()
    .min(0, "입력된 번역료를 다시 확인해주세요.")
    .max(1000000000, "입력된 번역료를 다시 확인해주세요."),
  detail: z.string(),
});

type PostTranslationQuoteFormType = z.infer<
  typeof PostTranslationQuoteFormSchema
>;

const PostTranslationQuoteFormDefaultValue = {
  translation_fee: 0,
  detail: "",
};

interface Props {
  params: { translationId: string };
}

export default function Page({ params: { translationId } }: Props) {
  const router = useRouter();

  const { data: translation, isLoading } = useQuery({
    queryKey: ["translations", translationId],
    queryFn: () => getTranslation({ translationId }),
  });

  const methods = useForm<PostTranslationQuoteFormType>({
    resolver: zodResolver(PostTranslationQuoteFormSchema),
    defaultValues: PostTranslationQuoteFormDefaultValue,
    mode: "onChange",
  });

  const { mutate: mutatePostTranslationQuote } = useMutation({
    mutationFn: postTranslationQuotation,
    onSuccess: () => {
      router.push(`/translation/${translationId}/quote/create/done`);
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleClickCreate: SubmitHandler<
    PostTranslationQuoteFormType
  > = async ({ translation_fee, detail }) => {
    await mutatePostTranslationQuote({
      translationId,
      payload: {
        fee: {
          unit: translation?.fee.unit ?? TRANSLATION_CURRENCY.KRW,
          value: translation_fee,
        },
        detail,
      },
    });
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
    <form onSubmit={handleSubmit(handleClickCreate)}>
      <FormProvider {...methods}>
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
              <PageTitle>견적 보내기</PageTitle>
            </Group>
          </PageHeader>

          <TranslationCard translation={translation} />

          <Stack>
            <InputSection>
              <LabelSection>
                <Label>번역료</Label>
              </LabelSection>
              <Controller
                name="translation_fee"
                control={control}
                render={({
                  field: { onChange, ...field },
                  fieldState: { error },
                }) => (
                  <ControllerSection>
                    <NumberInput
                      {...field}
                      onChange={(v) => onChange(Number(v))}
                      step={1000}
                      clampBehavior="strict"
                      min={0}
                      max={1000000000}
                      allowNegative={false}
                      allowDecimal={false}
                      thousandSeparator=","
                      leftSection="₩"
                      withAsterisk
                      classNames={{
                        input: "focus:border-primary",
                      }}
                    />
                    <ErrorText>{error?.message}</ErrorText>
                  </ControllerSection>
                )}
              />
            </InputSection>

            <InputSection>
              <LabelSection>
                <Label>세부사항(선택)</Label>
              </LabelSection>
              <Controller
                name="detail"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <ControllerSection>
                    <TextArea
                      {...field}
                      maxLength={100}
                      placeholder="번역을 요청한 사람에게 남길 말을 입력해주세요."
                    />
                    <ErrorText>{error?.message}</ErrorText>
                  </ControllerSection>
                )}
              />
            </InputSection>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                견적 보내기
              </Button>
            </div>
          </Stack>
        </Stack>
      </FormProvider>
    </form>
  );
}

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
import { Textarea } from "@/components/ui/textarea";
import TranslationCard from "@/components/TranslationCard";
import { Button } from "@/components/ui/button";
import { TRANSLATION_CURRENCY } from "@/types/entities";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionIcon } from "@/components/ui/action-icon";
import { Center } from "@/components/ui/center";
import { Group } from "@/components/ui/group";
import { Loader } from "@/components/ui/loader";
import { Stack } from "@/components/ui/stack";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { FaChevronLeft } from "react-icons/fa6";
import { NumericFormat } from "react-number-format";
import { Input } from "@/components/ui/input";
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

export default function Page() {
  const { translationId } = useParams<{ translationId: string }>();

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
      <Center className="h-[500px]">
        <Loader />
      </Center>
    );
  }

  if (!translation) return null;

  return (
    <form onSubmit={handleSubmit(handleClickCreate)}>
      <FormProvider {...methods}>
        <Stack className="w-full h-full gap-[16px]">
          <PageHeader>
            <Group>
              <ActionIcon variant="ghost" asChild>
                <Link href="/">
                  <FaChevronLeft />
                </Link>
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
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        ₩
                      </span>
                      <NumericFormat
                        {...field}
                        value={field.value}
                        onValueChange={(values) =>
                          onChange(values.floatValue || 0)
                        }
                        thousandSeparator=","
                        allowNegative={false}
                        decimalScale={0}
                        min={0}
                        max={1000000000}
                        customInput={Input}
                        className="pl-8 focus:border-primary"
                        placeholder="번역료를 입력하세요"
                      />
                    </div>
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
                    <Textarea
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

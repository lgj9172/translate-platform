"use client";

import {
  getTranslatorQuotation,
  postTranslationQuotation,
  postTranslationQuotationCancel,
} from "@/apis/translations-quotations";
import Button from "@/components/Button";
import ControllerSection from "@/components/ControllerSection";
import ErrorText from "@/components/ErrorText";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import TextArea from "@/components/TextArea";
import {
  Translation,
  TRANSLATION_CURRENCY,
  TRANSLATION_CURRENCY_LABEL,
} from "@/types/entities";
import { zodResolver } from "@hookform/resolvers/zod";
import { Center, NumberInput, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
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
  translation: Translation;
}

export default function SendQuote({ translation }: Props) {
  const queryClient = useQueryClient();

  const { data: translatorQuotation, isLoading: isTranslatorQuotationLoading } =
    useQuery({
      queryKey: ["quotations", translation.translation_id],
      queryFn: () =>
        getTranslatorQuotation({
          translationId: translation.translation_id,
        }),
    });

  const methods = useForm<PostTranslationQuoteFormType>({
    resolver: zodResolver(PostTranslationQuoteFormSchema),
    defaultValues: PostTranslationQuoteFormDefaultValue,
    mode: "onChange",
  });

  const { mutate: mutatePostTranslationQuote } = useMutation({
    mutationFn: postTranslationQuotation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["translations", translation.translation_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["translations", translation.translation_id, "quotes"],
      });
      queryClient.invalidateQueries({
        queryKey: ["quotations", translation.translation_id],
      });
      toast.success("견적을 보냈어요.", {
        richColors: true,
        position: "top-center",
      });
      modals.closeAll();
    },
  });

  const { mutate: mutatePostTranslationQuoteCancel } = useMutation({
    mutationFn: postTranslationQuotationCancel,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["translations", translation.translation_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["translations", translation.translation_id, "quotes"],
      });
      queryClient.invalidateQueries({
        queryKey: ["quotations", translation.translation_id],
      });
      toast.success("견적을 취소했어요.", {
        richColors: true,
        position: "top-center",
      });
      modals.closeAll();
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleClickCreateQuote: SubmitHandler<PostTranslationQuoteFormType> = ({
    translation_fee,
    detail,
  }) =>
    modals.open({
      title: <div className="text-lg font-bold">견적 보내기</div>,
      children: (
        <div className="flex flex-col gap-2">
          <div>견적을 보내시겠어요?</div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => modals.closeAll()}>
              닫기
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                mutatePostTranslationQuote({
                  translationId: translation.translation_id,
                  payload: {
                    fee: {
                      unit: translation.fee.unit,
                      value: translation_fee,
                    },
                    detail,
                  },
                });
              }}
            >
              견적 보내기
            </Button>
          </div>
        </div>
      ),
    });

  const handleClickCancelQuote = (translationId: string, quotationId: string) =>
    modals.open({
      title: <div className="text-lg font-bold">견적 보내기 취소</div>,
      children: (
        <div className="flex flex-col gap-2">
          <div>보내신 견적을 취소하시겠어요?</div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => modals.closeAll()}>
              닫기
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                mutatePostTranslationQuoteCancel({
                  translationId,
                  quotationId,
                });
              }}
            >
              견적 보내기 취소
            </Button>
          </div>
        </div>
      ),
    });

  if (isTranslatorQuotationLoading) {
    return (
      <Center mih="320px">
        <Loader color="orange" type="bars" />
      </Center>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleClickCreateQuote)}>
      <FormProvider {...methods}>
        {!translatorQuotation ? (
          <Stack>
            <div className="flex flex-col gap-2 mb-4">
              <div className="text-xl font-bold text-gray-800">견적 보내기</div>
              <p className="text-sm text-gray-600">
                이 번역 작업을 진행하고 싶다면 희망 번역료를 참고해서 견적을
                보내보세요.
              </p>
            </div>
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
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                견적 보내기
              </Button>
            </div>
          </Stack>
        ) : (
          <Stack>
            <div className="flex flex-col gap-2 mb-4">
              <div className="text-xl font-bold text-gray-800">보낸 견적</div>
              <p className="text-sm text-gray-600">
                이 번역 작업에 보낸 견적 내용입니다.
              </p>
            </div>

            <InputSection>
              <LabelSection>
                <Label>번역료</Label>
              </LabelSection>

              <div className="flex text-primary font-bold text-[16px]">
                <span>
                  <NumericFormat
                    displayType="text"
                    // TODO: 견적 아이디 추가
                    value={translatorQuotation.fee.value}
                    thousandsGroupStyle="thousand"
                    thousandSeparator=","
                  />
                </span>
                <span>
                  {translatorQuotation.fee.unit === TRANSLATION_CURRENCY.KRW &&
                    TRANSLATION_CURRENCY_LABEL.KRW}
                  {translatorQuotation.fee.unit === TRANSLATION_CURRENCY.USD &&
                    TRANSLATION_CURRENCY_LABEL.USD}
                </span>
              </div>
            </InputSection>

            <InputSection>
              <LabelSection>
                <Label>세부사항</Label>
              </LabelSection>
              <div>{translatorQuotation.detail}</div>
            </InputSection>

            <div className="flex justify-end">
              <Button
                size="md"
                variant="secondary"
                onClick={() =>
                  // TODO: 견적 아이디 추가
                  handleClickCancelQuote(
                    translation.translation_id,
                    translatorQuotation.quotation_id,
                  )
                }
              >
                견적 보내기 취소
              </Button>
            </div>
          </Stack>
        )}
      </FormProvider>
    </form>
  );
}

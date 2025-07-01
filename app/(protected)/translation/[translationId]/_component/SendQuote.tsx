"use client";

import { getTranslatorQuotation } from "@/apis/translations-quotations";
import ControllerSection from "@/components/ControllerSection";
import ErrorText from "@/components/ErrorText";
import Fee from "@/components/Fee";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import TextArea from "@/components/TextArea";
import { Button } from "@/components/ui/button";
import CancelQuoteModal from "@/modals/CancelQuoteModal";
import SendQuoteModal from "@/modals/SendQuoteModal";
import { Translation } from "@/types/entities";
import { zodResolver } from "@hookform/resolvers/zod";
import { Center } from "@/components/ui/center";
import { Stack } from "@/components/ui/stack";
import { Loader } from "@/components/ui/loader";
import { Input } from "@/components/ui/input";
import { NumericFormat } from "react-number-format";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
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
  const [openSendQuoteModal, setOpenSendQuoteModal] = useState(false);
  const [openCancelQuoteModal, setOpenCancelQuoteModal] = useState(false);
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

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleClickCreateQuote: SubmitHandler<
    PostTranslationQuoteFormType
  > = () => {
    setOpenSendQuoteModal(true);
  };

  const handleClickCancelQuote = () => {
    setOpenCancelQuoteModal(true);
  };

  if (isTranslatorQuotationLoading) {
    return (
      <Center className="h-[500px]">
        <Loader />
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
              <Fee
                value={translatorQuotation.fee.value}
                unit={translatorQuotation.fee.unit}
              />
            </InputSection>

            <InputSection>
              <LabelSection>
                <Label>세부사항</Label>
              </LabelSection>
              <div>{translatorQuotation.detail}</div>
            </InputSection>

            <div className="flex justify-end">
              <Button variant="secondary" onClick={handleClickCancelQuote}>
                견적 보내기 취소
              </Button>
            </div>
          </Stack>
        )}
      </FormProvider>
      <SendQuoteModal
        open={openSendQuoteModal}
        onOpenChange={setOpenSendQuoteModal}
        translationId={translation.translation_id}
        fee={{
          unit: translation.fee.unit,
          value: methods.getValues("translation_fee"),
        }}
        detail={methods.getValues("detail")}
      />
      <CancelQuoteModal
        open={openCancelQuoteModal}
        onOpenChange={setOpenCancelQuoteModal}
        translationId={translation.translation_id}
        quotationId={translatorQuotation?.quotation_id || ""}
      />
    </form>
  );
}

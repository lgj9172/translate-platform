"use client";

import {
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
import { NumberInput, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { NumericFormat } from "react-number-format";
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
  const router = useRouter();

  // TODO: 현재 로그인한 사람의 견적 불러오기 추가

  const methods = useForm<PostTranslationQuoteFormType>({
    resolver: zodResolver(PostTranslationQuoteFormSchema),
    defaultValues: PostTranslationQuoteFormDefaultValue,
    mode: "onChange",
  });

  const { mutate: mutatePostTranslationQuote } = useMutation({
    mutationFn: postTranslationQuotation,
    onSuccess: () => {
      router.push(
        `/translation/${translation.translation_id}/quote/create/done`,
      );
    },
  });

  const { mutate: mutatePostTranslationQuoteCancel } = useMutation({
    mutationFn: postTranslationQuotationCancel,
    onSuccess: () => {
      router.refresh();
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
                modals.closeAll();
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
                modals.closeAll();
              }}
            >
              견적 보내기 취소
            </Button>
          </div>
        </div>
      ),
    });

  return (
    <form onSubmit={handleSubmit(handleClickCreateQuote)}>
      <FormProvider {...methods}>
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

        {/* TODO: 견적을 보냈는지 여부에 따라 분기 */}
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
                  value={12345}
                  thousandsGroupStyle="thousand"
                  thousandSeparator=","
                />
              </span>
              <span>
                {translation.fee.unit === TRANSLATION_CURRENCY.KRW &&
                  TRANSLATION_CURRENCY_LABEL.KRW}
                {translation.fee.unit === TRANSLATION_CURRENCY.USD &&
                  TRANSLATION_CURRENCY_LABEL.USD}
              </span>
            </div>
          </InputSection>

          <InputSection>
            <LabelSection>
              <Label>세부사항</Label>
            </LabelSection>
            <div>세부사항에 대한 내용이 표시됩니다.</div>
          </InputSection>

          <div className="flex justify-end">
            <Button
              size="md"
              variant="secondary"
              onClick={() =>
                // TODO: 견적 아이디 추가
                handleClickCancelQuote(translation.translation_id, "12345")
              }
            >
              견적 보내기 취소
            </Button>
          </div>
        </Stack>
      </FormProvider>
    </form>
  );
}

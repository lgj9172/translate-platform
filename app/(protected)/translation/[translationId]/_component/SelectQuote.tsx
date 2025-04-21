"use client";

import { postTranslationCancel } from "@/apis/translations";
import {
  getTranslationQuotations,
  postTranslationQuotationSelect,
} from "@/apis/translations-quotations";
import Button from "@/components/Button";
import Card from "@/components/Card";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import {
  Translation,
  TRANSLATION_CURRENCY,
  TRANSLATION_CURRENCY_LABEL,
} from "@/types/entities";
import { Center, Loader, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import TranslatorProfile from "./TranslatorProfile";

interface Props {
  translation: Translation;
}

export default function SelectQuote({ translation }: Props) {
  const queryClient = useQueryClient();

  const { data: translationQuotes, isLoading } = useQuery({
    queryKey: ["translations", translation.translation_id, "quotes"],
    queryFn: () =>
      getTranslationQuotations({
        translationId: translation.translation_id,
        params: {
          start: 0,
          size: 10,
        },
      }),
  });

  const { mutate: mutatePostTranslationQuoteSelect } = useMutation({
    mutationFn: postTranslationQuotationSelect,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["translations", translation.translation_id],
      });
      toast.success("번역사를 선택했어요.", {
        richColors: true,
        position: "top-center",
      });
      modals.closeAll();
    },
  });

  const { mutate: mutatePostTranslationCancel } = useMutation({
    mutationFn: postTranslationCancel,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["translations", translation.translation_id],
      });
      toast.success("번역 요청이 취소되었어요.", {
        richColors: true,
        position: "top-center",
      });
      modals.closeAll();
    },
  });

  const handleClickSelectQuote = (quotationId: string) =>
    modals.open({
      title: <div className="text-lg font-bold">번역사 선택</div>,
      children: (
        <div className="flex flex-col gap-2">
          <div>이 번역사를 선택하시겠어요?</div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => modals.closeAll()}>
              닫기
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                mutatePostTranslationQuoteSelect({
                  translationId: translation.translation_id,
                  quotationId,
                });
              }}
            >
              번역사 선택
            </Button>
          </div>
        </div>
      ),
    });

  const handleClickCancelTranslation = () =>
    modals.open({
      title: <div className="text-lg font-bold">번역 요청 취소</div>,
      children: (
        <div className="flex flex-col gap-2">
          <div>아직 변역이 시작되지 않았다면 취소 할 수 있어요.</div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => modals.closeAll()}>
              닫기
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                mutatePostTranslationCancel({
                  translationId: translation.translation_id,
                });
              }}
            >
              번역 요청 취소
            </Button>
          </div>
        </div>
      ),
    });

  if (isLoading)
    return (
      <Center mih="320px">
        <Loader color="orange" type="bars" />
      </Center>
    );

  if (!translationQuotes) return null;

  if (translationQuotes.length === 0)
    return (
      <Stack>
        <div className="flex flex-col gap-2 mb-4">
          <div className="text-xl font-bold text-gray-800">번역사 대기중</div>
          <p className="text-sm text-gray-600">
            번역사들이 견적을 보내면 알려드릴게요.
          </p>
        </div>
        <div className="flex justify-end">
          <Button
            size="md"
            variant="secondary"
            onClick={handleClickCancelTranslation}
          >
            번역 요청 취소
          </Button>
        </div>
      </Stack>
    );

  return (
    <Stack>
      <div className="flex flex-col gap-2 mb-4">
        <div className="text-xl font-bold text-gray-800">번역사 선택</div>
        <p className="text-sm text-gray-600">
          견적을 보낸 번역사 중에서 번역을 진행할 번역사를 선택해주세요.
        </p>
      </div>

      {translationQuotes?.map((quote) => (
        <Card key={quote.quotation_id}>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <TranslatorProfile translatorId={quote.translator_id} />
              <div className="flex justify-end items-center">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleClickSelectQuote(quote.quotation_id)}
                >
                  번역사 선택
                </Button>
              </div>
            </div>

            <InputSection>
              <LabelSection>
                <Label>번역료</Label>
              </LabelSection>

              <div className="flex text-primary font-bold text-[16px]">
                <span>
                  <NumericFormat
                    displayType="text"
                    value={quote.fee.value}
                    thousandsGroupStyle="thousand"
                    thousandSeparator=","
                  />
                </span>
                <span>
                  {quote.fee.unit === TRANSLATION_CURRENCY.KRW &&
                    TRANSLATION_CURRENCY_LABEL.KRW}
                  {quote.fee.unit === TRANSLATION_CURRENCY.USD &&
                    TRANSLATION_CURRENCY_LABEL.USD}
                </span>
              </div>
            </InputSection>

            <InputSection>
              <LabelSection>
                <Label>세부사항</Label>
              </LabelSection>
              <div>{quote.detail}</div>
            </InputSection>
          </div>
        </Card>
      ))}
      <div className="flex justify-end">
        <Button
          size="md"
          variant="secondary"
          onClick={handleClickCancelTranslation}
        >
          번역 요청 취소
        </Button>
      </div>
    </Stack>
  );
}

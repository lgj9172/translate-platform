"use client";

import { getTranslationQuotations } from "@/apis/translations-quotations";
import Button from "@/components/Button";
import Card from "@/components/Card";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import CancelTranslationModal from "@/modals/CancelTranslationModal";
import SelectQuoteModal from "@/modals/SelectQuoteModal";
import {
  Translation,
  TRANSLATION_CURRENCY,
  TRANSLATION_CURRENCY_LABEL,
} from "@/types/entities";
import { Center, Loader, Stack } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { NumericFormat } from "react-number-format";
import TranslatorProfile from "./TranslatorProfile";

export default function SelectQuote({
  translation,
}: {
  translation: Translation;
}) {
  const [selectedQuotationId, setSelectedQuotationId] = useState<string | null>(
    null,
  );
  const [openSelectQuoteModal, setOpenSelectQuoteModal] = useState(false);
  const [openCancelTranslationModal, setOpenCancelTranslationModal] =
    useState(false);

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

  const handleClickSelectQuote = (quotationId: string) => {
    setSelectedQuotationId(quotationId);
    setOpenSelectQuoteModal(true);
  };

  const handleClickCancelTranslation = () => {
    setOpenCancelTranslationModal(true);
  };

  if (isLoading)
    return (
      <Center mih="320px">
        <Loader color="orange" type="bars" />
      </Center>
    );

  if (!translationQuotes) return null;

  return (
    <Stack>
      {translationQuotes.length === 0 ? (
        <div className="flex flex-col gap-2 mb-4">
          <div className="text-xl font-bold text-gray-800">번역사 대기중</div>
          <p className="text-sm text-gray-600">
            번역사들이 견적을 보내면 알려드릴게요.
          </p>
        </div>
      ) : (
        <>
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
        </>
      )}
      <div className="flex justify-end">
        <Button
          size="md"
          variant="secondary"
          onClick={handleClickCancelTranslation}
        >
          번역 요청 취소
        </Button>
      </div>
      <SelectQuoteModal
        open={openSelectQuoteModal}
        onOpenChange={setOpenSelectQuoteModal}
        translationId={translation.translation_id}
        quotationId={selectedQuotationId || ""}
      />
      <CancelTranslationModal
        open={openCancelTranslationModal}
        onOpenChange={setOpenCancelTranslationModal}
        translationId={translation.translation_id}
      />
    </Stack>
  );
}

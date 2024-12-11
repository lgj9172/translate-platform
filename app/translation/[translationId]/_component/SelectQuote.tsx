"use client";

import {
  postTranslationCancel,
  PostTranslationCancelRequest,
  Translation,
} from "@/apis/translations";
import {
  getTranslationQuotes,
  postTranslationQuoteSelect,
  PostTranslationQuoteSelectRequest,
} from "@/apis/translations-quotations";
import Button from "@/components/Button";
import Card from "@/components/Card";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import { Avatar, Center, Loader, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useMutation, useQuery } from "@tanstack/react-query";
import { NumericFormat } from "react-number-format";

interface Props {
  translation: Translation;
}

export default function SelectQuote({ translation }: Props) {
  const { data: translationQuotes, isLoading } = useQuery({
    queryKey: ["translations", translation.translation_id, "quotes"],
    queryFn: () =>
      getTranslationQuotes({
        translationId: translation.translation_id,
      }),
  });

  const { mutate: mutatePostTranslationQuoteSelect } = useMutation({
    mutationFn: ({
      translationId,
      quotationId,
    }: PostTranslationQuoteSelectRequest) =>
      postTranslationQuoteSelect({
        translationId,
        quotationId,
      }),
    onSuccess: () => {},
  });

  const { mutate: mutatePostTranslationCancel } = useMutation({
    mutationFn: ({ translationId }: PostTranslationCancelRequest) =>
      postTranslationCancel({
        translationId,
      }),
    onSuccess: () => {},
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
                modals.closeAll();
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
                modals.closeAll();
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
        <div className="text-lg font-bold">
          고객 님, 번역사가 견적을 보내면 알려드릴게요.
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
      <div className="text-lg font-bold">
        고객 님, 번역을 진행할 번역사를 선택해주세요.
      </div>

      {translationQuotes?.map((quote) => (
        <Card>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <div className="flex gap-[8px]">
                <Avatar src="avatar.png" />
                <div>
                  <div className="text-[14px] text-[#4B4D4D]">
                    {quote.translator.translator_id}
                  </div>
                  <div className="text-[14px] text-[#8B8C8D]">
                    경력 {quote.translator.experience}년
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
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
                    value={quote.translation_fee}
                    thousandsGroupStyle="thousand"
                    thousandSeparator=","
                  />
                </span>
                <span>
                  {translation.fee_unit === "KRW" && "원"}
                  {translation.fee_unit === "USD" && "달러"}
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

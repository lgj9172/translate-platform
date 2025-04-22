import { getTranslation } from "@/apis/translations";
import { Quotation } from "@/types/entities";
import { Center, Loader } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Badge from "./Badge";
import Card from "./Card";
import Fee from "./Fee";
import InputSection from "./InputSection";
import LabelSection from "./LabelSection";
import TranslationCard from "./TranslationCard";
import Label from "./Label";

export default function QuotationCard({ quotation }: { quotation: Quotation }) {
  const { data: translation, isLoading: isTranslationLoading } = useQuery({
    queryKey: ["translation", quotation.translation_id],
    queryFn: () => getTranslation({ translationId: quotation.translation_id }),
  });

  return (
    <Card key={quotation.quotation_id}>
      <div className="flex flex-col gap-[16px]">
        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            {quotation.is_selected ? (
              <Badge color="green">채택됨</Badge>
            ) : (
              <Badge color="gray">미채택</Badge>
            )}
            {quotation.is_canceled && <Badge color="red">취소된 견적</Badge>}
            {quotation.is_deleted && <Badge color="gray">삭제된 견적</Badge>}
          </div>
        </div>
        <InputSection>
          <LabelSection>
            <Label>번역료</Label>
          </LabelSection>

          <Fee value={quotation.fee.value} unit={quotation.fee.unit} />
        </InputSection>

        <InputSection>
          <LabelSection>
            <Label>세부사항</Label>
          </LabelSection>
          <div>{quotation.detail || "-"}</div>
        </InputSection>
        {isTranslationLoading ? (
          <Center mih="150px">
            <Loader color="orange" type="bars" />
          </Center>
        ) : (
          translation && (
            <Link
              className="hover:cursor-pointer"
              href={`/translation/${quotation.translation_id}`}
              key={quotation.quotation_id}
            >
              <TranslationCard
                key={quotation.quotation_id}
                translation={translation}
                showStatus
              />
            </Link>
          )
        )}
      </div>
    </Card>
  );
}

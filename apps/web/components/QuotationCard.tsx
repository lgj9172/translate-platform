import { getTranslation } from "@/apis/translations";
import { Card } from "@/components/ui/card";
import { Center } from "@/components/ui/center";
import { Loader } from "@/components/ui/loader";
import { Quotation } from "@/types/entities";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import Fee from "./Fee";
import InputSection from "./InputSection";
import Label from "./Label";
import LabelSection from "./LabelSection";
import TranslationCard from "./TranslationCard";

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
              <Badge variant="default">채택됨</Badge>
            ) : (
              <Badge variant="secondary">미채택</Badge>
            )}
            {quotation.is_canceled && (
              <Badge variant="destructive">취소된 견적</Badge>
            )}
            {quotation.is_deleted && (
              <Badge variant="secondary">삭제된 견적</Badge>
            )}
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
          <Center className="h-[500px]">
            <Loader />
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

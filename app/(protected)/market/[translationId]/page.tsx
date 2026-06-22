"use client";

import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { NumericFormat } from "react-number-format";
import { getTranslation } from "@/apis/translations";
import { getOtherUser } from "@/apis/user";
import CategoryBadges from "@/components/CatagoryBadges";
import Fee from "@/components/Fee";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import LanguageBadge from "@/components/LangaugeBadge";
import PageHeader from "@/components/PageHeader";
import PageTitle from "@/components/PageTitle";
import TranslationStatus from "@/components/TranslationStatus";
import SendQuote from "@/components/translation/SendQuote";
import { ActionIcon } from "@/components/ui/action-icon";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Center } from "@/components/ui/center";
import { Group } from "@/components/ui/group";
import { Loader } from "@/components/ui/loader";
import { Separator } from "@/components/ui/separator";
import { Stack } from "@/components/ui/stack";
import { TRANSLATION_STATUS } from "@/types/entities";

export default function Page() {
  const { translationId } = useParams<{ translationId: string }>();

  const { data: translation, isLoading } = useQuery({
    queryKey: ["translations", translationId],
    queryFn: () => getTranslation({ translationId }),
    staleTime: 0,
  });

  const { data: writer } = useQuery({
    queryKey: ["user", translation?.user_id],
    queryFn: () => getOtherUser({ userId: translation?.user_id ?? "" }),
    enabled: !!translation?.user_id,
  });

  if (isLoading) {
    return (
      <Center className="h-[500px]">
        <Loader />
      </Center>
    );
  }

  if (!translation) return null;

  return (
    <Stack className="w-full h-full gap-[16px]">
      <PageHeader>
        <Group>
          <ActionIcon variant="ghost" asChild>
            <Link href="/market">
              <ArrowLeftIcon />
            </Link>
          </ActionIcon>
          <PageTitle>{translation.title}</PageTitle>
        </Group>
      </PageHeader>

      <Group className="justify-between">
        <Group gap="xs">
          <LanguageBadge
            sourceLanguage={translation.source_language}
            targetLanguage={translation.target_language}
          />
          <CategoryBadges categories={translation.categories} />
        </Group>
        <TranslationStatus translation={translation} />
      </Group>

      <Card>
        <div className="flex gap-[8px]">
          <Avatar>
            <AvatarImage src={writer?.avatar} />
            <AvatarFallback>{writer?.nickname?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-[14px] text-[#4B4D4D]">{writer?.nickname}</div>
            <div className="text-[14px] text-[#8B8C8D]">
              {dayjs(translation.created_at).locale("ko").format("YYYY.MM.DD")}
            </div>
          </div>
        </div>
      </Card>

      <Stack gap="xl">
        <InputSection>
          <LabelSection>
            <Label>세부 요청사항</Label>
          </LabelSection>
          <div>{translation.description}</div>
        </InputSection>

        <InputSection>
          <LabelSection>
            <Label>마감 기한</Label>
          </LabelSection>
          <div>
            {dayjs(translation.deadline)
              .locale("ko")
              .format("YYYY.MM.DD hh:mm")}
          </div>
        </InputSection>

        <InputSection>
          <LabelSection>
            <Label>전체 분량</Label>
          </LabelSection>
          <div>
            <NumericFormat
              displayType="text"
              value={translation.source_files.reduce(
                (prev, { char_with_blank }) => prev + char_with_blank,
                0,
              )}
              thousandsGroupStyle="thousand"
              thousandSeparator=","
            />
            자<span className="text-[#8B8C8D]"> (공백 포함)</span>
          </div>
        </InputSection>

        <InputSection>
          <LabelSection>
            <Label>원문</Label>
          </LabelSection>
          <span className="text-[#8B8C8D]">
            원문 파일은 선택된 번역사만 다운로드 가능해요.
          </span>
        </InputSection>

        <InputSection>
          <LabelSection>
            <Label>원문 샘플</Label>
          </LabelSection>
          {translation.sample ? (
            <div>{translation.sample}</div>
          ) : (
            <span className="text-[#8B8C8D]">샘플이 없어요.</span>
          )}
        </InputSection>

        <InputSection>
          <LabelSection>
            <Label>희망 번역료</Label>
          </LabelSection>
          <Fee value={translation.fee.value} unit={translation.fee.unit} />
        </InputSection>

        <Separator />

        {translation.is_canceled ? (
          <Alert variant="destructive">
            <AlertDescription>취소된 번역입니다.</AlertDescription>
          </Alert>
        ) : translation.status === TRANSLATION_STATUS.QUOTE_SENT ? (
          <SendQuote translation={translation} />
        ) : (
          <Alert>
            <AlertDescription>
              이 번역은 더 이상 견적을 받지 않아요.
            </AlertDescription>
          </Alert>
        )}
      </Stack>
    </Stack>
  );
}

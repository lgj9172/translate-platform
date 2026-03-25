"use client";

import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { NumericFormat } from "react-number-format";
import { getTranslation } from "@/apis/translations";
import { getSelectedQuotation } from "@/apis/translations-quotations";
import { getUser } from "@/apis/user";
import CategoryBadges from "@/components/CatagoryBadges";
import Fee from "@/components/Fee";
import FileDownload from "@/components/FileDownload";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import LanguageBadge from "@/components/LangaugeBadge";
import PageHeader from "@/components/PageHeader";
import PageTitle from "@/components/PageTitle";
import TranslationStatus from "@/components/TranslationStatus";
import { ActionIcon } from "@/components/ui/action-icon";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Center } from "@/components/ui/center";
import { Group } from "@/components/ui/group";
import { Loader } from "@/components/ui/loader";
import { Separator } from "@/components/ui/separator";
import { Stack } from "@/components/ui/stack";
import { TRANSLATION_STATUS } from "@/types/entities";
import Comments from "@/app/(protected)/translation/[translationId]/_component/Comments";
import ConfirmTranslation from "@/app/(protected)/translation/[translationId]/_component/ConfirmTranslation";
import Payment from "@/app/(protected)/translation/[translationId]/_component/Payment";
import SelectQuote from "@/app/(protected)/translation/[translationId]/_component/SelectQuote";
import TranslationResult from "@/app/(protected)/translation/[translationId]/_component/TranslationResult";
import Translator from "@/app/(protected)/translation/[translationId]/_component/Translator";
import WaitTranslationFinish from "@/app/(protected)/translation/[translationId]/_component/WaitTranslationFinish";
import WaitTranslationStart from "@/app/(protected)/translation/[translationId]/_component/WaitTranslationStart";
import WaitTranslationUpdate from "@/app/(protected)/translation/[translationId]/_component/WaitTranslationUpdate";

export default function Page() {
  const { translationId } = useParams<{ translationId: string }>();

  const { data: translation, isLoading: isTranslationLoading } = useQuery({
    queryKey: ["translations", translationId],
    queryFn: () => getTranslation({ translationId }),
  });

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(),
  });

  const hasSelectedTranslator = [
    TRANSLATION_STATUS.TRANSLATOR_SELECTED,
    TRANSLATION_STATUS.TRANSLATION_BEGAN,
    TRANSLATION_STATUS.TRANSLATION_SUBMITTED,
    TRANSLATION_STATUS.TRANSLATION_EDIT_REQUESTED,
    TRANSLATION_STATUS.TRANSLATION_RESOLVED,
  ].includes(translation?.status as never);

  const { data: selectedQuotation } = useQuery({
    queryKey: ["translations", translationId, "selected-quotation"],
    queryFn: () => getSelectedQuotation({ translationId }),
    enabled: hasSelectedTranslator,
  });

  if (isTranslationLoading || isUserLoading) {
    return (
      <Center className="h-[500px]">
        <Loader />
      </Center>
    );
  }

  if (!translation) return null;

  const isOwner = translation.user_id === user?.user_id;

  return (
    <Stack className="w-full h-full gap-[16px]">
      <PageHeader>
        <Group>
          <ActionIcon variant="ghost" asChild>
            <Link href="/my/translation/request">
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
      <Stack gap="xl">
        <InputSection>
          <LabelSection><Label>세부 요청사항</Label></LabelSection>
          <div>{translation.description}</div>
        </InputSection>

        <InputSection>
          <LabelSection><Label>마감 기한</Label></LabelSection>
          <div>
            {dayjs(translation.deadline).locale("ko").format("YYYY.MM.DD hh:mm")}
          </div>
        </InputSection>

        <InputSection>
          <LabelSection><Label>전체 분량</Label></LabelSection>
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
          <LabelSection><Label>원문</Label></LabelSection>
          {translation.source_files.map(({ file_id, name, presigned_url }, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: file_id can be null
            <div key={`${file_id}-${index}`} className="flex gap-2">
              {file_id ? (
                <FileDownload fileId={file_id} presignedUrl={presigned_url} name={name} />
              ) : (
                <span className="text-[#8B8C8D]">파일 없음</span>
              )}
            </div>
          ))}
        </InputSection>

        {translation.sample && (
          <InputSection>
            <LabelSection><Label>원문 샘플</Label></LabelSection>
            <div>{translation.sample}</div>
          </InputSection>
        )}

        <InputSection>
          <LabelSection><Label>희망 번역료</Label></LabelSection>
          <Fee value={translation.fee.value} unit={translation.fee.unit} />
        </InputSection>

        {[
          TRANSLATION_STATUS.TRANSLATOR_SELECTED,
          TRANSLATION_STATUS.TRANSLATION_BEGAN,
          TRANSLATION_STATUS.TRANSLATION_SUBMITTED,
          TRANSLATION_STATUS.TRANSLATION_EDIT_REQUESTED,
          TRANSLATION_STATUS.TRANSLATION_RESOLVED,
        ].includes(translation.status as never) && (
          <>
            <Translator translation={translation} />
            <Payment translation={translation} />
          </>
        )}

        {[
          TRANSLATION_STATUS.TRANSLATION_BEGAN,
          TRANSLATION_STATUS.TRANSLATION_SUBMITTED,
          TRANSLATION_STATUS.TRANSLATION_EDIT_REQUESTED,
          TRANSLATION_STATUS.TRANSLATION_RESOLVED,
        ].includes(translation.status as never) && (
          <Comments translation={translation} />
        )}

        <Separator />

        {translation.is_canceled ? (
          <Alert variant="destructive">
            <AlertDescription>취소된 번역입니다.</AlertDescription>
          </Alert>
        ) : isOwner ? (
          <div className="mt-4 flex flex-col gap-16">
            {translation.status === TRANSLATION_STATUS.QUOTE_SENT && (
              <SelectQuote translation={translation} />
            )}
            {translation.status === TRANSLATION_STATUS.TRANSLATOR_SELECTED && (
              <WaitTranslationStart translation={translation} />
            )}
            {translation.status === TRANSLATION_STATUS.TRANSLATION_BEGAN && (
              <WaitTranslationFinish translation={translation} />
            )}
            {translation.status === TRANSLATION_STATUS.TRANSLATION_SUBMITTED && (
              <ConfirmTranslation translation={translation} />
            )}
            {translation.status === TRANSLATION_STATUS.TRANSLATION_EDIT_REQUESTED && (
              <WaitTranslationUpdate translation={translation} />
            )}
            {translation.status === TRANSLATION_STATUS.TRANSLATION_RESOLVED && (
              <TranslationResult translation={translation} />
            )}
          </div>
        ) : null}
      </Stack>
    </Stack>
  );
}

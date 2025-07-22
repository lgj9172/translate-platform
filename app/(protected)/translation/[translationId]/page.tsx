"use client";

import { getTranslation } from "@/apis/translations";
import { getSelectedQuotation } from "@/apis/translations-quotations";
import { getMyTranslator } from "@/apis/translator";
import { getOtherUser, getUser } from "@/apis/user";
import Alert from "@/components/Alert";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Center } from "@/components/ui/center";
import { Group } from "@/components/ui/group";
import { Loader } from "@/components/ui/loader";
import { Stack } from "@/components/ui/stack";
import { Separator } from "@/components/ui/separator";
import { TRANSLATION_STATUS } from "@/types/entities";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/ko"; // 필요한 언어 로케일을 불러옵니다.
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaChevronLeft } from "react-icons/fa6";
import { NumericFormat } from "react-number-format";
import Comments from "./_component/Comments";
import ConfirmTranslation from "./_component/ConfirmTranslation";
import Payment from "./_component/Payment";
import ResubmitTranslation from "./_component/ResubmitTranslation";
import SelectQuote from "./_component/SelectQuote";
import SendQuote from "./_component/SendQuote";
import StartTranslation from "./_component/StartTranslation";
import SubmitTranslation from "./_component/SubmitTranslation";
import TranslationResult from "./_component/TranslationResult";
import Translator from "./_component/Translator";
import WaitConfirm from "./_component/WaitConfirm";
import WaitTranslationFinish from "./_component/WaitTranslationFinish";
import WaitTranslationStart from "./_component/WaitTranslationStart";
import WaitTranslationUpdate from "./_component/WaitTranslationUpdate";

export default function Page() {
  const { translationId } = useParams<{ translationId: string }>();

  const { data: translation, isLoading: isTranslationLoading } = useQuery({
    queryKey: ["translations", translationId],
    queryFn: () => getTranslation({ translationId }),
  });

  const { data: writer, isLoading: isWriterLoading } = useQuery({
    queryKey: ["user", translation?.user_id],
    queryFn: () => getOtherUser({ userId: translation?.user_id ?? "" }),
    enabled: !!translation?.user_id,
  });

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(),
  });

  const { data: selectedQuotation } = useQuery({
    queryKey: ["translations", translationId, "selected-quotation"],
    queryFn: () => getSelectedQuotation({ translationId }),
  });

  const { data: myTranslator } = useQuery({
    queryKey: ["translators", "me"],
    queryFn: () => getMyTranslator(),
  });

  if (isTranslationLoading || isWriterLoading || isUserLoading) {
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
            <Link href="/">
              <FaChevronLeft />
            </Link>
          </ActionIcon>
          <PageTitle>{translation.title}</PageTitle>
        </Group>
      </PageHeader>
      <Group className="justify-between">
        <Group gap={4}>
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
      <Stack>
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

          {translation.source_files.map(({ file_id }, index) => (
            <div key={`${file_id}-${index}`} className="flex gap-2">
              {file_id ? (
                <FileDownload fileId={file_id} />
              ) : (
                <span className="text-[#8B8C8D]">
                  원문 파일은 선택된 번역사만 다운로드 가능해요.
                </span>
              )}
            </div>
          ))}
        </InputSection>

        {translation.sample && (
          <InputSection>
            <LabelSection>
              <Label>원문 샘플</Label>
            </LabelSection>
            <div>{translation.sample}</div>
          </InputSection>
        )}

        <InputSection>
          <LabelSection>
            <Label>희망 번역료</Label>
          </LabelSection>
          <Fee value={translation.fee.value} unit={translation.fee.unit} />
        </InputSection>

        {[
          TRANSLATION_STATUS.TRANSLATOR_SELECTED,
          TRANSLATION_STATUS.TRANSLATION_BEGAN,
          TRANSLATION_STATUS.TRANSLATION_SUBMITTED,
          TRANSLATION_STATUS.TRANSLATION_EDIT_REQUESTED,
          TRANSLATION_STATUS.TRANSLATION_RESOLVED,
        ].find((status) => status === translation.status) && (
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
        ].find((status) => status === translation.status) && (
          <Comments translation={translation} />
        )}

        <Separator />

        {/* 취소된 번역 */}
        {translation.is_canceled ? (
          <Alert>취소된 번역입니다.</Alert>
        ) : (
          <div className="mt-4 flex flex-col gap-16">
            {/* 번역 상태: 견적 요청 */}
            {translation.status === TRANSLATION_STATUS.QUOTE_SENT && (
              <>
                {/* 내가 작성자인 경우 */}
                {translation.user_id === user?.user_id && (
                  <SelectQuote translation={translation} />
                )}
                {/* 내가 번역사인 경우 */}
                {user?.authorization?.is_translator && (
                  <SendQuote translation={translation} />
                )}
              </>
            )}

            {/* 번역 상태: 번역사 선택 완료 */}
            {translation.status === TRANSLATION_STATUS.TRANSLATOR_SELECTED && (
              <>
                {/* 내가 작성자인 경우 */}
                {translation.user_id === user?.user_id && (
                  <WaitTranslationStart translation={translation} />
                )}
                {/* 내가 담당 번역사인 경우 */}
                {user?.authorization?.is_translator &&
                  selectedQuotation?.translator_id ===
                    myTranslator?.translator_id && (
                    <StartTranslation translation={translation} />
                  )}
              </>
            )}

            {/* 번역 상태: 번역 시작 */}
            {translation.status === TRANSLATION_STATUS.TRANSLATION_BEGAN && (
              <>
                {/* 내가 작성자인 경우 */}
                {translation.user_id === user?.user_id && (
                  <WaitTranslationFinish translation={translation} />
                )}
                {/* 내가 담당 번역사인 경우 */}
                {user?.authorization?.is_translator &&
                  selectedQuotation?.translator_id ===
                    myTranslator?.translator_id && (
                    <SubmitTranslation translation={translation} />
                  )}
              </>
            )}

            {/* 번역 상태: 번역 제출 완료 */}
            {translation.status ===
              TRANSLATION_STATUS.TRANSLATION_SUBMITTED && (
              <>
                {/* 내가 작성자인 경우 */}
                {translation.user_id === user?.user_id && (
                  <ConfirmTranslation translation={translation} />
                )}
                {/* 내가 담당 번역사인 경우 */}
                {user?.authorization?.is_translator &&
                  selectedQuotation?.translator_id ===
                    myTranslator?.translator_id && (
                    <WaitConfirm translation={translation} />
                  )}
              </>
            )}

            {/* 번역 상태: 번역 수정 요청 */}
            {translation.status ===
              TRANSLATION_STATUS.TRANSLATION_EDIT_REQUESTED && (
              <>
                {/* 내가 작성자인 경우 */}
                {translation.user_id === user?.user_id && (
                  <WaitTranslationUpdate translation={translation} />
                )}
                {/* 내가 담당 번역사인 경우 */}
                {user?.authorization?.is_translator &&
                  selectedQuotation?.translator_id ===
                    myTranslator?.translator_id && (
                    <ResubmitTranslation translation={translation} />
                  )}
              </>
            )}

            {/* 번역 상태: 번역 확정 */}
            {translation.status === TRANSLATION_STATUS.TRANSLATION_RESOLVED && (
              <>
                {/* 내가 작성자인 경우 또는 내가 담당 번역사인 경우*/}
                {(translation.user_id === user?.user_id ||
                  (user?.authorization?.is_translator &&
                    selectedQuotation?.translator_id ===
                      myTranslator?.translator_id)) && (
                  <TranslationResult translation={translation} />
                )}
              </>
            )}
          </div>
        )}
      </Stack>
    </Stack>
  );
}

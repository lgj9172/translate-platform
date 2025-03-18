"use client";

import { getTranslation } from "@/apis/translations";
import { getOtherUser } from "@/apis/user";
import Alert from "@/components/Alert";
import Badge from "@/components/Badge";
import Card from "@/components/Card";
import FileDownload from "@/components/FileDownload";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import PageHeader from "@/components/PageHeader";
import PageTitle from "@/components/PageTitle";
import TranslationStatus from "@/components/TranslationStatus";
import {
  TRANSLATION_CURRENCY,
  TRANSLATION_CURRENCY_LABEL,
  TRANSLATION_STATUS,
} from "@/types/entities";
import { getCategoryLabel, getLanguageLabel } from "@/utils/converter/label";
import {
  ActionIcon,
  Avatar,
  Center,
  Divider,
  Group,
  Loader,
  Stack,
  Text,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/ko"; // 필요한 언어 로케일을 불러옵니다.
import Link from "next/link";
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

interface Props {
  params: { translationId: string };
}

export default function Page({ params: { translationId } }: Props) {
  const { data: translation, isLoading: isTranslationLoading } = useQuery({
    queryKey: ["translation", translationId],
    queryFn: () => getTranslation({ translationId }),
  });

  const { data: writer, isLoading: isWriterLoading } = useQuery({
    queryKey: ["user", translation?.user_id],
    queryFn: () => getOtherUser({ userId: translation?.user_id ?? "" }),
    enabled: !!translation?.user_id,
  });

  if (isTranslationLoading || isWriterLoading) {
    return (
      <Center mih="320px">
        <Loader color="orange" type="bars" />
      </Center>
    );
  }

  if (!translation) return null;

  return (
    <Stack w="full" h="full" gap={16}>
      <PageHeader>
        <Group>
          <ActionIcon
            variant="transparent"
            color="black"
            component={Link}
            href="/"
          >
            <FaChevronLeft />
          </ActionIcon>
          <PageTitle>{translation.title}</PageTitle>
        </Group>
      </PageHeader>

      <Group justify="space-between">
        <Group gap={4}>
          <Badge color="black">
            {`${getLanguageLabel(translation.source_language)[0]}${
              getLanguageLabel(translation.target_language)[0]
            }`}
          </Badge>
          {translation.categories.map((category) => (
            <Badge key={category} color="blue">
              {getCategoryLabel(category)}
            </Badge>
          ))}
        </Group>
        <TranslationStatus translation={translation} />
      </Group>

      <Card>
        <div className="flex gap-[8px]">
          <Avatar />
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
          <Text>{translation.description}</Text>
        </InputSection>

        <InputSection>
          <LabelSection>
            <Label>마감 기한</Label>
          </LabelSection>
          <Text>
            {dayjs(translation.deadline)
              .locale("ko")
              .format("YYYY.MM.DD hh:mm")}
          </Text>
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
            // eslint-disable-next-line react/no-array-index-key
            <div key={index} className="flex gap-2">
              {file_id ? (
                <FileDownload fileId={file_id} />
              ) : (
                <span className="text-[#8B8C8D]">
                  원문 파일은 선택된 번역가만 다운로드 가능해요.
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

          <div className="flex text-primary font-bold text-[16px]">
            <span>
              <NumericFormat
                displayType="text"
                value={translation.fee.value}
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

        <Divider />

        {/* 취소된 번역 */}
        {translation.is_canceled ? (
          <Alert>취소된 번역입니다.</Alert>
        ) : (
          <div className="mt-4 flex flex-col gap-16">
            {/* 번역 상태: 견적 요청 */}
            {translation.status === TRANSLATION_STATUS.QUOTE_SENT && (
              <>
                {/* 내가 작성자인 경우 */}
                {true && <SelectQuote translation={translation} />}
                {/* 내가 번역사인 경우 */}
                {true && <SendQuote translation={translation} />}
              </>
            )}

            {/* 번역 상태: 번역사 선택 완료 */}
            {translation.status === TRANSLATION_STATUS.TRANSLATOR_SELECTED && (
              <>
                {/* 내가 작성자인 경우 */}
                {true && <WaitTranslationStart translation={translation} />}
                {/* 내가 번역사인 경우 */}
                {true && <StartTranslation translation={translation} />}
              </>
            )}

            {/* 번역 상태: 번역 시작 */}
            {translation.status === TRANSLATION_STATUS.TRANSLATION_BEGAN && (
              <>
                {/* 내가 작성자인 경우 */}
                {true && <WaitTranslationFinish translation={translation} />}
                {/* 내가 번역사인 경우 */}
                {true && <SubmitTranslation translation={translation} />}
              </>
            )}

            {/* 번역 상태: 번역 제출 완료 */}
            {translation.status ===
              TRANSLATION_STATUS.TRANSLATION_SUBMITTED && (
              <>
                {/* 내가 작성자인 경우 */}
                {true && <ConfirmTranslation translation={translation} />}
                {/* 내가 번역사인 경우 */}
                {true && <WaitConfirm translation={translation} />}
              </>
            )}

            {/* 번역 상태: 번역 수정 요청 */}
            {translation.status ===
              TRANSLATION_STATUS.TRANSLATION_EDIT_REQUESTED && (
              <>
                {/* 내가 작성자인 경우 */}
                {true && <WaitTranslationUpdate translation={translation} />}
                {/* 내가 번역사인 경우 */}
                {true && <ResubmitTranslation translation={translation} />}
              </>
            )}

            {/* 번역 상태: 번역 확정 */}
            {translation.status === TRANSLATION_STATUS.TRANSLATION_RESOLVED && (
              <TranslationResult translation={translation} />
            )}
          </div>
        )}
      </Stack>
    </Stack>
  );
}

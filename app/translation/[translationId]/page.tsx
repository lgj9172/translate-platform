"use client";

import { getTranslation } from "@/apis/translations";
import Alert from "@/components/Alert";
import Badge from "@/components/Badge";
import Card from "@/components/Card";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import PageHeader from "@/components/PageHeader";
import PageTitle from "@/components/PageTitle";
import TranslationStatus from "@/components/TranslationStatus";
import { useFileDownload } from "@/hooks/useFileDownload";
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
  const { data: translation, isLoading } = useQuery({
    queryKey: ["translation", translationId],
    queryFn: () => getTranslation({ translationId }),
  });

  const { downloadFile } = useFileDownload();

  if (isLoading) {
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
            <div className="text-[14px] text-[#4B4D4D]">작성자</div>
            <div className="text-[14px] text-[#8B8C8D]">작성일</div>
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
            <Label>분량</Label>
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

          {translation.source_files.map(
            ({ char_with_blank, file, source_file_id }) => (
              <div key={source_file_id}>
                <button
                  type="button"
                  className="text-[#3B82F6] font-bold"
                  onClick={() => {
                    if (file.url) {
                      downloadFile(file.url, file.name);
                    }
                  }}
                >
                  <span>{file.name}</span>
                </button>
                <span className="text-[#8B8C8D]">
                  {" "}
                  (공백 포함{" "}
                  <NumericFormat
                    displayType="text"
                    value={char_with_blank}
                    thousandsGroupStyle="thousand"
                    thousandSeparator=","
                  />
                  자)
                </span>
              </div>
            ),
          )}
        </InputSection>

        <InputSection>
          <LabelSection>
            <Label>원문 샘플</Label>
          </LabelSection>
          <div>{translation.sample}</div>
        </InputSection>

        <InputSection>
          <LabelSection>
            <Label>희망 번역료</Label>
          </LabelSection>

          <div className="flex text-primary font-bold text-[16px]">
            <span>
              <NumericFormat
                displayType="text"
                value={translation.fee_value}
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

        {[
          "TRANSLATOR_SELECTED",
          "TRANSLATION_BEGAN",
          "TRANSLATION_SUBMITTED",
          "TRANSLATION_EDIT_REQUESTED",
          "TRANSLATION_RESOLVED",
        ].includes(translation.status) && (
          <>
            <Translator translation={translation} />
            <Payment translation={translation} />
          </>
        )}

        <Divider />

        {/* 취소된 번역 */}
        {translation.is_canceled ? (
          <Alert>취소된 번역입니다.</Alert>
        ) : (
          <div className="mt-4 flex flex-col gap-16">
            {/* 번역 상태: 견적 요청 */}
            {translation.status === "QUOTE_SENT" && (
              <>
                {/* 내가 작성자인 경우 */}
                {true && <SelectQuote translation={translation} />}
                {/* 내가 번역사인 경우 */}
                {true && <SendQuote translation={translation} />}
              </>
            )}

            {/* 번역 상태: 번역사 선택 완료 */}
            {translation.status === "TRANSLATOR_SELECTED" && (
              <>
                {/* 내가 작성자인 경우 */}
                {true && <WaitTranslationStart translation={translation} />}
                {/* 내가 번역사인 경우 */}
                {true && <StartTranslation translation={translation} />}
              </>
            )}

            {/* 번역 상태: 번역 시작 */}
            {translation.status === "TRANSLATION_BEGAN" && (
              <>
                {/* 내가 작성자인 경우 */}
                {true && <WaitTranslationFinish translation={translation} />}
                {/* 내가 번역사인 경우 */}
                {true && <SubmitTranslation translation={translation} />}
              </>
            )}

            {/* 번역 상태: 번역 제출 완료 */}
            {translation.status === "TRANSLATION_SUBMITTED" && (
              <>
                {/* 내가 작성자인 경우 */}
                {true && <ConfirmTranslation translation={translation} />}
                {/* 내가 번역사인 경우 */}
                {true && <WaitConfirm translation={translation} />}
              </>
            )}

            {/* 번역 상태: 번역 수정 요청 */}
            {translation.status === "TRANSLATION_EDIT_REQUESTED" && (
              <>
                {/* 내가 작성자인 경우 */}
                {true && <WaitTranslationUpdate translation={translation} />}
                {/* 내가 번역사인 경우 */}
                {true && <ResubmitTranslation translation={translation} />}
              </>
            )}

            {/* 번역 상태: 번역 확정 */}
            {translation.status === "TRANSLATION_RESOLVED" && (
              <TranslationResult translation={translation} />
            )}
          </div>
        )}
      </Stack>
    </Stack>
  );
}

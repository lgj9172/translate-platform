"use client";

import { getTranslation } from "@/apis/translations";
import Alert from "@/components/Alert";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Card from "@/components/Card";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import PageHeader from "@/components/PageHeader";
import PageTitle from "@/components/PageTitle";
import { getCategoryLabel, getLanguageLabel } from "@/utils/converter/label";
import {
  ActionIcon,
  Avatar,
  Center,
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
import { useFileDownload } from "@/hooks/useFileDownload";
import SendQuote from "./_component/SendQuote";
import SelectQuote from "./_component/SelectQuote";
import StartTranslation from "./_component/StartTranslation";
import WaitTranslationStart from "./_component/WaitTranslationStart";
import Translator from "./_component/Translator";
import Payment from "./_component/Payment";
import WaitTranslationFinish from "./_component/WaitTranslationFinish";
import SubmitTranslation from "./_component/SubmitTranslation";

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
      </Group>

      <Card>
        <div className="flex gap-[8px]">
          <Avatar src="avatar.png" />
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
              .format("YYYY.MM.DD A hh:mm")}
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

        {/* 취소된 번역 */}
        {translation.is_canceled ? (
          <Alert>취소된 번역입니다.</Alert>
        ) : (
          <div className="mt-4 flex flex-col gap-2">
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
                {true && (
                  <Alert>
                    번역이 완료되었습니다.
                    <br />
                    결과물을 확인하고 수정 요청 또는 확정 버튼을 눌러주세요.
                    <br /> 최대 3번 수정 요청이 가능합니다.
                  </Alert>
                )}
                {/* 내가 번역사인 경우 */}
                {true && (
                  <Alert>
                    번역이 제출되었습니다.
                    <br />
                    번역 요청자의 수정 요청 또는 확정을 기다리는 중입니다.
                  </Alert>
                )}
                <div className="flex justify-end gap-2">
                  {/* 내가 작성자인 경우 수정 요청 버튼 */}
                  {true && (
                    <Button size="md" variant="secondary">
                      수정 요청
                    </Button>
                  )}
                  {/* 내가 작성자인 경우 확정 버튼 */}
                  {true && (
                    <Button size="md" variant="primary">
                      확정
                    </Button>
                  )}
                </div>
              </>
            )}

            {/* 번역 상태: 번역 수정 요청 */}
            {translation.status === "TRANSLATION_EDIT_REQUESTED" && (
              <>
                {/* 내가 작성자인 경우 */}
                {true && <Alert>번역사가 결과물을 수정 중 입니다.</Alert>}
                {/* 내가 번역사인 경우 */}
                {true && (
                  <Alert>
                    번역 수정을 요청받았습니다.
                    <br />
                    번역 결과물을 수정하고 다시 제출해주세요.
                  </Alert>
                )}
                <div className="flex justify-end gap-2">
                  {/* 내가 번역사인 경우 번역 제출 버튼 */}
                  {true && (
                    <Button size="md" variant="primary">
                      번역 제출
                    </Button>
                  )}
                </div>
              </>
            )}

            {/* 번역 상태: 번역 확정 */}
            {translation.status === "TRANSLATION_RESOLVED" && (
              <>
                {/* 내가 작성자인 경우 */}
                {true && <Alert>번역이 완료되었습니다.</Alert>}
                {/* 내가 번역사인 경우 */}
                {true && <Alert>번역이 완료되었습니다.</Alert>}
                <div className="flex justify-end gap-2">
                  {/* 내가 작성자인 경우 리뷰 작성하기 버튼 */}
                  {true && (
                    <Button size="md" variant="primary">
                      리뷰 작성하기
                    </Button>
                  )}
                  {/* 내가 번역사인 경우 정산 버튼 */}
                  {true && (
                    <Button size="md" variant="primary">
                      정산
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </Stack>
    </Stack>
  );
}

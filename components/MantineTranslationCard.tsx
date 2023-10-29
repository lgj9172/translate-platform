import { Translation } from "@/apis/translations";
import {
  getCategoryLabel,
  getDday,
  getLanguageLabel,
} from "@/utils/converter/label";
import { Badge, Button, Card, Group, Stack, Text, Title } from "@mantine/core";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { BsFiletypeDoc, BsFiletypePpt, BsFiletypeTxt } from "react-icons/bs";
import { NumericFormat } from "react-number-format";

dayjs.extend(relativeTime);

interface Props {
  translation: Translation;
  hasControl?: boolean;
}

export default function MantineTranslationCard({
  translation: {
    id,
    categories,
    language,
    end_time,
    desired_fee,
    title,
    description,
    file,
    quantity,
    quotations,
  },
  hasControl = false,
}: Props) {
  return (
    <Card withBorder component={Link} href={`/translation/${id}`}>
      <Stack gap={8}>
        <Group justify="space-between">
          <Group gap={4}>
            <Badge color="gray">
              {`${getLanguageLabel(language.source)[0]}${
                getLanguageLabel(language.target)[0]
              }`}
            </Badge>
            {categories.map((category) => (
              <Badge key={category} color="blue">
                {getCategoryLabel(category)}
              </Badge>
            ))}
          </Group>
          <Group gap={4}>
            <Text c="red" size="xs" fw="bold">
              {getDday(end_time)}
            </Text>
          </Group>
        </Group>

        <Stack gap={4}>
          <Title order={5}>{title}</Title>
          <Text c="gray" size="xs" truncate>
            {description}
          </Text>
        </Stack>

        <Group justify="space-between">
          <Group gap={2}>
            <Text c="gray" size="sm">
              {file.type === "PPT" && <BsFiletypePpt />}
              {file.type === "WORD" && <BsFiletypeDoc />}
              {file.type === "TEXT" && <BsFiletypeTxt />}
            </Text>
            <Text c="gray" size="sm">
              {" / "}
              <NumericFormat
                displayType="text"
                value={quantity.value}
                thousandsGroupStyle="thousand"
                thousandSeparator=","
              />{" "}
              {quantity.unit === "CHAR" && "글자"}
              {quantity.unit === "WORD" && "단어"}
              {" / "}
              {quotations} 견적
            </Text>
          </Group>
          <Text c="orange" fw="bold">
            <NumericFormat
              displayType="text"
              value={desired_fee.value}
              thousandsGroupStyle="thousand"
              thousandSeparator=","
            />
            {desired_fee.unit === "KRW" && "원"}
            {desired_fee.unit === "USD" && "달러"}
          </Text>
        </Group>

        {hasControl && (
          <>
            <Group justify="space-between">
              <Group>
                <Badge variant="dot" color="yellow" radius="xs">
                  번역가 선택 대기중
                </Badge>
                <Badge variant="dot" color="yellow" radius="xs">
                  번역가 수락 대기중
                </Badge>
              </Group>
              <Group>
                <Button size="xs" color="orange">
                  견적 목록 보기
                </Button>
              </Group>
            </Group>
            <Group justify="space-between">
              <Group>
                <Badge variant="dot" color="green" radius="xs">
                  번역 진행중
                </Badge>
                <Badge variant="dot" color="blue" radius="xs">
                  번역 완료
                </Badge>
                <Badge variant="dot" color="yellow" radius="xs">
                  번역 수정 요청 대기중
                </Badge>
              </Group>
              <Group>
                <Button size="xs" color="orange" disabled>
                  번역 결과물 보기
                </Button>
              </Group>
            </Group>
            <Group justify="space-between">
              <Group>
                <Badge variant="dot" color="blue" radius="xs">
                  번역 완료 - 평가 대기중
                </Badge>
                <Badge variant="dot" color="blue" radius="xs">
                  번역 완료 - 평가 완료
                </Badge>
                <Badge variant="dot" color="red" radius="xs">
                  취소됨
                </Badge>
              </Group>
              <Group>
                <Button size="xs" color="orange">
                  번역 결과물 보기
                </Button>
                <Button size="xs" color="orange">
                  평가 하기
                </Button>
              </Group>
            </Group>
          </>
        )}
      </Stack>
    </Card>
  );
}

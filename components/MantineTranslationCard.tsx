import { Translation } from "@/apis/translations";
import {
  getCategoryLabel,
  getDday,
  getLanguageLabel,
} from "@/utils/converter/label";
import { Badge, Card, Group, Stack, Text, Title } from "@mantine/core";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { BsFiletypeDoc, BsFiletypePpt, BsFiletypeTxt } from "react-icons/bs";
import { NumericFormat } from "react-number-format";

dayjs.extend(relativeTime);

interface Props {
  translation: Translation;
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
              {/* {dayjs(end_time).fromNow()} */}
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
      </Stack>
    </Card>
  );
}

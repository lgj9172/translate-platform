import { Category } from "@/apis/translations";
import { PostTranslatorFormSchema } from "@/model/translator";
import { Chip, Group, Input, Stack, Title } from "@mantine/core";
import { useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { z } from "zod";

export default function Speciality() {
  const categoryOptions = useMemo(
    () => [
      { label: "IT/기술", value: "IT" },
      { label: "경제/금융", value: "FINANCE" },
      { label: "콘텐츠 자막", value: "CONTENTS" },
      { label: "게임", value: "GAME" },
      { label: "법률/특허", value: "LAW" },
      { label: "의료", value: "MEDICAL" },
      { label: "건설", value: "CONSTRUCTION" },
      { label: "마케팅", value: "MARKETING" },
      { label: "문학", value: "LITERATURE" },
      { label: "기타", value: "ETC" },
    ],
    [],
  );

  const { control } =
    useFormContext<z.infer<typeof PostTranslatorFormSchema>>();

  return (
    <Stack gap="xs">
      <Group justify="space-between">
        <Title order={4}>전문 분야 (최대 3개)</Title>
        <Group />
      </Group>
      <Controller
        name="categories"
        control={control}
        render={({ field: { onChange, ...field }, fieldState: { error } }) => (
          <Input.Wrapper labelProps={{}} error={error?.message}>
            <Chip.Group
              multiple
              {...field}
              onChange={(v) => onChange(v as (typeof Category)[number][])}
            >
              <Group mt={5} mb={5} gap="xs">
                {categoryOptions.map((c) => (
                  <Chip
                    key={c.value}
                    value={c.value}
                    color="orange"
                    variant="outline"
                  >
                    {c.label}
                  </Chip>
                ))}
              </Group>
            </Chip.Group>
          </Input.Wrapper>
        )}
      />
    </Stack>
  );
}

import { PostTranslatorFormSchema } from "@/model/translator";
import { Group, Stack, Textarea, Title } from "@mantine/core";
import { useFormContext } from "react-hook-form";
import { z } from "zod";

export default function SelfIntroduction() {
  const { register } =
    useFormContext<z.infer<typeof PostTranslatorFormSchema>>();

  return (
    <Stack gap="xs">
      <Group justify="space-between">
        <Title order={4}>자기소개</Title>
        <Group />
      </Group>
      <Textarea
        minRows={3}
        autosize
        color="orange"
        {...register("description")}
        placeholder="본인에 대한 간단한 소개를 입력하세요."
      />
    </Stack>
  );
}

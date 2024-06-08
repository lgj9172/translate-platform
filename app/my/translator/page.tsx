"use client";

import PageHeader from "@/components/PageHeader";
import {
  PostTranslatorFormDefaultValue,
  PostTranslatorFormSchema,
} from "@/model/translator";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionIcon, Button, Group, Stack } from "@mantine/core";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";
import { FaArrowLeft } from "react-icons/fa6";
import PageTitle from "@/components/PageTitle";
import Careers from "./_component/Careers";
import Educations from "./_component/Educations";
import SelfIntroduction from "./_component/SelfIntroduction";
import Speciality from "./_component/Speciality";
import Certifications from "./_component/Certifications";
import Samples from "./_component/Samples";

export default function Page() {
  const methods = useForm({
    resolver: zodResolver(PostTranslatorFormSchema),
    defaultValues: PostTranslatorFormDefaultValue,
    mode: "onChange",
  });

  const handleSubmitSuccess = () => {
    alert("성공");
  };

  return (
    <form onSubmit={methods.handleSubmit(handleSubmitSuccess)}>
      <FormProvider {...methods}>
        <Stack>
          <Group>
            <ActionIcon
              variant="transparent"
              color="black"
              component={Link}
              href="/my"
            >
              <FaArrowLeft />
            </ActionIcon>
          </Group>

          <PageHeader>
            <PageTitle>번역사 등록 신청</PageTitle>
          </PageHeader>

          <Stack gap={48}>
            <Speciality />
            <SelfIntroduction />
            <Educations />
            <Careers />
            <Certifications />
            <Samples />
            <div className="flex justify-end">
              <Button type="submit" color="orange" className="w-fit">
                제출
              </Button>
            </div>
          </Stack>
        </Stack>
      </FormProvider>
    </form>
  );
}

"use client";

import { getFaqs } from "@/apis/faqs";
import PageHeader from "@/components/PageHeader";
import PageTitle from "@/components/PageTitle";
import { ActionIcon, Center, Group, Loader, Stack } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa6";
import Alert from "@/components/Alert";
import FaqCard from "./_component/FAQCard";

export default function Page() {
  const {
    data: faqs,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["faqs"],
    queryFn: () => getFaqs({ params: { start: 0, size: 10 } }),
  });

  return (
    <Stack>
      <PageHeader>
        <Group>
          <ActionIcon
            variant="transparent"
            color="black"
            component={Link}
            href="/cs"
          >
            <FaChevronLeft />
          </ActionIcon>
          <PageTitle>자주하는 질문(FAQ)</PageTitle>
        </Group>
      </PageHeader>

      {isLoading && (
        <Center mih="320px">
          <Loader color="orange" type="bars" />
        </Center>
      )}
      {isError && <Alert>자주하는 질문을 불러오는 중 오류가 발생했어요.</Alert>}
      {faqs?.length === 0 && <Alert>아직 자주하는 질문이 없어요.</Alert>}
      {faqs?.length !== 0 && (
        <div className="flex flex-col gap-[8px]">
          {faqs?.map((faq) => <FaqCard key={faq.faq_id} faq={faq} />)}
        </div>
      )}
    </Stack>
  );
}

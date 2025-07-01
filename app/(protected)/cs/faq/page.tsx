"use client";

import { getFaqs } from "@/apis/faqs";
import PageHeader from "@/components/PageHeader";
import PageTitle from "@/components/PageTitle";
import { ActionIcon } from "@/components/ui/action-icon";
import { Center } from "@/components/ui/center";
import { Group } from "@/components/ui/group";
import { Loader } from "@/components/ui/loader";
import { Stack } from "@/components/ui/stack";
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
          <ActionIcon variant="ghost" asChild>
            <Link href="/cs">
              <FaChevronLeft />
            </Link>
          </ActionIcon>
          <PageTitle>자주하는 질문(FAQ)</PageTitle>
        </Group>
      </PageHeader>

      {isLoading && (
        <Center className="h-[500px]">
          <Loader />
        </Center>
      )}
      {isError && <Alert>자주하는 질문을 불러오는 중 오류가 발생했어요.</Alert>}
      {faqs?.length === 0 && <Alert>아직 자주하는 질문이 없어요.</Alert>}
      {faqs?.length !== 0 && (
        <div className="flex flex-col gap-[8px]">
          {faqs?.map((faq) => (
            <FaqCard key={faq.faq_id} faq={faq} />
          ))}
        </div>
      )}
    </Stack>
  );
}

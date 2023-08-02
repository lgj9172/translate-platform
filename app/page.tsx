"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Button, HStack, Spinner } from "@chakra-ui/react";
import { getTranslations } from "@/apis/translations";
import TranslationCard from "@/components/TranslationCard";
import Checkbox from "@/components/Checkbox";

export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ["translations"],
    queryFn: getTranslations,
  });

  return (
    <div className="flex flex-col">
      {/* <Carousel /> */}

      <div className="h-[53px] mx-[20px] flex justify-between items-end">
        <HStack>
          <span className="font-[700] text-[20px] leading-[30px] tracking-[-0.005em]">
            번역 대기중
          </span>
          <button
            type="button"
            className="px-[14px] py-[7px] bg-[#F0F0F0] rounded-[8px] font-[700] text-[12px] leading-[19px] tracking-[-0.004em] text-[#787878]"
          >
            필터
          </button>
        </HStack>
        <Checkbox text="이게 이렇게 어려울줄이야" />
        <HStack>
          <Link href="/translation/create" passHref legacyBehavior prefetch>
            <Button colorScheme="orange" size="sm">
              번역 요청
            </Button>
          </Link>
        </HStack>
      </div>

      {isLoading && (
        <div className="h-80 flex justify-center items-center">
          <Spinner color="orange" />
        </div>
      )}
      <div className="flex flex-col divide-y">
        {data?.results?.map((translation) => (
          <TranslationCard key={translation.id} translation={translation} />
        ))}
      </div>
    </div>
  );
}

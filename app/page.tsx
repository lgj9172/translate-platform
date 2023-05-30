"use client";

import { getTranslations } from "@/apis/translations";
import Carousel from "@/components/Carousel";
import TranslationCard from "@/components/TranslationCard";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data: translations } = useQuery({
    queryKey: ["translations"],
    queryFn: getTranslations,
  });

  return (
    <div className="flex flex-col">
      <Carousel />

      <div className="h-[53px] mx-[20px] flex justify-between items-end">
        <span className="font-[700] text-[20px] leading-[30px] tracking-[-0.005em]">
          번역 대기중
        </span>
        <button className="px-[14px] py-[7px] bg-[#F0F0F0] rounded-[8px] font-[700] text-[12px] leading-[19px] tracking-[-0.004em] text-[#787878]">
          필터
        </button>
      </div>

      <div className="flex flex-col divide-y">
        {translations?.map((translation) => (
          <TranslationCard key={translation.id} translation={translation} />
        ))}
      </div>
    </div>
  );
}

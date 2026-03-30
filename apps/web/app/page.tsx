import Link from "next/link";
import { Button } from "@/components/ui/button";
import TranslationRequestButton from "./_components/TranslationRequestButton";

function HeroSection() {
  return (
    <section className="py-16 lg:py-24 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
      <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6 lg:max-w-xl">
        <span className="text-sm font-medium text-primary bg-orange-50 px-3 py-1 rounded-full">
          통번역 전문가 플랫폼
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-gray-900">
          투명한 가격비교,
          <br />
          <span className="text-primary">검증된 번역사</span>와 함께
        </h1>
        <p className="text-gray-500 text-base lg:text-lg leading-relaxed">
          전문 번역사의 이력과 샘플을 직접 확인하고
          <br className="hidden sm:block" />
          합리적인 가격으로 번역을 의뢰하세요.
        </p>
        <TranslationRequestButton />
      </div>
      <div className="hidden lg:flex items-center justify-center flex-1">
        <div className="w-full max-w-sm aspect-square rounded-3xl bg-orange-50 flex items-center justify-center">
          <span className="text-8xl">🌐</span>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-3 p-5 rounded-2xl bg-gray-50 hover:bg-orange-50 transition-colors">
      <span className="text-3xl">{icon}</span>
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: "🔍",
      title: "검증된 번역사",
      description:
        "학력, 경력, 자격증, 샘플 번역문을 직접 확인하고 신뢰할 수 있는 번역사를 선택하세요.",
    },
    {
      icon: "💰",
      title: "투명한 가격 비교",
      description:
        "여러 번역사의 견적을 한눈에 비교해 가장 합리적인 선택을 할 수 있어요.",
    },
    {
      icon: "💬",
      title: "직접 소통",
      description:
        "번역 진행 중에도 번역사와 직접 소통하며 원하는 결과물을 만들어가세요.",
    },
    {
      icon: "🌐",
      title: "다양한 언어 지원",
      description:
        "영어, 일본어, 중국어 등 다양한 언어의 전문 번역사가 대기하고 있어요.",
    },
  ];

  return (
    <section className="py-12 lg:py-16 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
          왜 플루언스인가요?
        </h2>
        <p className="text-gray-500 text-sm lg:text-base">
          플루언스가 다른 이유를 확인해보세요.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "번역 요청 등록",
      desc: "번역할 문서와 요구사항을 입력해요.",
    },
    { step: "02", title: "견적 수신", desc: "번역사들이 견적을 제출해요." },
    {
      step: "03",
      title: "번역사 선택",
      desc: "이력과 견적을 비교해 선택해요.",
    },
    { step: "04", title: "번역 완료", desc: "완성된 번역물을 전달받아요." },
  ];

  return (
    <section className="py-12 lg:py-16 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
          이용 방법
        </h2>
        <p className="text-gray-500 text-sm lg:text-base">
          간단한 4단계로 번역을 시작하세요.
        </p>
      </div>

      {/* Mobile: vertical timeline */}
      <div className="flex flex-col gap-0 lg:hidden">
        {steps.map((s, i) => (
          <div key={s.step} className="flex gap-4 relative">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0 z-10">
                {s.step}
              </div>
              {i < steps.length - 1 && (
                <div className="w-px flex-1 bg-orange-200 my-1" />
              )}
            </div>
            <div className="pb-6 flex flex-col gap-0.5">
              <p className="font-semibold text-sm text-gray-900">{s.title}</p>
              <p className="text-sm text-gray-500">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: horizontal steps */}
      <div className="hidden lg:grid grid-cols-4 gap-4">
        {steps.map((s, i) => (
          <div key={s.step} className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center shrink-0">
                {s.step}
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 h-px bg-orange-200" />
              )}
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-gray-900">{s.title}</p>
              <p className="text-sm text-gray-500">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="py-12 lg:py-16">
      <div className="bg-orange-50 rounded-3xl p-8 lg:p-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
            번역사이신가요?
          </h2>
          <p className="text-sm lg:text-base text-gray-500">
            플루언스에서 전문성을 인정받고 다양한 번역 의뢰를 받아보세요.
          </p>
        </div>
        <Link href="/signin" className="lg:shrink-0">
          <Button
            variant="outline"
            className="w-full lg:w-auto border-primary text-primary hover:bg-white px-8"
          >
            번역사로 시작하기
          </Button>
        </Link>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col divide-y divide-gray-100">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CtaSection />
    </div>
  );
}

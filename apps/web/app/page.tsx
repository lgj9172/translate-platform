import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import TranslationRequestButton from "./_components/TranslationRequestButton";

function HeroSection() {
  return (
    <section className="py-16 flex flex-col items-center text-center gap-6">
      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-primary bg-orange-50 px-3 py-1 rounded-full self-center">
          통번역 전문가 플랫폼
        </span>
        <h1 className="text-3xl font-bold leading-tight text-gray-900">
          투명한 가격비교,
          <br />
          <span className="text-primary">검증된 번역사</span>와 함께
        </h1>
        <p className="text-gray-500 text-base leading-relaxed">
          전문 번역사의 이력과 샘플을 직접 확인하고
          <br />
          합리적인 가격으로 번역을 의뢰하세요.
        </p>
      </div>
      <TranslationRequestButton />
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
    <div className="flex gap-4 p-4 rounded-xl bg-gray-50">
      <span className="text-2xl shrink-0">{icon}</span>
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
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
    <section className="py-8 flex flex-col gap-4">
      <h2 className="text-xl font-bold text-gray-900">
        왜 플루언스인가요?
      </h2>
      <div className="flex flex-col gap-3">
        {features.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    { step: "01", title: "번역 요청 등록", desc: "번역할 문서와 요구사항을 입력해요." },
    { step: "02", title: "견적 수신", desc: "번역사들이 견적을 제출해요." },
    { step: "03", title: "번역사 선택", desc: "이력과 견적을 비교해 선택해요." },
    { step: "04", title: "번역 완료", desc: "완성된 번역물을 전달받아요." },
  ];

  return (
    <section className="py-8 flex flex-col gap-4">
      <h2 className="text-xl font-bold text-gray-900">이용 방법</h2>
      <div className="flex flex-col gap-0">
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
    </section>
  );
}

function CtaSection() {
  return (
    <section className="py-8">
      <div className="bg-orange-50 rounded-2xl p-6 flex flex-col gap-4 text-center">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold text-gray-900">
            번역사이신가요?
          </h2>
          <p className="text-sm text-gray-500">
            플루언스에서 전문성을 인정받고
            <br />
            다양한 번역 의뢰를 받아보세요.
          </p>
        </div>
        <Link href="/signin">
          <Button variant="outline" className="w-full border-primary text-primary hover:bg-orange-50">
            번역사로 시작하기
          </Button>
        </Link>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <Separator />
      <FeaturesSection />
      <Separator />
      <HowItWorksSection />
      <Separator />
      <CtaSection />
    </div>
  );
}

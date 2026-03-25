"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

export default function TranslationRequestButton() {
  const router = useRouter();

  const handleClick = async () => {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      router.push("/translation");
    } else {
      router.push("/signin");
    }
  };

  return (
    <Button size="lg" onClick={handleClick}>
      번역 요청하기
    </Button>
  );
}

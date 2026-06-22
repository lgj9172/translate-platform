"use client";

import KakaoLogo from "@assets/logos/signin-kakao.svg";
import type * as React from "react";
import Typography from "@/components/Typography";
import { createClient } from "@/utils/supabase/client";

interface SocialButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  text: string;
  bgColor: string;
  textColor?: string;
  border?: boolean;
}

function SocialButton({
  onClick,
  icon,
  text,
  bgColor,
  textColor = "text-white",
  border,
}: SocialButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-80 py-4 rounded-lg flex justify-center items-center ${bgColor} ${
        border ? "border border-gray-200" : ""
      }`}
    >
      <span className="absolute left-5">{icon}</span>
      <span className={`font-bold text-base tracking-tight ${textColor}`}>
        {text}
      </span>
    </button>
  );
}

export default function Signin() {
  const supabase = createClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://localhost:3000";

  const signInWithKakao = () => {
    supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: `${appUrl}/auth/callback`,
      },
    });
  };

  const socialButtons: Array<{
    provider: string;
    onClick: () => void;
    icon: React.ReactNode;
    bgColor: string;
    textColor?: string;
    text: string;
    border?: boolean;
  }> = [
    {
      provider: "kakao" as const,
      onClick: signInWithKakao,
      icon: <KakaoLogo />,
      bgColor: "bg-[#F9E000]",
      textColor: "text-black",
      text: "카카오톡으로 시작하기",
    },
  ];

  return (
    <div className="flex-1 h-full w-full flex flex-col justify-center items-center py-20">
      <div className="space-y-10">
        <Typography type="title-20" bold align="center">
          <span className="text-primary">투명한 가격비교</span>
          <br />
          검증된 번역사
        </Typography>

        <div className="flex flex-col gap-3">
          {socialButtons.map((button) => (
            <SocialButton
              key={button.provider}
              onClick={button.onClick}
              icon={button.icon}
              text={button.text}
              bgColor={button.bgColor}
              textColor={button.textColor}
              border={button.border}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

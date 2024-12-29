import GoogleLogo from "@assets/logos/signin-google.svg";
import KakaoLogo from "@assets/logos/signin-kakao.svg";
import NaverLogo from "@assets/logos/signin-naver.svg";
import Link from "next/link";
import Typography from "@/components/Typography";

interface SocialButtonProps {
  href: string;
  icon: React.ReactNode;
  text: string;
  bgColor: string;
  textColor?: string;
  border?: boolean;
}

function SocialButton({
  href,
  icon,
  text,
  bgColor,
  textColor = "text-white",
  border,
}: SocialButtonProps) {
  return (
    <Link href={href}>
      <button
        type="button"
        className={`relative w-80 py-4 rounded-lg flex justify-center items-center ${bgColor} ${
          border ? "border border-gray-200" : ""
        }`}
      >
        <span className="absolute left-5">{icon}</span>
        <span className={`font-bold text-base tracking-tight ${textColor}`}>
          {text}
        </span>
      </button>
    </Link>
  );
}

export default function Signin() {
  const socialButtons = [
    {
      provider: "naver",
      url: `${process.env.NEXT_PUBLIC_NAVER_API}?${new URLSearchParams({
        client_id: `${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}`,
        redirect_uri: `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI}`,
        response_type: "code",
        state: "",
      }).toString()}`,
      icon: <NaverLogo />,
      bgColor: "bg-[#03C75A]",
      text: "네이버로 시작하기",
    },
    {
      provider: "kakao",
      url: `${process.env.NEXT_PUBLIC_KAKAO_API}?${new URLSearchParams({
        client_id: `${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}`,
        redirect_uri: `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}`,
        response_type: "code",
      }).toString()}`,
      icon: <KakaoLogo />,
      bgColor: "bg-[#F9E000]",
      textColor: "text-black",
      text: "카카오톡으로 시작하기",
    },
    {
      provider: "google",
      url: `${process.env.NEXT_PUBLIC_GOOGLE_API}?${new URLSearchParams({
        client_id: `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`,
        redirect_uri: `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}`,
        response_type: "code",
        scope: "https://www.googleapis.com/auth/userinfo.email",
      }).toString()}`,
      icon: <GoogleLogo />,
      bgColor: "bg-white",
      textColor: "text-black",
      border: true,
      text: "Google로 시작하기",
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
              href={button.url}
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

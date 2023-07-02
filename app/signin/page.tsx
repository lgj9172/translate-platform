import GoogleLogo from "@assets/logos/signin-google.svg";
import KakaoLogo from "@assets/logos/signin-kakao.svg";
import NaverLogo from "@assets/logos/signin-naver.svg";
import Link from "next/link";
import Typography from "@/components/Typography";

export default function Signin() {
  const kakaoParams = {
    client_id: `${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}`,
    redirect_uri: `${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}`,
    response_type: "code",
  };

  const kakaoUrl = `${process.env.NEXT_PUBLIC_KAKAO_API}?${new URLSearchParams(
    kakaoParams
  ).toString()}`;

  const naverParams = {
    client_id: `${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}`,
    redirect_uri: `${process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI}`,
    response_type: "code",
    state: "",
  };

  const naverUrl = `${process.env.NEXT_PUBLIC_NAVER_API}?${new URLSearchParams(
    naverParams
  ).toString()}`;

  const googleParams = {
    client_id: `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`,
    redirect_uri: `${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}`,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/userinfo.email",
  };

  const googleUrl = `${
    process.env.NEXT_PUBLIC_GOOGLE_API
  }?${new URLSearchParams(googleParams).toString()}`;

  return (
    <div className="flex-1 h-full w-full flex flex-col justify-center items-center">
      <div>
        <div className="mb-[40px] flex flex-col items-center">
          <Typography type="title-20" bold align="center">
            <span className="text-[#F8730A]">투명한 가격비교</span>
            <br />
            검증된 번역사
          </Typography>
        </div>
        <div className="flex flex-col justify-center items-stretch gap-3">
          <Link href={naverUrl} passHref legacyBehavior>
            <button
              type="button"
              className="relative w-[320px] py-[16px] bg-[#03C75A] rounded-[8px] flex justify-center items-center"
            >
              <span className="absolute left-[20px]">
                <NaverLogo />
              </span>
              <span className="font-[700] text-[16px] leading-[24px] tracking-[-0.004em] text-[#FFFFFF]">
                네이버로 시작하기
              </span>
            </button>
          </Link>
          <Link href={kakaoUrl} passHref legacyBehavior>
            <button
              type="button"
              className="relative w-[320px] py-[16px] bg-[#F9E000] rounded-[8px] flex justify-center items-center"
            >
              <span className="absolute left-[20px]">
                <KakaoLogo />
              </span>
              <span className="font-[700] text-[16px] leading-[24px] tracking-[-0.004em] text-[#000000]">
                카카오톡으로 시작하기
              </span>
            </button>
          </Link>
          <Link href={googleUrl} passHref legacyBehavior>
            <button
              type="button"
              className="relative w-[320px] py-[16px] bg-[#FFFFFF] rounded-[8px] flex justify-center items-center border border-[#D7D8D9]              "
            >
              <span className="absolute left-[20px]">
                <GoogleLogo />
              </span>
              <span className="font-[700] text-[16px] leading-[24px] tracking-[-0.004em] text-[#000000]">
                Google로 시작하기
              </span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

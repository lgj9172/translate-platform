"use client";

import PersonIcon from "@assets/icons/person.svg";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const handleClickProfile = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div className="relative p-[20px] flex justify-between items-center z-10">
      <div className="flex">
        <Link
          href="/"
          className="w-[100px] h-[24px] bg-[#D9D9D9] flex justify-center items-center"
        >
          Fluence
        </Link>
      </div>
      <div className="flex gap-[16px] items-center">
        <Link
          href="/faq"
          className="font-[400] text-[14px] leading-[18px] tracking-[-0.004em] text-[#4F535A]"
        >
          고객센터
        </Link>
        <Link
          href="/notice"
          className="font-[400] text-[14px] leading-[18px] tracking-[-0.004em] text-[#4F535A]"
        >
          공지사항
        </Link>
        <button type="button" onClick={handleClickProfile}>
          <PersonIcon />
        </button>
      </div>
      {open && (
        <div className="absolute top-[64px] left-0 right-0 px-[20px] pb-[20px] bg-white flex flex-col gap-[16px]">
          <Link
            href="/profile"
            className="font-[400] text-[14px] leading-[18px] tracking-[-0.004em] text-[#4F535A]"
          >
            프로필
          </Link>
          <Link
            href="/my-page"
            className="font-[400] text-[14px] leading-[18px] tracking-[-0.004em] text-[#4F535A]"
          >
            나의 요청
          </Link>
          <Link
            href="/signin"
            className="font-[400] text-[14px] leading-[18px] tracking-[-0.004em] text-[#4F535A]"
          >
            로그인
          </Link>
        </div>
      )}
    </div>
  );
}

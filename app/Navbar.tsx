"use client";

import PersonIcon from "@assets/icons/person.svg";
import { Heading } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const ref = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);

  const handleClickProfile = () => {
    setOpen((prev) => !prev);
  };

  const handleClickLinks = () => {
    setOpen(false);
  }

  useEffect(() => {
    const handleOutsideClose = (e: MouseEvent) => {
      if (
        open &&
        ref.current &&
        !ref.current.contains(e.target as Node)
      )
        setOpen(false);
    };
    document.addEventListener("click", handleOutsideClose);
    return () => document.removeEventListener("click", handleOutsideClose);
  });


  return (
    <div ref={ref} className="relative p-[20px] flex justify-between items-center z-10">
      <div className="flex">
        <Link href="/" className="flex justify-center items-center">
          <Heading size="sm" color="orange.500">
            Fluence
          </Heading>
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
        <button type="button" onClick={handleClickProfile} aria-label="profile">
          <PersonIcon />
        </button>
      </div>
      {open && (
        <div role="presentation" onClick={handleClickLinks} className="absolute top-[64px] left-0 right-0 px-[20px] pb-[20px] bg-white flex flex-col gap-[16px] shadow-[0px_12px_18px_-12px_rgba(215,216,217,0.25)]">
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

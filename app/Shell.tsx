"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/DropdownMenu";
import useUser from "@/hooks/useUser";
import FluenceBi from "@assets/icons/fluence-bi.svg";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import { Bell, HeadphonesIcon, HelpCircle, LogOut, User } from "lucide-react";
import Link from "next/link";
import React, { ReactNode, useState } from "react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Group } from "@/components/ui/group";

function HeaderMenu() {
  const { user, signOut } = useUser();

  const handleClickSignout = () => {
    signOut();
  };

  // 로그인되지 않은 경우 로그인/회원가입 링크 표시
  if (!user) {
    return (
      <Link
        href="/signin"
        className="text-sm text-gray-600 hover:text-orange-500 transition-colors"
      >
        로그인/회원가입
      </Link>
    );
  }

  // 로그인된 경우 기존 아바타 드롭다운 메뉴 표시
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="사용자 메뉴"
          className="p-1.5 rounded-full text-gray-500 hover:bg-gray-50 hover:text-primary focus:outline-hidden"
        >
          <Avatar>
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 bg-white shadow-lg rounded-lg border-gray-100"
      >
        <DropdownMenuLabel className="text-xs font-medium text-gray-400 px-2 py-1.5">
          고객센터
        </DropdownMenuLabel>
        <DropdownMenuGroup className="px-1">
          <DropdownMenuItem asChild className="rounded-md">
            <Link
              href="/cs/notice"
              className="text-sm flex items-center gap-2 w-full text-gray-700 hover:text-primary"
            >
              <Bell className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
              공지사항
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="rounded-md">
            <Link
              href="/cs/faq"
              className="text-sm flex items-center gap-2 w-full text-gray-700 hover:text-primary"
            >
              <HelpCircle className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
              자주하는 질문(FAQ)
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="rounded-md">
            <Link
              href="/cs/ask"
              className="text-sm flex items-center gap-2 w-full text-gray-700 hover:text-primary"
            >
              <HeadphonesIcon
                className="w-4 h-4 text-gray-400"
                strokeWidth={1.5}
              />
              1:1 문의
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuLabel className="text-xs font-medium text-gray-400 px-2 py-1.5">
          개인
        </DropdownMenuLabel>
        <DropdownMenuGroup className="px-1">
          <DropdownMenuItem asChild className="rounded-md">
            <Link
              href="/my"
              className="text-sm flex items-center gap-2 w-full text-gray-700 hover:text-primary"
            >
              <User className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
              마이 페이지
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleClickSignout}
            className="text-sm rounded-md flex items-center gap-2 hover:text-primary"
          >
            <LogOut className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
            로그아웃
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Shell({ children }: { children: ReactNode }) {
  const [openedTOU, setOpenedTOU] = useState(false);
  const [openedRP, setOpenedRP] = useState(false);

  const handleClickTOU = () => {
    setOpenedTOU(true);
  };

  const handleClickRP = () => {
    setOpenedRP(true);
  };

  const handleChangeTOU = (open: boolean) => {
    if (!open) {
      setOpenedTOU(open);
    }
  };

  const handleChangeRP = (open: boolean) => {
    if (!open) {
      setOpenedRP(open);
    }
  };

  return (
    <div className="min-w-[360px] max-w-[768px] container mx-auto">
      <div className="sticky z-10 top-0 bg-white">
        <div className="h-[48px] px-[20px] flex justify-between items-center">
          <Link href="/">
            <FluenceBi />
          </Link>
          <Group>
            <Link
              href="/cs"
              className="text-sm text-gray-600 hover:text-orange-500 transition-colors"
            >
              고객센터
            </Link>
            <HeaderMenu />
          </Group>
        </div>
        <div className="px-[20px] pb-2">
          <Breadcrumb />
        </div>
      </div>
      <div className="p-[20px]">
        {children}
        <footer className="mt-8 pt-6 min-h-[200px]">
          <Separator className="mb-6" />
          <div className="text-left mb-4">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              플루언스 고객센터
            </h3>
            <p className="text-2xl font-bold text-orange-500 mb-3">
              070-8383-6353
            </p>
            <div className="text-sm text-gray-600 space-y-1 mb-4">
              <p>운영시간: 평일 09:00 - 18:00 (점심시간: 12:00 - 13:00)</p>
            </div>
            <Group>
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleClickTOU();
                }}
                className="text-sm text-gray-600 hover:text-orange-500 transition-colors"
              >
                이용약관
              </Link>
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleClickRP();
                }}
                className="text-sm text-gray-600 hover:text-orange-500 transition-colors"
              >
                환불규정
              </Link>
            </Group>
          </div>
        </footer>

        <Dialog open={openedTOU} onOpenChange={handleChangeTOU}>
          <DialogContent
            className="h-[700px] p-0 overflow-hidden flex flex-col"
            style={{ maxWidth: "none", width: "95vw" }}
          >
            <DialogHeader className="px-6 py-4 border-b bg-gray-50/50">
              <DialogTitle className="text-lg font-semibold text-gray-900">
                이용약관
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 p-4 md:p-6 overflow-hidden">
              <div className="h-full rounded-lg border border-gray-200 bg-white overflow-hidden">
                <iframe
                  src="/assets/html/terms_of_use_230102.html"
                  className="w-full h-full border-0"
                  title="이용약관"
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={openedRP} onOpenChange={handleChangeRP}>
          <DialogContent
            className="h-[700px] p-0 overflow-hidden flex flex-col"
            style={{ maxWidth: "none", width: "95vw" }}
          >
            <DialogHeader className="px-6 py-4 border-b bg-gray-50/50">
              <DialogTitle className="text-lg font-semibold text-gray-900">
                환불규정
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 p-4 md:p-6 overflow-hidden">
              <div className="h-full rounded-lg border border-gray-200 bg-white overflow-hidden">
                <iframe
                  src="/assets/html/terms_of_use_230102.html#_msoanchor_2"
                  className="w-full h-full border-0"
                  title="환불규정"
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

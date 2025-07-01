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
import { Title } from "@/components/ui/title";
import {
  Bell,
  HeadphonesIcon,
  HelpCircle,
  LogIn,
  LogOut,
  User,
} from "lucide-react";
import Link from "next/link";
import { ReactNode, useState } from "react";
import CustomerSupport from "../components/CustomerSupport";

function HeaderMenu() {
  const { user, signOut } = useUser();

  const handleClickSignout = () => {
    signOut();
  };

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
          {!user ? (
            <DropdownMenuItem
              asChild
              className="text-sm rounded-md flex items-center gap-2 hover:text-primary cursor-pointer"
            >
              <Link
                href="/signin"
                className="text-sm flex items-center gap-2 w-full text-gray-700 hover:text-primary"
              >
                <LogIn className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
                로그인
              </Link>
            </DropdownMenuItem>
          ) : (
            <>
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
                className="text-sm rounded-md flex items-center gap-2 hover:text-primary cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
                로그아웃
              </DropdownMenuItem>
            </>
          )}
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
      <div className="h-[48px] px-[20px] flex justify-between items-center sticky z-10 top-0 bg-white">
        <Link href="/">
          <FluenceBi />
        </Link>
        <div className="flex gap-2 items-center">
          <Link href="/cs">
            <button
              type="button"
              className="text-sm text-gray-600 hover:text-orange-500 transition-colors"
            >
              고객센터
            </button>
          </Link>
          <HeaderMenu />
        </div>
      </div>
      <div className="p-[20px]">
        {children}
        <footer className="mt-12 border-t border-gray-200 pt-8">
          <div className="w-full">
            <CustomerSupport />
          </div>

          {/* 하단: 약관 링크 및 저작권 섹션 */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-col md:flex-row justify-center items-center gap-6">
              <div className="flex items-center gap-6 text-sm">
                <button
                  type="button"
                  onClick={handleClickTOU}
                  className="text-gray-600 hover:text-orange-500 transition-colors"
                >
                  이용약관
                </button>
                <div className="w-px h-3 bg-gray-300" />
                <button
                  type="button"
                  onClick={handleClickRP}
                  className="text-gray-600 hover:text-orange-500 transition-colors"
                >
                  환불규정
                </button>
              </div>
            </div>
          </div>
        </footer>

        <Dialog open={openedTOU} onOpenChange={handleChangeTOU}>
          <DialogContent className="max-w-full w-full h-full">
            <DialogHeader>
              <DialogTitle>
                <Title order={3} asChild>
                  이용약관
                </Title>
              </DialogTitle>
            </DialogHeader>
            <div
              dangerouslySetInnerHTML={{
                __html:
                  '<iframe src="/assets/html/terms_of_use_230102.html" width="100%" height="500px"/>',
              }}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={openedRP} onOpenChange={handleChangeRP}>
          <DialogContent className="max-w-full w-full h-full">
            <DialogHeader>
              <DialogTitle>
                <Title order={3} asChild>
                  환불규정
                </Title>
              </DialogTitle>
            </DialogHeader>
            <div
              dangerouslySetInnerHTML={{
                __html:
                  '<iframe src="/assets/html/terms_of_use_230102.html#_msoanchor_2" width="100%" height="500px"/>',
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

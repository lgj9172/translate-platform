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
import FluenceBi from "@assets/icons/fluence-bi.svg";
import { Modal, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  Bell,
  HeadphonesIcon,
  HelpCircle,
  LogIn,
  LogOut,
  User,
} from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { BsPersonFill } from "react-icons/bs";
import CustomerSupport from "./components/CustomerSupport";

interface Props {
  children: ReactNode;
}

export default function Shell({ children }: Props) {
  const [opendTOU, { open: openTOU, close: closeTOU }] = useDisclosure(false);
  const [openedRP, { open: openRP, close: closeRP }] = useDisclosure(false);

  return (
    <div className="min-w-[360px] max-w-[768px] container mx-auto">
      <div className="h-[48px] px-[20px] flex justify-between items-center sticky z-10 top-0 bg-white">
        <Link href="/">
          <FluenceBi />
        </Link>
        <div className="flex gap-2 items-center">
          {/* <Link href="/fluence">
            <button
              type="button"
              className="text-sm text-gray-600 hover:text-orange-500 transition-colors"
            >
              플루언스
            </button>
          </Link> */}
          <Link href="/cs">
            <button
              type="button"
              className="text-sm text-gray-600 hover:text-orange-500 transition-colors"
            >
              고객센터
            </button>
          </Link>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="사용자 메뉴"
                className="p-1.5 rounded-full text-gray-500 hover:bg-gray-50 hover:text-primary focus:outline-none"
              >
                <BsPersonFill className="w-5 h-5" />
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
                    <HelpCircle
                      className="w-4 h-4 text-gray-400"
                      strokeWidth={1.5}
                    />
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
                  asChild
                  className="text-sm rounded-md flex items-center gap-2 hover:text-primary cursor-pointer"
                >
                  <Link
                    href="/signin"
                    className="text-sm flex items-center gap-2 w-full text-gray-700 hover:text-primary"
                  >
                    <LogIn
                      className="w-4 h-4 text-gray-400"
                      strokeWidth={1.5}
                    />
                    로그인
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="text-sm rounded-md flex items-center gap-2 hover:text-primary cursor-pointer"
                >
                  <Link
                    href="/signout"
                    className="text-sm flex items-center gap-2 w-full text-gray-700 hover:text-primary"
                  >
                    <LogOut
                      className="w-4 h-4 text-gray-400"
                      strokeWidth={1.5}
                    />
                    로그아웃
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
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
                  onClick={openTOU}
                  className="text-gray-600 hover:text-orange-500 transition-colors"
                >
                  이용약관
                </button>
                <div className="w-[1px] h-3 bg-gray-300" />
                <button
                  type="button"
                  onClick={openRP}
                  className="text-gray-600 hover:text-orange-500 transition-colors"
                >
                  환불규정
                </button>
              </div>
              {/* <div className="flex flex-col md:flex-row items-center gap-2 text-xs text-gray-400">
                <span>Copyright</span>
                <span className="hidden md:block">•</span>
                <span>© 2024 Awake Moment Inc.</span>
                <span className="hidden md:block">•</span>
                <span>All Rights Reserved.</span>
              </div> */}
            </div>
          </div>
        </footer>

        {/* Modal 부분은 유지 */}
        <Modal
          opened={opendTOU}
          onClose={closeTOU}
          title={<Title order={3}>이용약관</Title>}
          centered
          size="100%"
        >
          <div
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html:
                '<iframe src="/assets/html/terms_of_use_230102.html" width="100%" height="500px"/>',
            }}
          />
        </Modal>
        <Modal
          opened={openedRP}
          onClose={closeRP}
          title={<Title order={3}>환불규정</Title>}
          centered
          size="100%"
        >
          <div
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html:
                '<iframe src="/assets/html/terms_of_use_230102.html#_msoanchor_2" width="100%" height="500px"/>',
            }}
          />
        </Modal>
      </div>
    </div>
  );
}

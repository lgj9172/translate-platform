"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  Breadcrumb as BreadcrumbRoot,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function Breadcrumb() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  const segments = pathname.split("/").filter(Boolean);

  const pathLabelMap: Record<string, string> = {
    // 마켓플레이스
    "/market": "새 번역 의뢰",
    "/market/*": "의뢰 상세",
    "/market/*/quote/create": "견적 보내기",
    "/market/*/quote/create/done": "견적 완료",
    // 마이페이지
    "/my": "마이페이지",
    "/my/requests": "보낸 번역 요청",
    "/my/requests/create": "번역 요청",
    "/my/requests/*": "번역 상세",
    "/my/work": "진행 중인 번역",
    "/my/work/*": "번역 상세",
    "/my/translator": "번역사 프로필",
    "/my/translator/quotations": "제출한 견적",
    // 고객센터
    "/cs": "고객센터",
    "/cs/notice": "공지사항",
    "/cs/notice/*": "공지 상세",
    "/cs/faq": "자주하는 질문",
    "/cs/ask": "1:1 문의",
    "/cs/ask/create": "1:1 문의 작성",
    "/cs/ask/*": "문의 상세",
    // 번역사 프로필
    "/translator/*": "번역사 프로필",
    // 기타
    "/signin": "로그인",
  };

  const matchLabel = (path: string): string | null => {
    if (pathLabelMap[path]) return pathLabelMap[path];
    for (const [pattern, label] of Object.entries(pathLabelMap)) {
      if (pattern.includes("*")) {
        const regex = new RegExp(`^${pattern.replace(/\*/g, "[^/]+")}$`);
        if (regex.test(path)) return label;
      }
    }
    return null;
  };

  const breadcrumbItems = [];
  let currentPath = "";

  for (const segment of segments) {
    currentPath += `/${segment}`;
    const label = matchLabel(currentPath);
    if (!label) continue;

    const isLast = currentPath === pathname;
    breadcrumbItems.push({
      label,
      href: isLast ? undefined : currentPath,
      isLast,
    });
  }

  return (
    <BreadcrumbRoot>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">홈</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbItems.map((item) => (
          <React.Fragment key={item.href ?? item.label}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {item.isLast ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.href ?? "/"}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </BreadcrumbRoot>
  );
}

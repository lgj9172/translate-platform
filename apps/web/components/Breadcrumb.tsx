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

  // 홈 페이지에서는 브레드크럼을 표시하지 않음
  if (pathname === "/") {
    return null;
  }

  // 경로를 세그먼트로 분할
  const segments = pathname.split("/").filter(Boolean);

  // 경로 패턴에 대한 라벨 매핑
  const pathLabelMap: Record<string, string> = {
    "/translation": "번역",
    "/translation/*": "번역 상세",
    "/my": "마이페이지",
    "/my/translator": "번역사 정보",
    "/my/translator/quotations": "보낸 견적",
    "/my/translation/request": "보낸 번역 요청",
    "/my/translation/request/create": "번역 요청",
    "/my/translation/request/*": "번역 상세",
    "/my/translation/response": "받은 번역 요청",
    "/my/translation/response/*": "번역 상세",
    "/cs": "고객센터",
    "/cs/notice": "공지사항",
    "/cs/faq": "자주하는 질문",
    "/cs/ask": "1:1 문의",
    "/cs/ask/*": "문의 상세",
    "/signin": "로그인",
    "/translator/*": "번역사 프로필",
  };

  // 경로 패턴 매칭 헬퍼
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

  // 경로 접두사(prefix)를 순서대로 확인하며 매핑된 것만 브레드크럼에 포함
  const breadcrumbItems = [];
  let currentPath = "";

  for (const segment of segments) {
    currentPath += `/${segment}`;
    const label = matchLabel(currentPath);

    // pathLabelMap에 없는 중간 세그먼트는 건너뜀
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

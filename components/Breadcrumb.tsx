"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb as BreadcrumbRoot,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
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
    "/translation/create": "번역 요청",
    "/translation/*": "번역 상세",
    "/my": "마이페이지",
    "/my/translator": "번역사 정보",
    "/my/translator/quotations": "보낸 견적",
    "/my/translation/request": "보낸 번역 요청",
    "/my/translation/response": "받은 번역 요청",
    "/cs": "고객센터",
    "/cs/notice": "공지사항",
    "/cs/faq": "자주하는 질문",
    "/cs/ask": "1:1 문의",
    "/cs/ask/*": "문의 상세",
    "/signin": "로그인",
    "/translator/*": "번역사 프로필",
  };

  // 브레드크럼 아이템 생성
  const breadcrumbItems = [];
  let currentPath = "";

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;

    // 경로 매핑 확인 (와일드카드 패턴 지원)
    let label = pathLabelMap[currentPath];

    if (!label) {
      // 와일드카드 패턴 매칭
      for (const [pattern, patternLabel] of Object.entries(pathLabelMap)) {
        if (pattern.includes("*")) {
          const regexPattern = pattern.replace(/\*/g, "[^/]+");
          const regex = new RegExp(`^${regexPattern}$`);
          if (regex.test(currentPath)) {
            label = patternLabel;
            break;
          }
        }
      }
    }

    if (!label) {
      label = segment;
    }

    // 마지막 세그먼트가 아니면 링크 포함
    const isLast = i === segments.length - 1;

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
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {item.isLast ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.href!}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </BreadcrumbRoot>
  );
}

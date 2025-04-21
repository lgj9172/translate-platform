"use client";

import Card from "@/components/Card";
import CustomerSupport from "@/components/CustomerSupport";
import PageHeader from "@/components/PageHeader";
import PageTitle from "@/components/PageTitle";
import { ActionIcon, Group, Stack } from "@mantine/core";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

export default function Page() {
  return (
    <Stack>
      <PageHeader>
        <Group>
          <ActionIcon
            variant="transparent"
            color="black"
            component={Link}
            href="/"
          >
            <FaChevronLeft />
          </ActionIcon>
          <PageTitle>고객센터</PageTitle>
        </Group>
      </PageHeader>

      <div className="rounded-2xl bg-gray-50 p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-gray-800">
            플루언스를 사용하시는데 어려움이 있으신가요?
          </h3>
          <p className="text-sm text-gray-600">
            대표전화나 1:1 문의하기를 이용하여 문의해주세요.
            <br />
            1:1 문의하기는 운영시간 외에도 답변을 최대한 도와드리고 있습니다.
          </p>
        </div>

        <div className="space-y-4">
          <CustomerSupport />
        </div>
      </div>

      <Link className="hover:cursor-pointer" href="/cs/notice">
        <Card>
          <div className="flex justify-between items-center">
            <div>
              <div>공지사항</div>
              <div className="text-[#8B8C8D] text-[14px]">
                플루언스의 새로운 소식을 확인하세요.
              </div>
            </div>
            <FaChevronRight color="#8B8C8D" />
          </div>
        </Card>
      </Link>

      <Link className="hover:cursor-pointer" href="/cs/faq">
        <Card>
          <div className="flex justify-between items-center">
            <div>
              <div>자주하는 질문(FAQ)</div>
              <div className="text-[#8B8C8D] text-[14px]">
                자주 묻는 질문들을 확인해보세요.
              </div>
            </div>
            <FaChevronRight color="#8B8C8D" />
          </div>
        </Card>
      </Link>

      <Link className="hover:cursor-pointer" href="/cs/ask">
        <Card>
          <div className="flex justify-between items-center">
            <div>
              <div>1:1 문의</div>
              <div className="text-[#8B8C8D] text-[14px]">
                불편사항이나 개선사항이 있다면 문의해주세요.
              </div>
            </div>
            <FaChevronRight color="#8B8C8D" />
          </div>
        </Card>
      </Link>
    </Stack>
  );
}

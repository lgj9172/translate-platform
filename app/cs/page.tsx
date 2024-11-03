"use client";

import Card from "@/components/Card";
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

      {/* <div className="flex gap-[8px]">
        <Avatar src="avatar.png" />
        <div>
          <div className="text-[14px] text-[#4B4D4D]">회원이름</div>
          <div className="text-[14px] text-[#8B8C8D]">고객 또는 번역사</div>
        </div>
      </div> */}

      <div className="text-[14px] text-[#8B8C8D]">
        <div>플루언스를 사용하시는데 어려움이 있으신가요?</div>
        <div>대표전화나 1:1 문의하기를 이용하여 문의해주세요.</div>
        <div>
          1:1 문의하기는 운영시간 외에도 답변을 최대한 도와드리고 있습니다.
        </div>
        <br />
        <div className="text-[#4B4D4D]">
          고객센터 대표전화:{" "}
          <span className="text-primary font-bold underline">
            <a href="tel:+8207083836353">070-8383-6353</a>
          </span>
        </div>
        <div className="text-[#4B4D4D]">
          고객센터 운영시간:{" "}
          <span className="text-primary font-bold">09시 00분 ~ 18시 00분</span>
        </div>
        <br />
      </div>

      <Link className="hover:cursor-pointer" href="/cs/notice">
        <Card>
          <div className="flex justify-between items-center">
            <div>공지사항</div>
            <FaChevronRight color="#8B8C8D" />
          </div>
        </Card>
      </Link>

      <Link className="hover:cursor-pointer" href="/cs/faq">
        <Card>
          <div className="flex justify-between items-center">
            <div>자주하는 질문(FAQ)</div>
            <FaChevronRight color="#8B8C8D" />
          </div>
        </Card>
      </Link>

      <Link className="hover:cursor-pointer" href="/cs/contact">
        <Card>
          <div className="flex justify-between items-center">
            <div>1:1 문의</div>
            <FaChevronRight color="#8B8C8D" />
          </div>
        </Card>
      </Link>
    </Stack>
  );
}

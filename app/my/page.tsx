"use client";

import Card from "@/components/Card";
import PageHeader from "@/components/PageHeader";
import PageTitle from "@/components/PageTitle";
import { ActionIcon, Avatar, Group, Stack } from "@mantine/core";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa6";

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
          <PageTitle>마이 페이지</PageTitle>
        </Group>
      </PageHeader>

      <div className="flex gap-[8px]">
        <Avatar src="avatar.png" />
        <div>
          <div className="text-[14px] text-[#4B4D4D]">회원이름</div>
          <div className="text-[14px] text-[#8B8C8D]">고객 또는 번역사</div>
        </div>
      </div>

      {/* <Divider /> */}
      <Link className="hover:cursor-pointer" href="/">
        <Card>
          <div className="flex justify-between">
            <div>내 정보 수정</div>
            <div className="text-[#8B8C8D] font-bold">
              <span />
            </div>
          </div>
        </Card>
      </Link>

      <Link className="hover:cursor-pointer" href="/">
        <Card>
          <div className="flex justify-between">
            <div>보낸 번역 요청</div>
            <div className="text-[#8B8C8D] font-bold">
              <span className="text-primary">2</span> 건
            </div>
          </div>
        </Card>
      </Link>

      <Link className="hover:cursor-pointer" href="/">
        <Card>
          <div className="flex justify-between">
            <div>받은 번역 요청</div>
            <div className="text-[#8B8C8D] font-bold">
              <span className="text-primary">2</span> 건
            </div>
          </div>
        </Card>
      </Link>

      <Link className="hover:cursor-pointer" href="/">
        <Card>
          <div className="flex justify-between">
            <div>번역사 등록</div>
            <div className="text-[#8B8C8D] font-bold">등록 필요</div>
          </div>
        </Card>
      </Link>

      <Link className="hover:cursor-pointer" href="/">
        <Card>회원 탈퇴</Card>
      </Link>

      {/* <Card withBorder radius="md">
        <Stack>
          <SimpleGrid cols={2}>
            <Group>
              <Avatar size="xl" src={null} alt="no image here" />
              <Stack gap={0}>
                <Text fz="xs" c="dimmed">
                  고객
                </Text>
                <Text>홍길동</Text>{" "}
                <Group>
                  <Text fz="xs" c="dimmed">
                    test@test.io
                  </Text>
                </Group>
                <Group>
                  <Text fz="xs" c="dimmed">
                    010-1234-5678
                  </Text>
                </Group>
              </Stack>
            </Group>
            <SimpleGrid cols={{ base: 1, xs: 2 }}>
              <UnstyledButton component={Link} href="/my/translation">
                <Paper p="md">
                  <Text c="dimmed">내 번역 요청</Text>
                  <Group c="orange" justify="space-between" wrap="nowrap">
                    <Text size="xl" fw="bolder">
                      8
                    </Text>
                    <FaCaretRight />
                  </Group>
                </Paper>
              </UnstyledButton>
              <UnstyledButton>
                <Paper p="md">
                  <Text c="dimmed">평가</Text>
                  <Group c="orange" justify="space-between">
                    <Text size="xl" fw="bolder">
                      8
                    </Text>
                    <FaCaretRight />
                  </Group>
                </Paper>
              </UnstyledButton>
            </SimpleGrid>
          </SimpleGrid>
        </Stack>
      </Card> */}

      {/* <Stack>
        <SimpleGrid cols={2}>
          <Button
            variant="light"
            color="orange"
            component={Link}
            href="/my/translator"
          >
            번역사 등록
          </Button>
          <Button variant="light" color="orange">
            공지사항
          </Button>
          <Button variant="light" color="orange">
            자주하는질문
          </Button>
          <Button variant="light" color="orange">
            고객센터
          </Button>
        </SimpleGrid>
        <Button variant="outline" color="orange">
          로그아웃
        </Button>
      </Stack> */}
    </Stack>
  );
}

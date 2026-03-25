"use client";

import { getTranslator } from "@/apis/translator";
import { getOtherUser } from "@/apis/user";
import PageHeader from "@/components/PageHeader";
import PageTitle from "@/components/PageTitle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Center } from "@/components/ui/center";
import { Group } from "@/components/ui/group";
import { Loader } from "@/components/ui/loader";
import { Stack } from "@/components/ui/stack";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCategoryLabel } from "@/utils/converter/label";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon, StarIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Profile from "./_component/Profile";

export default function Page() {
  const { translatorId } = useParams<{ translatorId: string }>();

  const { data: translator, isLoading } = useQuery({
    queryKey: ["translator", translatorId],
    queryFn: () => getTranslator({ translatorId }),
  });

  const { data: user } = useQuery({
    queryKey: ["user", translator?.user_id],
    queryFn: () => getOtherUser({ userId: translator?.user_id ?? "" }),
    enabled: !!translator?.user_id,
  });

  if (isLoading)
    return (
      <Center className="h-[500px]">
        <Loader />
      </Center>
    );

  if (!translator) return null;

  return (
    <Stack className="w-full h-full gap-6">
      <PageHeader>
        <Group>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeftIcon className="h-4 w-4" />
            </Link>
          </Button>
          <PageTitle>번역사 프로필</PageTitle>
        </Group>
      </PageHeader>

      <Stack className="gap-6">
        {/* 번역사 기본 정보 카드 */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="text-lg">
                  {user?.name?.[0] || <UserIcon className="h-6 w-6" />}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <div>
                  <CardTitle className="text-xl mb-3">
                    {user?.name || "사용자"}
                  </CardTitle>

                  {/* 정보 가로 나열 */}
                  <div className="flex items-center gap-4 text-sm">
                    {/* 별점 */}
                    <div className="flex items-center gap-1">
                      <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">4.8</span>
                      <span className="text-muted-foreground">(24)</span>
                    </div>

                    {/* 경력 및 최근 번역 */}
                    <div className="flex items-center gap-1">
                      <span className="text-[#8B8C8D]">
                        {`${
                          translator?.total_career_duration
                            ? `경력 ${Math.floor(translator.total_career_duration / 12)}년 ${
                                translator.total_career_duration % 12
                              }개월`
                            : "경력 없음"
                        } ・ ${
                          translator?.recent_translations
                            ? `최근 ${translator?.recent_translations}건`
                            : "최근 번역 없음"
                        }`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* 카테고리 */}
              <div>
                <div className="flex gap-1">
                  {translator.categories.map((category) => (
                    <Badge key={category} variant="outline" className="text-xs">
                      {getCategoryLabel(category)}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* 자기소개 */}
              <div>
                <p className="text-sm leading-relaxed">
                  {translator.introduction || "소개글이 없습니다."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 상세 정보 탭 */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">프로필</TabsTrigger>
            <TabsTrigger value="review">리뷰</TabsTrigger>
          </TabsList>
          <div className="mt-6">
            <TabsContent value="profile" className="mt-0">
              <Profile translatorId={translatorId} />
            </TabsContent>
            <TabsContent value="review" className="mt-0">
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  아직 리뷰가 없습니다
                </h3>
                <p className="text-muted-foreground text-sm">
                  이 번역사에 대한 첫 번째 리뷰를 남겨보세요.
                </p>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </Stack>
    </Stack>
  );
}

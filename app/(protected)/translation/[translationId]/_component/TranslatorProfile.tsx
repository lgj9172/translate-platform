import { getTranslator } from "@/apis/translator";
import { getOtherUser } from "@/apis/user";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function TranslatorProfile({
  translatorId,
}: {
  translatorId: string;
}) {
  const { data: translator } = useQuery({
    queryKey: ["translator", translatorId],
    queryFn: () => getTranslator({ translatorId }),
  });

  const { data: user } = useQuery({
    queryKey: ["user", translator?.user_id],
    queryFn: () => getOtherUser({ userId: translator?.user_id ?? "" }),
    enabled: !!translator?.user_id,
  });

  return (
    <div className="flex gap-[8px]">
      <Avatar>
        <AvatarImage src={user?.avatar} />
        <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
      </Avatar>
      <div>
        <div className="text-[14px] text-[#4B4D4D]">
          <Link
            href={`/translator/${translatorId}`}
            className="hover:underline"
          >
            {user?.name}
          </Link>
        </div>
        <div className="text-[14px] text-[#8B8C8D]">
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
        </div>
      </div>
    </div>
  );
}

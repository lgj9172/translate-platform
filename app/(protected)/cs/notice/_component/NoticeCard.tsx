import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Notice } from "@/types/entities";
import dayjs from "dayjs";

interface Props {
  notice: Notice;
}

export default function NoticeCard({ notice }: Props) {
  return (
    <Card>
      <div className="flex flex-col gap-2">
        {/* 태그 및 제목 */}
        <div className="flex gap-2 items-center">
          {notice.is_important && <Badge variant="default">중요</Badge>}
          <span className="text-[18px] font-bold">{notice.title}</span>
        </div>
        {/* 날짜 */}
        <div className="text-[14px] text-[#8B8C8D]">
          {dayjs(notice.created_at).format("YYYY.MM.DD")}
        </div>
      </div>
    </Card>
  );
}

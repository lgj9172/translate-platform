import { CSAsk } from "@/apis/cs";
import Badge from "@/components/Badge";
import Card from "@/components/Card";
import dayjs from "dayjs";

interface Props {
  ask: CSAsk;
}

export default function AskCard({ ask }: Props) {
  return (
    <Card>
      <div className="flex flex-col gap-2">
        {/* 태그 및 제목 */}
        <div className="flex gap-2 items-center">
          {ask.status && <Badge color="primary">{ask.status}</Badge>}
          <span className="text-[18px] font-bold">{ask.category}</span>
        </div>
        {/* 날짜 */}
        <div className="text-[14px] text-[#8B8C8D]">
          {dayjs(ask.created_at).format("YYYY.MM.DD")}
        </div>
      </div>
    </Card>
  );
}

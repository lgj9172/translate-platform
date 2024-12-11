import { CSAsk } from "@/apis/cs";
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
          {ask.category && (
            <span className="px-[8px] py-[4px] bg-primary rounded-[8px] text-[12px] font-bold text-white">
              {ask.status}
            </span>
          )}
          <span className="text-[18px] font-bold">{ask.category}</span>
        </div>
        {/* 날짜 */}
        <div className="text-[14px] text-[#8B8C8D]">
          {/* TODO: 날짜 추가 */}
          {dayjs().format("YYYY.MM.DD")}
        </div>
      </div>
    </Card>
  );
}

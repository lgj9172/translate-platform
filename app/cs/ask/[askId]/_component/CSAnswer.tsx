import { getCSAnswer } from "@/apis/cs";
import Alert from "@/components/Alert";
import { useQuery } from "@tanstack/react-query";

export default function CSAnswer({ askId }: { askId: string }) {
  const { data: answer } = useQuery({
    queryKey: ["answer", askId],
    queryFn: () => getCSAnswer({ counselId: askId }),
  });

  if (!answer)
    return (
      <Alert>
        아직 답변이 달리지 않았어요.
        <br /> 조금만 기다려주시면 메일로 알림을 보내드릴게요.
      </Alert>
    );

  return (
    <div className="p-5 bg-[#F9FAFB] rounded-[8px] flex flex-col gap-2">
      <div className="text-[#4B4D4D] font-bold">답변</div>
      <div className="text-[#8B8C8D]">{answer.content}</div>
    </div>
  );
}

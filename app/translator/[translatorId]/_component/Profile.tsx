import { getTranslator } from "@/apis/translator";
import Label from "@/components/Label";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

export default function Profile({ translatorId }: { translatorId: string }) {
  const { data: translator } = useQuery({
    queryKey: ["translator", translatorId],
    queryFn: () => getTranslator(translatorId),
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label>학력</Label>
        {translator?.educations.map((education) => (
          <div className="flex flex-col">
            <div>{`${education.name} ${education.degree} ${education.graduation_status}`}</div>
            <div>
              {dayjs(education.started_at).format("YYYY.MM")} -{" "}
              {dayjs(education.ended_at).format("YYYY.MM")}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <Label>경력</Label>
        {translator?.careers.map((career) => (
          <div className="flex flex-col">
            <div>{career.name}</div>
            {career.is_employed ? (
              <div>{`${dayjs(career.started_at).format("YYYY.MM")} ~ 현재`}</div>
            ) : (
              <div>
                {`${dayjs(career.started_at).format("YYYY.MM")} - ${dayjs(
                  career.ended_at,
                ).format("YYYY.MM")}`}
              </div>
            )}
            <div>{career.achievement}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <Label>자격증</Label>
        {translator?.certifications.map((certification) => (
          <div className="flex flex-col">
            <div>{certification.name}</div>
            <div>{certification.organization}</div>
            <div>{dayjs(certification.started_at).format("YYYY.MM")}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <Label>번역 예시</Label>
        {translator?.translation_samples.map((sample) => (
          <div className="flex flex-col gap-1">
            <div className="flex flex-col">
              <div>원문</div>
              <div>{sample.source_text}</div>
            </div>
            <div className="flex flex-col">
              <div>번역</div>
              <div>{sample.target_text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

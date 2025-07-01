import { getTranslator } from "@/apis/translator";
import Label from "@/components/Label";
import {
  TRANSLATOR_DEGREE_LABEL,
  TRANSLATOR_GRADUATION_STATUS_LABEL,
} from "@/types/entities";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

export default function Profile({ translatorId }: { translatorId: string }) {
  const { data: translator } = useQuery({
    queryKey: ["translator", translatorId],
    queryFn: () => getTranslator({ translatorId }),
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label>학력</Label>
        {translator?.educations.map((education) => (
          <div
            key={education.education_id}
            className="flex flex-col gap-1 border-l-2 border-primary pl-2"
          >
            <div className="flex gap-1">
              <span className="text-sm text-gray-500">
                {dayjs(education.started_at).format("YYYY.MM")} -{" "}
                {dayjs(education.ended_at).format("YYYY.MM")}
              </span>
              <span className="text-sm">{education.name}</span>
            </div>
            <span className="text-sm">{`${TRANSLATOR_DEGREE_LABEL[education.degree]} ${TRANSLATOR_GRADUATION_STATUS_LABEL[education.graduation_status]}`}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <Label>경력</Label>
        {translator?.careers.map((career) => (
          <div
            key={career.career_id}
            className="flex flex-col gap-1 border-l-2 border-primary pl-2"
          >
            <div className="flex gap-1">
              <span className="text-sm text-gray-500">
                {career.is_employed
                  ? `${dayjs(career.started_at).format("YYYY.MM")} ~ 현재`
                  : `${dayjs(career.started_at).format("YYYY.MM")} - ${dayjs(
                      career.ended_at,
                    ).format("YYYY.MM")}`}
              </span>
              <span className="text-sm">{career.name}</span>
            </div>
            <div className="text-sm">{career.achievement}</div>
          </div>
        ))}
      </div>

      {translator?.certifications && translator?.certifications.length > 0 && (
        <div className="flex flex-col gap-2">
          <Label>자격증</Label>
          {translator?.certifications.map((certification) => (
            <div
              key={certification.certification_id}
              className="flex flex-col gap-1 border-l-2 border-primary pl-2"
            >
              <div className="flex gap-1">
                <span className="text-sm text-gray-500">
                  {dayjs(certification.started_at).format("YYYY.MM")}
                </span>
                <span className="text-sm">{certification.name}</span>
              </div>
              <div className="text-sm">{certification.organization}</div>
            </div>
          ))}
        </div>
      )}

      {translator?.translation_samples &&
        translator?.translation_samples.length > 0 && (
          <div className="flex flex-col gap-2">
            <Label>번역 예시</Label>
            {translator?.translation_samples.map((sample) => (
              <div
                key={sample.translation_sample_id}
                className="flex flex-col gap-2 border-l-2 border-primary pl-2"
              >
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">원문</span>
                  <span className="text-sm">{sample.source_text}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">번역</span>
                  <span className="text-sm">{sample.target_text}</span>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

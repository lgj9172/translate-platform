import { getTranslator } from "@/apis/translator";
import { Badge } from "@/components/ui/badge";
import {
  TRANSLATOR_DEGREE_LABEL,
  TRANSLATOR_GRADUATION_STATUS_LABEL,
} from "@/types/entities";
import { getLanguageLabel } from "@/utils/converter/label";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
  GraduationCap,
  Briefcase,
  Award,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

export default function Profile({ translatorId }: { translatorId: string }) {
  const { data: translator } = useQuery({
    queryKey: ["translator", translatorId],
    queryFn: () => getTranslator({ translatorId }),
  });

  if (!translator) return null;

  const getVerificationIcon = (status?: string) => {
    switch (status) {
      case "VERIFIED":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "PENDING":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "REJECTED":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getVerificationBadge = (status?: string) => {
    if (!status) return null;

    switch (status) {
      case "VERIFIED":
        return (
          <Badge
            variant="default"
            className="text-xs bg-green-500 hover:bg-green-600"
          >
            인증완료
          </Badge>
        );
      case "PENDING":
        return (
          <Badge variant="secondary" className="text-xs">
            인증대기
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="destructive" className="text-xs">
            인증거부
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* 학력 */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">학력</h3>
            <p className="text-sm text-muted-foreground">교육 및 학위 정보</p>
          </div>
        </div>

        {translator.educations.length === 0 ? (
          <div className="text-center py-8">
            <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">등록된 학력이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {translator.educations.map((education, index) => (
              <div key={education.education_id || index}>
                <div className="flex items-start justify-between p-4 rounded-lg border bg-card">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{education.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {TRANSLATOR_DEGREE_LABEL[education.degree]}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {
                          TRANSLATOR_GRADUATION_STATUS_LABEL[
                            education.graduation_status
                          ]
                        }
                      </Badge>
                      {getVerificationBadge(education.verification_status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {education.major}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {dayjs(education.started_at).format("YYYY.MM")} -{" "}
                      {dayjs(education.ended_at).format("YYYY.MM")}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {getVerificationIcon(education.verification_status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 경력 */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Briefcase className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">경력</h3>
            <p className="text-sm text-muted-foreground">직장 경험 및 성과</p>
          </div>
        </div>

        {translator.careers.length === 0 ? (
          <div className="text-center py-8">
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">등록된 경력이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {translator.careers.map((career, index) => (
              <div key={career.career_id || index}>
                <div className="flex items-start justify-between p-4 rounded-lg border bg-card">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{career.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {career.position}
                      </Badge>
                      {career.is_employed && (
                        <Badge variant="outline" className="text-xs">
                          재직중
                        </Badge>
                      )}
                      {getVerificationBadge(career.verification_status)}
                    </div>
                    {career.achievement && (
                      <p className="text-sm text-muted-foreground">
                        {career.achievement}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {career.is_employed
                        ? `${dayjs(career.started_at).format("YYYY.MM")} ~ 현재`
                        : `${dayjs(career.started_at).format("YYYY.MM")} - ${dayjs(career.ended_at).format("YYYY.MM")}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {getVerificationIcon(career.verification_status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 자격증 */}
      {translator.certifications && translator.certifications.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">자격증</h3>
              <p className="text-sm text-muted-foreground">보유 자격 및 인증</p>
            </div>
          </div>

          <div className="space-y-4">
            {translator.certifications.map((certification, index) => (
              <div key={certification.certification_id || index}>
                <div className="flex items-start justify-between p-4 rounded-lg border bg-card">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{certification.name}</h4>
                      {getVerificationBadge(certification.verification_status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {certification.organization}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {dayjs(certification.started_at).format("YYYY.MM")} 발급
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {getVerificationIcon(certification.verification_status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 번역 예시 */}
      {translator.translation_samples &&
        translator.translation_samples.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">번역 예시</h3>
                <p className="text-sm text-muted-foreground">번역 품질 샘플</p>
              </div>
            </div>

            <div className="space-y-6">
              {translator.translation_samples.map((sample, index) => (
                <div key={sample.translation_sample_id || index}>
                  <div className="space-y-4 p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {getLanguageLabel(sample.source_language)} →{" "}
                        {getLanguageLabel(sample.target_language)}
                      </Badge>
                    </div>
                    <div className="grid gap-4">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          원문
                        </p>
                        <div className="p-3 bg-muted rounded-md">
                          <p className="text-sm leading-relaxed">
                            {sample.source_text}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          번역
                        </p>
                        <div className="p-3 bg-primary/5 rounded-md border border-primary/20">
                          <p className="text-sm leading-relaxed">
                            {sample.target_text}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}

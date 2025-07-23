import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/AlertDialog";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTranslation,
  postTranslationRequestRevision,
} from "@/apis/translations";
import { toast } from "sonner";

interface RequestUpdateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  translationId: string;
}

export default function RequestUpdateModal({
  open,
  onOpenChange,
  translationId,
}: RequestUpdateModalProps) {
  const queryClient = useQueryClient();

  const { data: translation, isLoading } = useQuery({
    queryKey: ["translations", translationId],
    queryFn: () => getTranslation({ translationId }),
    enabled: open,
  });

  const { mutate: mutateRequestRevision, isPending } = useMutation({
    mutationFn: postTranslationRequestRevision,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["translations", translationId],
      });
      toast.success("번역 수정 요청이 처리되었습니다.", {
        richColors: true,
        position: "top-center",
      });
      onOpenChange(false);
    },
  });

  const remainCount = translation?.remaining_revisions;

  const handleClickConfirm = () => {
    mutateRequestRevision({ translationId });
  };
  const handleClickCancel = () => {
    onOpenChange(false);
  };
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>번역 수정 요청</AlertDialogTitle>
          <AlertDialogDescription>
            {remainCount === 0 ? (
              <>
                번역 수정 요청 가능 횟수를 모두 소진해서 수정 요청을 할 수
                없어요.
                <br />
                번역 수정 요청은 최대 3번 가능해요.
              </>
            ) : (
              <>
                번역 수정을 요청하시겠어요?
                <br />
                번역 수정 요청은 최대 3번 가능해요.
                <br />
                {isLoading
                  ? "로딩 중..."
                  : `현재 수정 요청 가능 횟수: ${remainCount}번`}
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="secondary" onClick={handleClickCancel}>
            닫기
          </Button>
          <Button
            onClick={handleClickConfirm}
            disabled={isPending || remainCount === 0}
          >
            번역 수정 요청
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

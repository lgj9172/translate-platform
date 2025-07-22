import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/AlertDialog";
import { Button } from "@/components/ui/button";
import { postTranslationResume } from "@/apis/translations";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function ResumeTranslationModal({
  open,
  onOpenChange,
  translationId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  translationId: string;
}) {
  const queryClient = useQueryClient();

  const { mutate: mutatePostTranslationResume, isPending } = useMutation({
    mutationFn: postTranslationResume,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["translations", translationId],
      });
      toast.success("번역이 진행중 상태로 변경되었어요.", {
        richColors: true,
        position: "top-center",
      });
      onOpenChange(false);
    },
  });

  const handleClickConfirm = () => {
    mutatePostTranslationResume({
      translationId,
    });
  };

  const handleClickCancel = () => {
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>번역 결과물 수정</AlertDialogTitle>
          <AlertDialogDescription>
            번역 결과물에 수정이 필요한가요?
            <br />
            번역을 진행중인 상태로 변경하고 번역 결과물을 다시 올릴 수 있어요.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="secondary" onClick={handleClickCancel}>
            닫기
          </Button>
          <Button onClick={handleClickConfirm} disabled={isPending}>
            번역 진행중 상태로 변경
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

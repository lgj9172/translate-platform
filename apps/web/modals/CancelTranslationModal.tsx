import { postTranslationCancel } from "@/apis/translations";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/AlertDialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function CancelTranslationModal({
  open,
  onOpenChange,
  translationId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  translationId: string;
}) {
  const queryClient = useQueryClient();

  const { mutate: mutatePostTranslationCancel, isPending } = useMutation({
    mutationFn: postTranslationCancel,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["translations", translationId],
      });
      toast.success("번역 요청이 취소되었어요.", {
        richColors: true,
        position: "top-center",
      });
      onOpenChange(false);
    },
  });

  const handleClickConfirm = () => {
    mutatePostTranslationCancel({
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
          <AlertDialogTitle>번역 요청 취소</AlertDialogTitle>
          <AlertDialogDescription>
            아직 번역이 시작되지 않았다면 취소 할 수 있어요.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="secondary" onClick={handleClickCancel}>
            닫기
          </Button>
          <Button onClick={handleClickConfirm} disabled={isPending}>
            번역 요청 취소
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

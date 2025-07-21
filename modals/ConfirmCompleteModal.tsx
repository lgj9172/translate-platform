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
import { postTranslationConfirm } from "@/apis/translations";
import { toast } from "sonner";

interface ConfirmCompleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  translationId: string;
}

export default function ConfirmCompleteModal({
  open,
  onOpenChange,
  translationId,
}: ConfirmCompleteModalProps) {
  const queryClient = useQueryClient();

  const { mutate: mutatePostTranslationConfirm, isPending } = useMutation({
    mutationFn: postTranslationConfirm,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["translations", translationId],
      });
      toast.success("번역이 확정되었습니다.", {
        richColors: true,
        position: "top-center",
      });
      onOpenChange(false);
    },
  });

  const handleClickConfirm = () => {
    mutatePostTranslationConfirm({ translationId });
  };
  const handleClickCancel = () => {
    onOpenChange(false);
  };
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>번역 확정</AlertDialogTitle>
          <AlertDialogDescription>
            번역이 만족스러우셨나요?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="secondary" onClick={handleClickCancel}>
            닫기
          </Button>
          <Button onClick={handleClickConfirm} disabled={isPending}>
            번역 확정
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

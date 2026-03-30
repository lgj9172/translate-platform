import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { postTranslationSubmit } from "@/apis/translations";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/AlertDialog";
import { Button } from "@/components/ui/button";

export default function SubmitTranslationModal({
  open,
  onOpenChange,
  translationId,
  fileId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  translationId: string;
  fileId: string;
}) {
  const queryClient = useQueryClient();

  const { mutate: mutatePostTranslationSubmit, isPending } = useMutation({
    mutationFn: postTranslationSubmit,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["translations", translationId],
      });
      toast.success("번역 제출이 완료되었어요.", {
        richColors: true,
        position: "top-center",
      });
      onOpenChange(false);
    },
  });

  const handleClickConfirm = () => {
    mutatePostTranslationSubmit({
      translationId,
      payload: {
        target_files: [fileId],
      },
    });
  };

  const handleClickCancel = () => {
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>번역 제출</AlertDialogTitle>
          <AlertDialogDescription>
            번역을 제출하시겠어요?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="secondary" onClick={handleClickCancel}>
            닫기
          </Button>
          <Button onClick={handleClickConfirm} disabled={isPending}>
            번역 제출
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

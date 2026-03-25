import { postTranslationStart } from "@/apis/translations";
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

export default function StartTranslationModal({
  open,
  onOpenChange,
  translationId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  translationId: string;
}) {
  const queryClient = useQueryClient();

  const { mutate: mutatePostTranslationStart, isPending } = useMutation({
    mutationFn: postTranslationStart,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["translations", translationId],
      });
      toast.success("번역이 시작되었어요.", {
        richColors: true,
        position: "top-center",
      });
      onOpenChange(false);
    },
  });

  const handleClickConfirm = () => {
    mutatePostTranslationStart({
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
          <AlertDialogTitle>번역 시작</AlertDialogTitle>
          <AlertDialogDescription>
            번역이 시작되었나요?
            <br />
            번역 시작 버튼을 눌러 번역 요청자에게 번역이 시작되었음을
            알려주세요.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="secondary" onClick={handleClickCancel}>
            닫기
          </Button>
          <Button onClick={handleClickConfirm} disabled={isPending}>
            번역 시작
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

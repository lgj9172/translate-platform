import { postFile } from "@/apis/files";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function SubmitTranslationModal({
  open,
  onOpenChange,
  translationId,
  file,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  translationId: string;
  file: File;
}) {
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({ mutationFn: postFile });

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

  const handleClickConfirm = async () => {
    const res = await mutateAsync({
      payload: { content: file },
    });
    mutatePostTranslationSubmit({
      translationId,
      payload: {
        target_files: [res.file_id],
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

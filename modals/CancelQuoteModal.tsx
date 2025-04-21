import { postTranslationQuotationCancel } from "@/apis/translations-quotations";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/AlertDialog";
import Button from "@/components/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function CancelQuoteModal({
  open,
  onOpenChange,
  translationId,
  quotationId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  translationId: string;
  quotationId: string;
}) {
  const queryClient = useQueryClient();

  const { mutate: mutatePostTranslationQuoteCancel, isPending } = useMutation({
    mutationFn: postTranslationQuotationCancel,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["translations", translationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["translations", translationId, "quotes"],
      });
      queryClient.invalidateQueries({
        queryKey: ["quotations", translationId],
      });
      toast.success("견적을 취소했어요.", {
        richColors: true,
        position: "top-center",
      });
      onOpenChange(false);
    },
  });

  const handleClickConfirm = () => {
    mutatePostTranslationQuoteCancel({
      translationId,
      quotationId,
    });
  };

  const handleClickCancel = () => {
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>견적 보내기 취소</AlertDialogTitle>
          <AlertDialogDescription>
            보내신 견적을 취소하시겠어요?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="secondary" onClick={handleClickCancel}>
            닫기
          </Button>
          <Button
            variant="primary"
            onClick={handleClickConfirm}
            disabled={isPending}
          >
            확인
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

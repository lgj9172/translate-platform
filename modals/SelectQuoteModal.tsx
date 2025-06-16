import { postTranslationQuotationSelect } from "@/apis/translations-quotations";
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

export default function SelectQuoteModal({
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

  const { mutate: mutatePostTranslationQuoteSelect, isPending } = useMutation({
    mutationFn: postTranslationQuotationSelect,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["translations", translationId],
      });
      toast.success("번역사를 선택했어요.", {
        richColors: true,
        position: "top-center",
      });
      onOpenChange(false);
    },
  });

  const handleClickConfirm = () => {
    mutatePostTranslationQuoteSelect({
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
          <AlertDialogTitle>번역사 선택</AlertDialogTitle>
          <AlertDialogDescription>
            이 번역사를 선택하시겠어요?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="secondary" onClick={handleClickCancel}>
            닫기
          </Button>
          <Button onClick={handleClickConfirm} disabled={isPending}>
            번역사 선택
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

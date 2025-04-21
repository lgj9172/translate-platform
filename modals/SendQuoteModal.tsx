import { postTranslationQuotation } from "@/apis/translations-quotations";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/AlertDialog";
import Button from "@/components/Button";
import { Fee } from "@/types/entities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function SendQuoteModal({
  open,
  onOpenChange,
  translationId,
  fee,
  detail,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  translationId: string;
  fee: Fee;
  detail: string;
}) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: postTranslationQuotation,
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
      toast.success("견적을 보냈어요.", {
        richColors: true,
        position: "top-center",
      });
      onOpenChange(false);
    },
  });

  const handleClickConfirm = () => {
    mutate({
      translationId,
      payload: {
        fee: {
          unit: fee.unit,
          value: fee.value,
        },
        detail,
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
          <AlertDialogTitle>견적 보내기</AlertDialogTitle>
          <AlertDialogDescription>견적을 보내시겠어요?</AlertDialogDescription>
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
            견적 보내기
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

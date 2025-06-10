import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/AlertDialog";
import Button from "@/components/Button";

export default function ResumeTranslationModal({
  open,
  onOpenChange,
  translationId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  translationId: string;
}) {
  // TODO: 번역 재시작 기능 추가 필요

  const handleClickConfirm = () => {
    console.log(translationId);
    alert("아직 번역 진행중 상태로 변경하는 api가 개발되지 않았어요.");
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
          <Button variant="primary" onClick={handleClickConfirm}>
            번역 진행중 상태로 변경
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

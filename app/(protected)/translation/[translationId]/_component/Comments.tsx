import {
  getTranslationComments,
  postTranslationComment,
} from "@/apis/translations";
import { getOtherUser, getUser } from "@/apis/user";
import ControllerSection from "@/components/ControllerSection";
import ErrorText from "@/components/ErrorText";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Translation, TranslationComment } from "@/types/entities";
import { zodResolver } from "@hookform/resolvers/zod";
import { Center } from "@/components/ui/center";
import { Loader } from "@/components/ui/loader";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";

function Message({ message }: { message: TranslationComment }) {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(),
  });

  const { data: writer } = useQuery({
    queryKey: ["user", message.user_id],
    queryFn: () => getOtherUser({ userId: message.user_id ?? "" }),
    enabled: !!message.user_id,
  });

  const isCurrentUser = user?.user_id === message.user_id;

  return (
    <div
      className={`flex w-full ${isCurrentUser ? "justify-end" : "justify-start"}`}
    >
      <Card
        className={
          `flex items-end gap-3 max-w-[80%] border-none shadow-none bg-transparent p-0 ` +
          (isCurrentUser ? "flex-row-reverse" : "flex-row")
        }
      >
        <Avatar className="size-8">
          {writer?.avatar ? (
            <AvatarImage src={writer.avatar} alt="avatar" />
          ) : (
            <AvatarFallback>{writer?.nickname?.[0] || "U"}</AvatarFallback>
          )}
        </Avatar>
        <div
          className={cn(
            "rounded-xl px-4 py-2 text-sm whitespace-pre-line break-words flex flex-col gap-1 shadow",
            isCurrentUser
              ? "bg-muted text-foreground border border-input rounded-br-sm text-right"
              : "bg-muted text-foreground border border-input rounded-bl-sm text-left",
          )}
        >
          <div>{message.content}</div>
          <div
            className={
              "flex items-center text-xs mt-1 text-muted-foreground " +
              (isCurrentUser ? "justify-end" : "justify-start")
            }
          >
            {dayjs(message.created_at).format("YYYY.MM.DD HH:mm")}
          </div>
        </div>
      </Card>
    </div>
  );
}

const CommentFormSchema = z.object({
  content: z.string().min(1, "1글자 이상 입력해주세요."),
});

type CommentFormType = z.infer<typeof CommentFormSchema>;

const CommentFormDefaultValues: CommentFormType = {
  content: "",
};

export default function Comments({
  translation,
}: {
  translation: Translation;
}) {
  const queryClient = useQueryClient();

  const { control, handleSubmit, reset } = useForm<CommentFormType>({
    resolver: zodResolver(CommentFormSchema),
    defaultValues: CommentFormDefaultValues,
  });

  const { data: comments, isLoading } = useQuery({
    queryKey: ["translationComments", translation.translation_id],
    queryFn: () =>
      getTranslationComments({ translationId: translation.translation_id }),
  });

  const { mutate: postComment, isPending } = useMutation({
    mutationFn: (data: CommentFormType) =>
      postTranslationComment({
        translationId: translation.translation_id,
        payload: {
          content: data.content,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["translationComments", translation.translation_id],
      });
      reset();
    },
  });

  const handleSubmitSuccess: SubmitHandler<CommentFormType> = (data) => {
    postComment(data);
  };

  if (isLoading)
    return (
      <Center className="h-[500px]">
        <Loader />
      </Center>
    );

  return (
    <InputSection>
      <LabelSection>
        <Label>댓글</Label>
      </LabelSection>
      <ControllerSection>
        <div className="flex flex-col gap-3 mb-4">
          {comments
            ?.sort((a, b) =>
              (a.created_at || "").localeCompare(b.created_at || ""),
            )
            .map((comment) => (
              <Message key={comment.comment_id} message={comment} />
            ))}
        </div>
        <form
          onSubmit={handleSubmit(handleSubmitSuccess)}
          className="flex flex-col gap-2 mt-2"
        >
          <Controller
            name="content"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <ControllerSection>
                <Textarea
                  {...field}
                  maxLength={100}
                  placeholder="댓글을 입력해주세요."
                  className="resize-none min-h-[40px]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(handleSubmitSuccess)();
                    }
                  }}
                />
                <ErrorText>{error?.message}</ErrorText>
              </ControllerSection>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={isPending}>
              등록
            </Button>
          </div>
        </form>
      </ControllerSection>
    </InputSection>
  );
}

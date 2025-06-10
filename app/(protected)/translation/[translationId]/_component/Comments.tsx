import {
  getTranslationComments,
  postTranslationComment,
} from "@/apis/translations";
import { getOtherUser, getUser } from "@/apis/user";
import Button from "@/components/Button";
import ControllerSection from "@/components/ControllerSection";
import ErrorText from "@/components/ErrorText";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import TextArea from "@/components/TextArea";
import { Translation, TranslationComment } from "@/types/entities";
import { zodResolver } from "@hookform/resolvers/zod";
import { Center, Loader } from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

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
      className={`flex flex-col gap-2 ${isCurrentUser ? "items-end" : "items-start"}`}
    >
      <div
        className={`p-2 rounded-[16px] gap-2 ${isCurrentUser ? "bg-[#FFF7ED] text-right rounded-br-none" : "bg-[#F9FAFB] text-left rounded-bl-none"}`}
      >
        <div
          className={`text-[14px] text-[#8B8C8D] flex items-center justify-end gap-2 ${
            isCurrentUser ? "flex-row" : "flex-row-reverse"
          }`}
        >
          <span>{dayjs(message.created_at).format("YYYY.MM.DD HH:mm")}</span>
          <span className="font-bold">{writer?.nickname}</span>
        </div>
        {message.content.split("\n").map((line, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index}>{line}</div>
        ))}
      </div>
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
      <Center mih="320px">
        <Loader color="orange" type="bars" />
      </Center>
    );

  return (
    <InputSection>
      <LabelSection>
        <Label>댓글</Label>
      </LabelSection>
      <ControllerSection>
        <div className="flex flex-col gap-2">
          {comments
            ?.sort((a, b) =>
              (a.created_at || "").localeCompare(b.created_at || ""),
            )
            .map((comment) => (
              <Message key={comment.comment_id} message={comment} />
            ))}
        </div>
        <form onSubmit={handleSubmit(handleSubmitSuccess)}>
          <div className="flex flex-col gap-2">
            <Controller
              name="content"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <ControllerSection>
                  <TextArea
                    {...field}
                    maxLength={100}
                    placeholder="댓글을 입력해주세요."
                  />
                  <ErrorText>{error?.message}</ErrorText>
                </ControllerSection>
              )}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="secondary"
                size="sm"
                disabled={isPending}
              >
                등록
              </Button>
            </div>
          </div>
        </form>
      </ControllerSection>
    </InputSection>
  );
}

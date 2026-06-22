"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster, toast } from "sonner";
import "dayjs/locale/ko";
import React from "react";

// Server Action이 throw한 에러 메시지를 토스트로 노출.
// 개발 모드에서는 한글 메시지가 그대로 전달되지만, 프로덕션 빌드에서는
// Next.js가 메시지를 마스킹하므로 일반 안내 문구로 폴백한다.
function toUserMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    const redacted =
      /An error occurred in the Server Components render|Server Action/i.test(
        error.message,
      );
    if (!redacted) return error.message;
  }
  return "요청 처리 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.";
}

function Providers({ children }: React.PropsWithChildren) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: false,
          },
          mutations: {
            onError: (error) => {
              toast.error(toUserMessage(error), {
                richColors: true,
                position: "top-center",
              });
            },
          },
        },
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default Providers;

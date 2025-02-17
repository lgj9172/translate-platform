"use client";

import { toast, Toaster } from "sonner";
import { MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { ModalsProvider } from "@mantine/modals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "dayjs/locale/ko";
import React from "react";
import { isAxiosError } from "axios";

function Providers({ children }: React.PropsWithChildren) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // staleTime: 0,
            // gcTime: 0,
            // refetchOnMount: true,
            // refetchOnWindowFocus: true,
            retry: 1,
          },
          mutations: {
            onError: (error) => {
              if (isAxiosError(error)) {
                if (error.response?.status === 400) {
                  toast.error("잘못된 요청이에요.", {
                    richColors: true,
                    position: "top-center",
                  });
                } else if (error.response?.status === 401) {
                  toast.error("인증이 만료되었어요. 다시 로그인해주세요.", {
                    richColors: true,
                    position: "top-center",
                  });
                } else if (error.response?.status === 403) {
                  toast.error("권한이 없어요.", {
                    richColors: true,
                    position: "top-center",
                  });
                } else if (error.response?.status === 404) {
                  toast.error("존재하지 않는 데이터예요.", {
                    richColors: true,
                    position: "top-center",
                  });
                } else if (error.response?.status === 405) {
                  toast.error("허용되지 않은 요청이에요.", {
                    richColors: true,
                    position: "top-center",
                  });
                } else if (error.response?.status === 409) {
                  toast.error("이미 존재하는 데이터예요.", {
                    richColors: true,
                    position: "top-center",
                  });
                } else if (error.response?.status === 422) {
                  toast.error("잘못된 입력이에요.", {
                    richColors: true,
                    position: "top-center",
                  });
                } else if (error.response?.status === 429) {
                  toast.error("너무 많은 요청이에요.", {
                    richColors: true,
                    position: "top-center",
                  });
                } else if (error.response?.status === 500) {
                  toast.error(
                    "서버 오류가 발생했어요. 서버 개발자를 혼내주세요.",
                    {
                      richColors: true,
                      position: "top-center",
                    },
                  );
                } else {
                  toast.error(error.response?.data?.message || error.message, {
                    richColors: true,
                    position: "top-center",
                  });
                }
              }
            },
          },
        },
      }),
  );
  return (
    <DatesProvider
      settings={{ locale: "ko", firstDayOfWeek: 1, weekendDays: [0, 6] }}
    >
      <MantineProvider>
        <ModalsProvider modalProps={{ centered: true }}>
          <QueryClientProvider client={queryClient}>
            <Toaster />
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </ModalsProvider>
      </MantineProvider>
    </DatesProvider>
  );
}

export default Providers;

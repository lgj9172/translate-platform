"use client";

import { MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { ModalsProvider } from "@mantine/modals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "dayjs/locale/ko";
import React from "react";

function Providers({ children }: React.PropsWithChildren) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 0,
            gcTime: 0,
            refetchOnMount: true,
            refetchOnWindowFocus: true,
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
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </ModalsProvider>
      </MantineProvider>
    </DatesProvider>
  );
}

export default Providers;

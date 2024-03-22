"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { MantineProvider, createTheme } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "dayjs/locale/ko";
import React from "react";

const colors = {};

export const chakraTheme = extendTheme({ colors });

const mantineTheme = createTheme({
  /** Put your mantine theme override here */
  // primaryColor: "orange",
  // components: {
  //   Textarea: Textarea.extend({
  //     styles: { input: { "&:focus": { borderColor: "black" } } },
  //   }),
  // },
});

function Providers({ children }: React.PropsWithChildren) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000,
          },
        },
      }),
  )
  return (
    <DatesProvider
      settings={{ locale: "ko", firstDayOfWeek: 1, weekendDays: [0, 6] }}
    >
      <CacheProvider>
        <MantineProvider theme={mantineTheme}>
          <ChakraProvider theme={chakraTheme}>
            <QueryClientProvider client={queryClient}>
              {children}
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
          </ChakraProvider>
        </MantineProvider>
      </CacheProvider>
    </DatesProvider>
  );
}

export default Providers;

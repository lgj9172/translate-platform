"use client";

import "dayjs/locale/ko";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import { MantineProvider, Textarea, createTheme } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";

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
  const [client] = React.useState(
    new QueryClient({ defaultOptions: { queries: { staleTime: 5000 } } }),
  );

  return (
    <DatesProvider
      settings={{ locale: "ko", firstDayOfWeek: 1, weekendDays: [0, 6] }}
    >
      <CacheProvider>
        <MantineProvider theme={mantineTheme}>
          <ChakraProvider theme={chakraTheme}>
            <QueryClientProvider client={client}>
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

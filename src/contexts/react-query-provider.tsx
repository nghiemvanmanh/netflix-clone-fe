"use client";
import { QueryClient, QueryClientProvider } from "react-query";
import { PropsWithChildren } from "react";

const ReactQueryProvider = ({ children }: PropsWithChildren) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default ReactQueryProvider;

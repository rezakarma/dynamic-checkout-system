"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextUIProvider } from "@nextui-org/react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUserCart } from "@/store/cart-slice";
const queryClient = new QueryClient();
export default function Providers({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getUserCart())
  },[])

  return (
    <QueryClientProvider client={queryClient}>
      <NextUIProvider>{children}</NextUIProvider>
    </QueryClientProvider>
  );
}

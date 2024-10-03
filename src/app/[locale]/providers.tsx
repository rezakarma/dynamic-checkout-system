"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextUIProvider } from "@nextui-org/react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUserCart } from "@/store/cart-slice";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
const queryClient = new QueryClient();
export default function Providers({ children }: { children: React.ReactNode }) {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch()
  useEffect(() => {
    dispatch(getUserCart())
  },[])

  return (
    <QueryClientProvider client={queryClient}>
      <NextUIProvider>{children}</NextUIProvider>
    </QueryClientProvider>
  );
}

"use client";

import { useLoading } from "./app-context";

interface LoadingProps {}

export function Loading(props: LoadingProps) {
  const { errorMessage, loadingState } = useLoading();
  let message = "Just hang tight for a moment!";

  if (loadingState === "Processing") {
    message = "Okay, I'm working on your masterpiece!";
  }

  return (
    <main className="flex-col max-h-[80dvh]  min-h-[80dvh] w-full flex items-center justify-center">
      <div className="rounded-2xl bg-indigo-300 aspect-square shadow-md border-2 border-slate-50 w-full overflow-hidden relative">
        <div className="animate-pulse blur-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-[130%] h-[130%] absolute left-[-90px] top-[-90px] text-2xl md:text-4xl tracking-tight flex items-center justify-center text-slate-50"></div>
        <div className="p-4 w-full h-full absolute left-0 top-0 text-2xl md:text-4xl tracking-tight flex items-center justify-center text-slate-50">
          <span className="font-light">{message}</span>
        </div>
      </div>
    </main>
  );
}

export function ShowError() {
  const { errorMessage } = useLoading();

  return (
    <main className="flex-col max-h-[80dvh]  min-h-[80dvh] w-full flex items-center justify-center">
      <div className="rounded-2xl flex bg-red-400 aspect-square shadow-md border-2 border-slate-50 w-full overflow-hidden relative">
        <div className="p-4 tracking-tight flex items-center justify-center text-slate-50 flex-1 ">
          <span className="font-light text-md whitespace-pre-wrap">
            {errorMessage}
          </span>
        </div>
      </div>
    </main>
  );
}

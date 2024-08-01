"use client";

import { useLoading } from "@/features/app-context";

export default function Loading() {
  const { setState } = useLoading();
  setState("loading");
  return (
    <main className="flex-col min-h-screen flex items-center justify-center">
      <div className="rounded-2xl aspect-square shadow-md border-2 border-slate-50 w-full overflow-hidden relative">
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-full h-full absolute left-0 top-0 text-4xl tracking-tight flex items-center justify-center text-slate-50">
          Generating Image
        </div>
      </div>
    </main>
  );
}

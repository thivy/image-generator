"use client";

export default function Loading() {
  return (
    <main className="flex-col max-h-[80dvh]  min-h-[80dvh] w-full flex items-center justify-center">
      <div className="rounded-2xl aspect-square shadow-md border-2 border-slate-50 w-full overflow-hidden relative">
        <div className="bg-gradient-to-br from-green-500 via-purple-500 to-pink-500 w-full h-full absolute left-0 top-0 text-2xl md:text-4xl tracking-tight flex items-center justify-center text-slate-50"></div>
        <div className="animate-ping bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-full h-full absolute left-0 top-0 text-2xl md:text-4xl tracking-tight flex items-center justify-center text-slate-50"></div>
        <div className="w-full h-full absolute left-0 top-0 text-2xl md:text-4xl tracking-tight flex items-center justify-center text-slate-50">
          <span className="font-bold">Generating Image</span>
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <main className="flex-col min-h-screen flex items-center justify-center">
      <div className="rounded-2xl aspect-square shadow-md border-2 border-slate-50 w-full overflow-hidden relative bg-slate-300">
        <div className="w-full h-full absolute left-0 top-0 text-2xl md:text-4xl tracking-tight flex items-center justify-center bg-[url('./poster.png')] bg-cover bg-center"></div>
      </div>
    </main>
  );
}

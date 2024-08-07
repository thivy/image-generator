import { fullImageUrl, getAllImages } from "@/features/actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ImagesHome() {
  const images = await getAllImages();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 flex-1 gap-4 space-y-5 items-center justify-center flex-col pb-4">
      {images.reverse().map(async (image) => {
        return (
          <main className="flex-col flex gap-2" key={image.id}>
            <div className="text-sm text-slate-500">{image.userId}</div>
            <div className="text-xs text-slate-400">{image.userPrompt}</div>
            <img
              src={await fullImageUrl(image.id)}
              className="rounded-2xl w-full max-h-[80dvh] shadow-md border-2 border-slate-50"
            />
          </main>
        );
      })}
    </div>
  );
}

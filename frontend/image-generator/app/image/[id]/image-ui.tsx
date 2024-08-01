"use client";

import { useLoading } from "@/features/app-context";
import { ImageLoadingState } from "./page";

interface ImageProps {
  state: ImageLoadingState;
  imageUrl: string;
}

export const ImageUI = (props: ImageProps) => {
  const { setState } = useLoading();
  setState(props.state);

  return (
    <main className="flex-col min-h-screen flex items-center justify-center">
      <img
        src={props.imageUrl}
        className="rounded-2xl aspect-square shadow-md border-2 border-slate-50"
      />
    </main>
  );
};

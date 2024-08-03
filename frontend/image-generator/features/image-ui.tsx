"use client";

import { loadImageFromServer } from "@/features/actions";
import { useLoading } from "@/features/app-context";
import Loading from "@/features/loading";
import { useEffect, useState } from "react";

interface ImageProps {
  imageId: string;
}

export const ImageUI = (props: ImageProps) => {
  const { setState, loadingState } = useLoading();
  const [imageState, setImageState] = useState("");

  useEffect(() => {
    const loadImage = async () => {
      setState("loading");

      try {
        const response = await loadImageFromServer(props.imageId);

        if (response.state === "success") {
          setImageState(response.imageUrl);
          setState("success");
        } else {
          await timeout(1000);
          return await loadImage();
        }
      } catch (e) {
        console.error(e);
        setState("error");
      }
    };

    const timeout = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    loadImage();
  }, [props.imageId, setState]);

  if (loadingState === "loading") {
    return <Loading />;
  }

  return (
    <main className="flex-col flex items-center justify-center p-3">
      <img
        src={imageState}
        className="rounded-2xl w-full max-h-[80dvh] shadow-md border-2 border-slate-50"
      />
    </main>
  );
};

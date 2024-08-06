"use client";

import { ImageLoadingState, loadImageFromServer } from "@/features/actions";
import { useLoading } from "@/features/app-context";
import { useEffect, useState } from "react";
import { Loading, ShowError } from "./loading";

interface ImageProps {
  imageId: string;
}

export const ImageUI = (props: ImageProps) => {
  const { setState, loadingState, setErrorMessage } = useLoading();
  const [imageState, setImageState] = useState("");

  useEffect(() => {
    const loadImage = async (lastState: ImageLoadingState) => {
      setState(lastState);

      try {
        const response = await loadImageFromServer(props.imageId);
        setState(response.state);

        if (response.state === "Success") {
          setImageState(response.imageUrl);
        } else if (response.state === "Error") {
          setErrorMessage(
            response.error ?? "There was an error loading the image"
          );
        } else {
          await timeout(3000);
          return await loadImage(response.state);
        }
      } catch (e) {
        console.error(e);
      }
    };

    const timeout = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    loadImage("Pending");
  }, [props.imageId, setState]);

  if (loadingState === "Pending" || loadingState === "Processing") {
    return <Loading />;
  }

  if (loadingState === "Error") {
    return <ShowError />;
  }

  return (
    <main className="flex-col flex items-center justify-center">
      <img
        src={imageState}
        className="rounded-2xl w-full max-h-[80dvh] shadow-md border-2 border-slate-50"
      />
    </main>
  );
};

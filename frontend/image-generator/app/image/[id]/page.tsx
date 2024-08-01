import { ImageUI } from "./image-ui";

interface ImageProps {
  params: {
    id: string;
  };
}

export type ImageLoadingState = "loading" | "success" | "error";

const loadImage = async (url: string) => {
  const imageUrl = `https://image-gen.azureedge.net/images/${url}.png`;

  let state: ImageLoadingState = "loading";

  try {
    const response = await fetch(imageUrl, {
      mode: "no-cors",
      cache: "no-cache",
    });

    state = response.ok ? "success" : "loading";

    if (state === "loading") {
      await timeout(2000);
      return await loadImage(url);
    }
  } catch (e) {
    console.error(e);
    state = "error";
  }

  return {
    state,
    imageUrl,
  };
};

const timeout = (ms: number) => new Promise((res) => setTimeout(res, ms));

export default async function ImageHome(props: ImageProps) {
  const img = await loadImage(props.params.id);
  return (
    <div className="flex min-h-screen  flex-col">
      <ImageUI imageUrl={img.imageUrl} state={img.state} />
    </div>
  );
}

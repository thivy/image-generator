import { ImageUI } from "../../../features/image-ui";

interface ImageProps {
  params: {
    id: string;
  };
}

export default function ImageHome(props: ImageProps) {
  return (
    <div className="flex min-h-dvh  flex-col overflow-hidden">
      <ImageUI imageId={props.params.id} />
    </div>
  );
}

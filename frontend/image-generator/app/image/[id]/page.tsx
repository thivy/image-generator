import { ImageUI } from "../../../features/image-ui";

interface ImageProps {
  params: {
    id: string;
  };
}

export default function ImageHome(props: ImageProps) {
  return (
    <div className="flex flex-1 items-center justify-center flex-col ">
      <ImageUI imageId={props.params.id} />
    </div>
  );
}

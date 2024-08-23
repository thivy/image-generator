import Image from "next/image";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { SignInWithLinkedIn } from "./auth";

export const HomePage = async () => {
  // const session = await auth();

  // if (session === null || session.user === undefined) {
  //   return <UnauthenticatedHome />;
  // }

  return <AuthenticatedHome />;
};

const AuthenticatedHome = () => {
  return (
    <div className="flex text-slate-600 justify-center flex-1 flex-col gap-12 text-4xl tracking-tight font-medium leading-normal">
      <p className="flex gap-2 flex-col ">
        Hello,{" "}
        <span className="flex gap-2 items-center">
          {/* <img
            src={session.user?.image ?? ""}
            alt="User Avatar"
            className="size-12 -rotate-12 rounded-md "
          />
          <span className="text-transparent bg-gradient-to-r from-purple-600  to-orange-400 bg-clip-text">
            {session.user?.name}{" "}
          </span> */}
        </span>
      </p>
      <p className="text-lg tracking-tight text-slate-600 font-light">
        <span className="block text-sm font-normal text-slate-400 mb-2">
          Let's create a masterpiece, together!
          <span className="text-2xl">👋</span>
        </span>{" "}
        Ask me to create a <span className="text-blue-500">Peacock</span>,{" "}
        <span className="text-blue-500">Sydney, Australia</span>,{" "}
        <span className="text-blue-500"> A kangaroo in a backyard </span>, or
        anything you can{" "}
        <span className="font-medium text-transparent bg-gradient-to-r from-purple-600  to-orange-400 bg-clip-text">
          imagine✨
        </span>
      </p>
      <HomeSlider />
    </div>
  );
};

const HomeSlider = () => {
  return (
    <div className="grid grid-cols-3 my-3">
      {/* <SliderItem className=" -rotate-12" imageId="nUBmhtz1bqQEjve1y2EiF" />
      <SliderItem className=" rotate-12" imageId="uu_9T9W-l1v9N3iT3yKkk" />
      <SliderItem className="-rotate-12" imageId="seXhCBAMtz48pmN1JCTeA" /> */}
    </div>
  );
};

type SliderItemProps = ComponentProps<"div"> & { imageId: string };

export const SliderItem = ({ imageId, ...props }: SliderItemProps) => {
  return (
    <div
      {...props}
      className={twMerge(
        "rounded-lg aspect-square bg-slate-200 shadow-lg overflow-hidden relative",
        props.className
      )}
    >
      <Image
        src={`/${imageId}.png`}
        width={500}
        height={500}
        alt="Picture of the author"
      />
    </div>
  );
};

const UnauthenticatedHome = () => {
  return (
    <div className="flex text-slate-600 justify-center flex-1 flex-col gap-6 font-medium leading-normal">
      <p className="text-4xl tracking-tight ">
        Hello, <span className="text-blue-400"> Friend </span>
      </p>
      <p className="text-lg tracking-tight text-slate-600 font-light">
        I can help you create a masterpiece for you! But, first, sign in with
        LinkedIn to get started!
      </p>

      <SignInWithLinkedIn />
    </div>
  );
};

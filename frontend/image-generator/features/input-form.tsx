"use client";

import { useRouter } from "next/navigation";
import { PropsWithChildren } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { generateImage } from "./actions";
import { useLoading } from "./app-context";

const initialState = {
  id: "",
  error: "",
};

export const InputForm = (props: PropsWithChildren) => {
  const { loadingState } = useLoading();
  const router = useRouter();
  const [formState, formAction] = useFormState(generateImage, initialState);

  if (formState.id.length > 0) {
    router.push(`/image/${formState.id}`);
  }

  return (
    <form action={formAction} className="max-h-screen h-screen relative ">
      {props.children}
      <div className="absolute bottom-0 left-0 w-full p-4 ">
        <div className="container mx-auto max-w-md flex items-center relative">
          {/* <div>{state.error.length > 0 ? state.error : ""}</div> */}
          <input
            name="prompt"
            type="text"
            disabled={loadingState === "loading"}
            placeholder="What do you want to generate?"
            className="text-slate-50 flex h-9 w-full rounded-full border border-slate-700 bg-slate-600 autofill:bg-yellow-200 p-7 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50 "
          />
          <SubmitButton />
        </div>
      </div>
    </form>
  );
};

export const SubmitButton = () => {
  const { pending } = useFormStatus();
  const { loadingState } = useLoading();
  return (
    <button
      type="submit"
      disabled={pending || loadingState === "loading"}
      className="size-12 bg-slate-800 flex items-center justify-center absolute right-1 rounded-full"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-white"
      >
        <path d="m5 12 7-7 7 7" />
        <path d="M12 19V5" />
      </svg>
    </button>
  );
};

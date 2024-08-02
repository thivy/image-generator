"use client";

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
  const [formState, formAction] = useFormState(generateImage, initialState);

  return (
    <form action={formAction} className="h-dvh relative ">
      {props.children}
      <div className="absolute bottom-0 left-0 w-full p-4 ">
        <div className="container mx-auto max-w-md flex items-center relative">
          {/* <div>{state.error.length > 0 ? state.error : ""}</div> */}
          <input
            name="prompt"
            type="text"
            maxLength={100}
            disabled={loadingState === "loading"}
            placeholder="What do you want to generate?"
            className="text-slate-50 text-base md:text-base flex h-9 w-full rounded-full border border-slate-700 bg-slate-600 autofill:bg-yellow-200 p-7 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50 "
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

  const LoadingSpinner = (
    <>
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
        className="stroke-white animate-spin"
      >
        <path
          d="M10 6C10 3.79086 8.20914 2 6 2C3.79086 2 2 3.79086 2 6C2 8.20914 3.79086 10 6 10C8.20914 10 10 8.20914 10 6Z"
          strokeWidth="1.5"
        />
        <path
          d="M10 18C10 15.7909 8.20914 14 6 14C3.79086 14 2 15.7909 2 18C2 20.2091 3.79086 22 6 22C8.20914 22 10 20.2091 10 18Z"
          strokeWidth="1.5"
        />
        <path
          d="M22 6C22 3.79086 20.2091 2 18 2C15.7909 2 14 3.79086 14 6C14 8.20914 15.7909 10 18 10C20.2091 10 22 8.20914 22 6Z"
          strokeWidth="1.5"
        />
        <path
          d="M22 18C22 15.7909 20.2091 14 18 14C15.7909 14 14 15.7909 14 18C14 20.2091 15.7909 22 18 22C20.2091 22 22 20.2091 22 18Z"
          strokeWidth="1.5"
        />
      </svg>
    </>
  );

  const DefaultButtonIcon = (
    <>
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
    </>
  );

  return (
    <button
      type="submit"
      disabled={pending || loadingState === "loading"}
      className="size-12 bg-slate-800 flex items-center justify-center absolute right-1 rounded-full"
    >
      {loadingState === "loading" ? LoadingSpinner : DefaultButtonIcon}
    </button>
  );
};

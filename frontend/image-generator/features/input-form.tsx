"use client";

import { useFormState, useFormStatus } from "react-dom";
import { generateImage, InputState } from "./actions";

const initialState: InputState = {
  id: "",
  error: "",
};

export const InputForm = () => {
  const [state, formAction] = useFormState(generateImage, initialState);

  return (
    <form className="flex flex-col" action={formAction}>
      <img
        width={200}
        src="https://image-gen.azureedge.net/images/4336ef5e-f554-432f-ab19-be72a77d99a2.png"
        alt="Logo"
      />
      <div>
        {state.error.length > 0 ? state.error : `Image ID: ${state.id}`}
      </div>
      <div>{state.error}</div>
      <input name="prompt" type="text" placeholder="Text" />
      <SubmitButton />
    </form>
  );
};

export const SubmitButton = () => {
  const { pending } = useFormStatus();
  console.log(pending);
  return (
    <button type="submit" disabled={pending}>
      Generate
    </button>
  );
};

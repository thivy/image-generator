"use client";

import { signIn, signOut } from "next-auth/react";

export const SignInWithLinkedIn = () => {
  return (
    <button
      className="flex gap-2 items-center justify-center bg-blue-500 text-slate-50 p-3 rounded-md"
      onClick={async () => {
        await signIn("linkedin");
      }}
    >
      Sign in with LinkedIn
    </button>
  );
};

export const SignOutWithLinkedIn = () => {
  return (
    <button
      onClick={async () => {
        await signOut();
      }}
    >
      Sign out
    </button>
  );
};

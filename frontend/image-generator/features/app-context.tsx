"use client";
import { ImageLoadingState } from "@/app/image/[id]/page";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface LoadingContextProps {
  loadingState: ImageLoadingState;
  setState: React.Dispatch<React.SetStateAction<ImageLoadingState>>;
}

const LoadingContext = createContext<LoadingContextProps | undefined>(
  undefined
);

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<ImageLoadingState>("success");

  return (
    <LoadingContext.Provider value={{ loadingState: state, setState }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextProps => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

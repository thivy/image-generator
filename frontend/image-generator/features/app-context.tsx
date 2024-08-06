"use client";
import React, { createContext, ReactNode, useContext, useState } from "react";
import { ImageLoadingState } from "./actions";

interface LoadingContextProps {
  loadingState: ImageLoadingState;
  setState: React.Dispatch<React.SetStateAction<ImageLoadingState>>;
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

const LoadingContext = createContext<LoadingContextProps | undefined>(
  undefined
);

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<ImageLoadingState>("Success");

  const [errorMessage, setErrorMessage] = useState("");
  return (
    <LoadingContext.Provider
      value={{ loadingState: state, setState, errorMessage, setErrorMessage }}
    >
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

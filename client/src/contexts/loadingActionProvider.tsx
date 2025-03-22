import React, { createContext, useContext, useState } from "react";

interface LoadingActionContext {
  startLoading: (arg: string) => void;
  stopLoading: (arg: string) => void;
  isLoading: (arg: string) => boolean;
}

const LoadingActionContext = createContext<LoadingActionContext | undefined>(
  undefined
);

export const LoadingActionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [loadingState, setLoadingState] = useState<{ [key: string]: boolean }>(
    {}
  );

  const startLoading = (loadingAction: string) => {
    setLoadingState((prev) => ({ ...prev, [loadingAction]: true }));
  };

  const stopLoading = (loadingAction: string) => {
    setLoadingState((prev) => ({ ...prev, [loadingAction]: false }));
  };

  const isLoading = (loadingAction: string) => {
    return !!loadingState[loadingAction];
  };

  return (
    <LoadingActionContext.Provider
      value={{ startLoading, stopLoading, isLoading }}
    >
      {children}
    </LoadingActionContext.Provider>
  );
};

export const useLoadingContext = () => {
  const context = useContext(LoadingActionContext);

  if (!context) {
    throw new Error("Loading context can not be used outside of its provider");
  }

  return context;
};

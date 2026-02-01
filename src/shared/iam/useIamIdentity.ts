import React from "react";
import type { IamIdentity } from "./iam.service";

export type IamIdentityState = {
  identity: IamIdentity | null;
  loading: boolean;
  error: string | null;
  refresh: (opts?: { force?: boolean }) => Promise<void>;
};

export const IamIdentityContext = React.createContext<IamIdentityState | undefined>(
  undefined,
);

export const useIamIdentity = (): IamIdentityState => {
  const ctx = React.useContext(IamIdentityContext);
  if (ctx) return ctx;
  if (import.meta.env.DEV) {
    console.warn("[iam] useIamIdentity used outside provider");
  }
  return {
    identity: null,
    loading: false,
    error: null,
    refresh: async () => undefined,
  };
};


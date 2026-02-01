import React from "react";
import { useAppSelector } from "@/hooks/useAppStore";
import type { RootState } from "@/store/rootReducer";
import { IamIdentityContext } from "@/shared/iam/useIamIdentity";
import {
  clearIamIdentityCache,
  getIamIdentity,
  type IamIdentity,
} from "@/shared/iam/iam.service";

type ProviderProps = {
  children: React.ReactNode;
};

export const IamAuthProvider = ({ children }: ProviderProps) => {
  const token = useAppSelector((state: RootState) => state.auth.token);
  const [identity, setIdentity] = React.useState<IamIdentity | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const refresh = React.useCallback(
    async (opts?: { force?: boolean }) => {
      if (!token) {
        setIdentity(null);
        setError(null);
        setLoading(false);
        clearIamIdentityCache();
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await getIamIdentity(opts);
        setIdentity(data);
      } catch (err: any) {
        setError(err?.message || "Failed to load IAM identity");
        setIdentity(null);
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  React.useEffect(() => {
    if (!token) {
      clearIamIdentityCache();
      setIdentity(null);
      setLoading(false);
      return;
    }
    void refresh();
  }, [token, refresh]);

  React.useEffect(() => {
    const handleInvalidate = () => void refresh({ force: true });
    window.addEventListener("iam:invalidate", handleInvalidate);
    return () => {
      window.removeEventListener("iam:invalidate", handleInvalidate);
    };
  }, [refresh]);

  return (
    <IamIdentityContext.Provider
      value={{
        identity,
        loading,
        error,
        refresh,
      }}
    >
      {children}
    </IamIdentityContext.Provider>
  );
};


import * as React from "react";

export interface UseMenuVersionState {
  version?: string | null;
  refresh: () => Promise<void>;
}

export const useMenuVersion = (): UseMenuVersionState => {
  const [version, setVersion] = React.useState<string | null>(null);

  const refresh = React.useCallback(async () => {
    setVersion((prev) => prev);
  }, []);

  return { version, refresh };
};

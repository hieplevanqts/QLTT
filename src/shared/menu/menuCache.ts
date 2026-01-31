const CACHE_PREFIX = "mappa.menu.cache:";
const DEFAULT_TTL_MS = 10 * 60 * 1000;

export const MENU_UPDATED_EVENT = "mappa:menu-updated";

export type MenuCacheEntry<T> = {
  expiresAt: number;
  data: T;
};

export const buildCacheKey = (userId: string, roleCodesHash: string, menuVersion: string | null) =>
  `${CACHE_PREFIX}${userId}:${roleCodesHash || "no-role"}:${menuVersion || "0"}`;

export const getCachedMenu = <T,>(key: string): T | null => {
  if (typeof localStorage === "undefined") return null;
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as MenuCacheEntry<T>;
    if (!parsed?.expiresAt || Date.now() > parsed.expiresAt) {
      localStorage.removeItem(key);
      return null;
    }
    return parsed.data;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
};

export const setCachedMenu = <T,>(key: string, data: T, ttlMs: number = DEFAULT_TTL_MS) => {
  if (typeof localStorage === "undefined") return;
  const payload: MenuCacheEntry<T> = {
    data,
    expiresAt: Date.now() + ttlMs,
  };
  localStorage.setItem(key, JSON.stringify(payload));
};

export const clearMenuCacheForUser = (userId: string) => {
  if (typeof localStorage === "undefined") return;
  const prefix = `${CACHE_PREFIX}${userId}:`;
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith(prefix)) {
      localStorage.removeItem(key);
    }
  });
};

export const clearAllMenuCache = () => {
  if (typeof localStorage === "undefined") return;
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith(CACHE_PREFIX)) {
      localStorage.removeItem(key);
    }
  });
};

export const emitMenuUpdated = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(MENU_UPDATED_EVENT));
};

export const getMenuFallbackEnabled = () =>
  Boolean(import.meta.env.DEV && import.meta.env.VITE_ENABLE_MENU_FALLBACK === "true");


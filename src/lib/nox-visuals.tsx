/* eslint-disable react-refresh/only-export-components -- shared media context, resolver and hooks. */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getBackendBaseUrl } from "@/lib/backend-api";
export type NoxCategoryGuide = {
  slug: string;
  name: string;
  intro: string;
  title: string;
  image?: string;
  alt?: string;
  sections: Array<{ heading: string; text: string }>;
};
export type NoxCatalog = {
  shopTitle?: string;
  shopIntro?: string;
  categories?: Record<string, NoxCategoryGuide>;
};
export type NoxVisuals = {
  shop?: string;
  catalog?: NoxCatalog;
  hero?: string;
  painting?: string;
  store?: string;
  gallery?: string[];
  portraits?: string[];
  categories?: Record<string, string>;
};
const Context = createContext<NoxVisuals>({});
export const useNoxVisuals = () => useContext(Context);
export function NoxVisualsProvider({
  value,
  children,
}: {
  value: NoxVisuals;
  children: ReactNode;
}) {
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export async function resolveNoxVisuals(): Promise<NoxVisuals> {
  try {
    const base = getBackendBaseUrl();
    if (!base) return {};
    const response = await fetch(`${base}/api/v1/storefront/bootstrap`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) return {};
    const payload = await response.json();
    return {
      ...(payload.data?.settings?.home?.["home.nox_visuals"] ?? {}),
      catalog: payload.data?.settings?.home?.["home.nox_catalog"] ?? {},
    };
  } catch {
    return {};
  }
}

/** Category aliases share the media selected in the backend homepage editor. */
export function noxVisualCategoryKey(slug: string) {
  return slug === "hoodies"
    ? "sweatshirts"
    : ["denim", "cotton-pants"].includes(slug)
      ? "pants"
      : slug;
}
export function useResolvedNoxVisuals() {
  const context = useNoxVisuals();
  const [resolved, setResolved] = useState<NoxVisuals>(context);
  useEffect(() => {
    if (Object.keys(context).length) {
      setResolved(context);
      return;
    }
    let cancelled = false;
    void resolveNoxVisuals().then((value) => {
      if (!cancelled) setResolved(value);
    });
    return () => {
      cancelled = true;
    };
  }, [context]);
  return resolved;
}

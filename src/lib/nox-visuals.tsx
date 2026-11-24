import { createContext, useContext, type ReactNode } from "react";
import { getBackendBaseUrl } from "@/lib/backend-api";
export type NoxVisuals = { hero?: string; painting?: string; store?: string; gallery?: string[]; portraits?: string[]; categories?: Record<string,string> };
const Context = createContext<NoxVisuals>({});
export const useNoxVisuals = () => useContext(Context);
export function NoxVisualsProvider({value,children}:{value:NoxVisuals;children:ReactNode}) {return <Context.Provider value={value}>{children}</Context.Provider>;}
export async function resolveNoxVisuals(): Promise<NoxVisuals> {
 try {const base=getBackendBaseUrl(); if(!base) return {}; const response=await fetch(`${base}/api/v1/storefront/bootstrap`,{headers:{Accept:"application/json"},signal:AbortSignal.timeout(4000)}); if(!response.ok) return {}; const payload=await response.json(); return payload.data?.settings?.home?.["home.nox_visuals"] ?? {};}catch{return {};}
}

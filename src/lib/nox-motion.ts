/** One document visit, not a route change. Refresh intentionally starts a new entry. */
export const noxIntro = { complete: false };
export const NOX_INTRO_EVENT = "nox:intro-handoff";
export const NOX_RESOURCE_LIMIT = 5000;
export const NOX_PHOTO_ANGLES = [-8, -18, -6, 9, -5, 12] as const;
export type NoxIntroPhase = "boot" | "preparing" | "intro" | "exiting" | "complete";

export function nextIntroPhase(phase: NoxIntroPhase): NoxIntroPhase {
  const next: Record<NoxIntroPhase, NoxIntroPhase> = {
    boot: "preparing", preparing: "intro", intro: "exiting", exiting: "complete", complete: "complete",
  };
  return next[phase];
}

/** A bounded, abortable wait; failed photos must not hold the storefront hostage. */
export function settleIntroResources(tasks: Promise<unknown>[], signal: AbortSignal, limit = NOX_RESOURCE_LIMIT): Promise<void> {
  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      signal.removeEventListener("abort", finish);
      resolve();
    };
    const timer = setTimeout(finish, limit);
    signal.addEventListener("abort", finish, { once: true });
    if (signal.aborted) finish();
    void Promise.allSettled(tasks).then(finish);
  });
}

export function decodeIntroImage(src: string): Promise<void> {
  const image = new Image();
  image.decoding = "async";
  const loaded = new Promise<void>((resolve) => {
    image.onload = () => resolve();
    image.onerror = () => resolve();
  });
  image.src = src;
  return typeof image.decode === "function" ? image.decode().catch(() => {}) : loaded;
}
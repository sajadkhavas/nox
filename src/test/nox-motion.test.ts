import { afterEach, expect, it, vi } from "vitest";
import { nextIntroPhase, NOX_PHOTO_ANGLES, NOX_RESOURCE_LIMIT, settleIntroResources } from "@/lib/nox-motion";

afterEach(() => vi.useRealTimers());

it("advances boot → preparing → intro → exiting → complete and never exits twice", () => {
  expect(nextIntroPhase("boot")).toBe("preparing");
  expect(nextIntroPhase("preparing")).toBe("intro");
  expect(nextIntroPhase("intro")).toBe("exiting");
  expect(nextIntroPhase("exiting")).toBe("complete");
  expect(nextIntroPhase("complete")).toBe("complete");
});

it("keeps all six photo rotations deterministic", () => {
  expect(NOX_PHOTO_ANGLES).toEqual([-8, -18, -6, 9, -5, 12]);
});

it("waits for ready resources but lets a failed photo settle", async () => {
  let ready: (() => void) | undefined;
  let completed = false;
  const pending = new Promise<void>((resolve) => { ready = resolve; });
  const wait = settleIntroResources([pending, Promise.reject(new Error("missing photo"))], new AbortController().signal).then(() => { completed = true; });
  await Promise.resolve();
  expect(completed).toBe(false);
  ready?.();
  await wait;
  expect(completed).toBe(true);
});

it("caps slow resource waiting at 5000ms", async () => {
  vi.useFakeTimers();
  let completed = false;
  expect(NOX_RESOURCE_LIMIT).toBe(5000);
  const wait = settleIntroResources([new Promise(() => {})], new AbortController().signal).then(() => { completed = true; });
  await vi.advanceTimersByTimeAsync(4999);
  expect(completed).toBe(false);
  await vi.advanceTimersByTimeAsync(1);
  await wait;
  expect(completed).toBe(true);
  expect(vi.getTimerCount()).toBe(0);
});

it("cleans up a cancelled resource wait immediately", async () => {
  vi.useFakeTimers();
  const controller = new AbortController();
  const wait = settleIntroResources([new Promise(() => {})], controller.signal);
  controller.abort();
  await wait;
  expect(vi.getTimerCount()).toBe(0);
});
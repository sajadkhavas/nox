import { afterEach, describe, expect, it, vi } from "vitest";
import { lockPageScroll } from "@/lib/page-scroll-lock";
describe("entry document scroll lock", () => {
  afterEach(() => {
    document.body.removeAttribute("style");
    document.documentElement.removeAttribute("style");
    vi.restoreAllMocks();
  });
  it("blocks touch, wheel and keyboard scrolling and restores pre-existing styles", () => {
    document.body.style.position = "relative";
    document.body.style.overflow = "clip";
    document.documentElement.style.overflow = "auto";
    const scroll = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    const release = lockPageScroll();
    expect(document.body.style.position).toBe("fixed");
    expect(document.documentElement.style.overflow).toBe("hidden");
    const touch = new Event("touchmove", { cancelable: true });
    document.dispatchEvent(touch);
    expect(touch.defaultPrevented).toBe(true);
    const wheel = new Event("wheel", { cancelable: true });
    document.dispatchEvent(wheel);
    expect(wheel.defaultPrevented).toBe(true);
    const key = new KeyboardEvent("keydown", { key: "PageDown", cancelable: true });
    document.dispatchEvent(key);
    expect(key.defaultPrevented).toBe(true);
    release();
    release();
    expect(scroll).toHaveBeenCalledTimes(1);
    expect(document.body.style.position).toBe("relative");
    expect(document.body.style.overflow).toBe("clip");
    expect(document.documentElement.style.overflow).toBe("auto");
    const after = new Event("touchmove", { cancelable: true });
    document.dispatchEvent(after);
    expect(after.defaultPrevented).toBe(false);
  });
});

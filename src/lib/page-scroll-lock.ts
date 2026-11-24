/** Freeze the document on touch devices as well as desktop; restore exact inline styles. */
export function lockPageScroll(): () => void {
  const root = document.documentElement;
  const body = document.body;
  const x = window.scrollX,
    y = window.scrollY;
  const bodyKeys = [
    "position",
    "top",
    "left",
    "right",
    "width",
    "overflow",
    "touchAction",
  ] as const;
  const rootKeys = ["overflow", "overscrollBehavior", "scrollBehavior"] as const;
  const previousBody = bodyKeys.map((key) => [key, body.style[key]] as const);
  const previousRoot = rootKeys.map((key) => [key, root.style[key]] as const);
  root.style.overflow = "hidden";
  root.style.overscrollBehavior = "none";
  root.style.scrollBehavior = "auto";
  Object.assign(body.style, {
    position: "fixed",
    top: `-${y}px`,
    left: "0",
    right: "0",
    width: "100%",
    overflow: "hidden",
    touchAction: "none",
  });
  const prevent = (event: Event) => {
    if (event.cancelable) event.preventDefault();
  };
  const keydown = (event: KeyboardEvent) => {
    if ([" ", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"].includes(event.key))
      event.preventDefault();
  };
  document.addEventListener("touchmove", prevent, { passive: false });
  document.addEventListener("wheel", prevent, { passive: false });
  document.addEventListener("keydown", keydown);
  let released = false;
  return () => {
    if (released) return;
    released = true;
    document.removeEventListener("touchmove", prevent);
    document.removeEventListener("wheel", prevent);
    document.removeEventListener("keydown", keydown);
    previousBody.forEach(([key, value]) => {
      body.style[key] = value;
    });
    window.scrollTo({ left: x, top: y, behavior: "instant" });
    previousRoot.forEach(([key, value]) => {
      root.style[key] = value;
    });
  };
}

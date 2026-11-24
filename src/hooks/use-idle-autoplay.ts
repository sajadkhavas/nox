import { useEffect, useRef, useState } from "react";

// Each rail/card owns its clock; bubbled interaction also pauses its parent rail.
export function useIdleAutoplay<T extends HTMLElement = HTMLDivElement>(
  step: () => void,
  delay: number,
  enabled = true,
) {
  const ref = useRef<T>(null);
  const callback = useRef(step);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    callback.current = step;
  }, [step]);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.15,
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled || !visible) return;
    const interaction = element.closest("[data-home-product-carousel]") ?? element;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setTimeout>;
    let held = false;
    let hovering = interaction.matches(":hover");
    let focused = interaction.contains(document.activeElement);
    const clear = () => clearTimeout(timer);
    const schedule = (wait: number) => {
      clear();
      if (held || hovering || focused || document.hidden || motion.matches) return;
      timer = setTimeout(() => {
        callback.current();
        schedule(delay);
      }, wait);
    };
    const activity = () => schedule(3000);
    const down = () => {
      held = true;
      clear();
    };
    const up = () => {
      if (!held) return;
      held = false;
      activity();
    };
    const enter = () => {
      hovering = true;
      clear();
    };
    const leave = () => {
      hovering = false;
      schedule(delay);
    };
    const focus = () => {
      focused = true;
      clear();
    };
    const blur = (event: Event) => {
      if (!interaction.contains((event as FocusEvent).relatedTarget as Node | null)) {
        focused = false;
        schedule(delay);
      }
    };
    const visibility = () => schedule(delay);
    interaction.addEventListener("pointerdown", down);
    interaction.addEventListener("pointermove", activity);
    interaction.addEventListener("pointerenter", enter);
    interaction.addEventListener("pointerleave", leave);
    interaction.addEventListener("focusin", focus);
    interaction.addEventListener("focusout", blur);
    interaction.addEventListener("keydown", activity);
    interaction.addEventListener("wheel", activity, { passive: true });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    document.addEventListener("visibilitychange", visibility);
    motion.addEventListener("change", visibility);
    schedule(delay);
    return () => {
      clear();
      interaction.removeEventListener("pointerdown", down);
      interaction.removeEventListener("pointermove", activity);
      interaction.removeEventListener("pointerenter", enter);
      interaction.removeEventListener("pointerleave", leave);
      interaction.removeEventListener("focusin", focus);
      interaction.removeEventListener("focusout", blur);
      interaction.removeEventListener("keydown", activity);
      interaction.removeEventListener("wheel", activity);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      document.removeEventListener("visibilitychange", visibility);
      motion.removeEventListener("change", visibility);
    };
  }, [delay, enabled, visible]);
  return { ref, visible };
}

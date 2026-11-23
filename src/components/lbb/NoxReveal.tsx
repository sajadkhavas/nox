import { useEffect } from "react";
import { NOX_INTRO_EVENT, noxIntro } from "@/lib/nox-motion";

const seenTitles = new Set<string>();

export function NoxReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !Element.prototype.animate) return;
    const animations: Animation[] = [];
    const waiting = new Set<Element>();
    let handedOff = noxIntro.complete;
    const run = (node: Element) => {
      if (node.getAttribute("data-nox-seen") === "true") return;
      node.setAttribute("data-nox-seen", "true");
      seenTitles.add(node.textContent ?? "");
      node.removeAttribute("data-text-pending");
      const inner = node.querySelector(".nox-text-motion") ?? node;
      animations.push(inner.animate([
        { transform: "translateY(105%)", clipPath: "inset(0 0 100%)" },
        { transform: "translateY(0)", clipPath: "inset(0)" },
      ], { duration: 850, easing: "cubic-bezier(0.215,0.61,0.355,1)", fill: "both" }));
      observer.unobserve(node);
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        if (handedOff) run(entry.target); else waiting.add(entry.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0 });
    document.querySelectorAll(".nox-home section:not(.nox-hero) h2").forEach((node) => {
      if (seenTitles.has(node.textContent ?? "") || node.getAttribute("data-nox-seen") === "true") return;
      node.setAttribute("data-text-pending", "true"); observer.observe(node);
    });
    const intro = () => {
      handedOff = true;
      waiting.forEach(run); waiting.clear();
      const ease = "cubic-bezier(0.215,0.61,0.355,1)";
      const motion = (selector: string, duration: number, delay: number, keyframes: Keyframe[]) => {
        document.querySelectorAll(selector).forEach((node) => animations.push(node.animate(keyframes, { duration, delay, easing: ease, fill: "both" })));
      };
      motion(".nox-hero__wordmark > .nox-text-motion, .nox-hero h1 > .nox-text-motion", 950, 500, [{ transform: "translateY(105%)" }, { transform: "translateY(0)" }]);
      motion(".nox-nav-wordmark, .nox-hero__topline, .nox-hero-header__logo, .nox-hero-header__links", 600, 600, [{ opacity: 0, transform: "translateY(-14px)" }, { opacity: 1, transform: "translateY(0)" }]);
      motion(".nox-nav-divider, .nox-hero__label, .nox-hero__bottom, .nox-hero__eyebrow", 750, 680, [{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0)" }]);
      motion(".nox-hero__editorial p, .nox-hero__editorial a, .nox-hero__signature, .nox-hero__tagline, .nox-hero__actions", 600, 800, [{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "translateY(0)" }]);
      motion(".nox-hero__image", 1100, 580, [{ clipPath: "inset(0 100% 0 0)", transform: "translateX(-8%) scale(1.12)" }, { clipPath: "inset(0)", transform: "translateX(0) scale(1)" }]);
    };
    window.addEventListener(NOX_INTRO_EVENT, intro);
    return () => {
      observer.disconnect(); window.removeEventListener(NOX_INTRO_EVENT, intro);
      animations.forEach((animation) => animation.cancel());
      document.querySelectorAll("[data-text-pending]").forEach((node) => node.removeAttribute("data-text-pending"));
    };
  }, []);
  return null;
}

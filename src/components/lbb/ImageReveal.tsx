import { type ReactNode, useEffect, useRef } from "react";
import { NOX_INTRO_EVENT, noxIntro } from "@/lib/nox-motion";

const seenImages = new Set<string>();

/** Frame and motion layer own separate transforms; children retain their hover/carousel behavior. */
export function ImageReveal({ children, className = "", order = 0 }: { children: ReactNode; className?: string; order?: number }) {
  const frame = useRef<HTMLDivElement>(null);
  const shown = useRef(false);
  useEffect(() => {
    const node = frame.current;
    if (!node || shown.current || !node.closest(".nox-home")) return;
    const imageKey = node.querySelector("img")?.getAttribute("src");
    if (imageKey && seenImages.has(imageKey)) { shown.current = true; return; }
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches || !window.IntersectionObserver) return;
    let active = true;
    let triggered = false;
    let handedOff = noxIntro.complete;
    const reveal = () => {
      if (!active || shown.current || !triggered || !handedOff) return;
      shown.current = true;
      if (imageKey) seenImages.add(imageKey);
      node.dataset.reveal = "shown";
      observer.unobserve(node);
    };
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) { triggered = true; reveal(); }
    }, { threshold: 0, rootMargin: "0px 0px -12% 0px" });
    const preload = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      node.querySelectorAll("img").forEach((image) => { image.loading = "eager"; });
      preload.unobserve(node);
    }, { rootMargin: "600px 0px" });
    const handoff = () => { handedOff = true; reveal(); };
    const motionChange = () => { if (media.matches) { node.dataset.reveal = "shown"; shown.current = true; observer.disconnect(); } };
    node.dataset.reveal = "pending";
    observer.observe(node);
    preload.observe(node);
    window.addEventListener(NOX_INTRO_EVENT, handoff);
    media.addEventListener("change", motionChange);
    return () => {
      active = false;
      observer.disconnect(); preload.disconnect();
      window.removeEventListener(NOX_INTRO_EVENT, handoff);
      media.removeEventListener("change", motionChange);
      delete node.dataset.reveal;
    };
  }, []);
  return <div ref={frame} className={`nox-image-reveal ${className}`} data-order={order % 3}>
    <div className="nox-image-reveal__motion">{children}</div>
  </div>;
}
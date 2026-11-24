import { lockPageScroll } from "@/lib/page-scroll-lock";
import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { noxCategoryCover } from "@/lib/nox-category-covers";
import logo from "@/assets/imported/public/brand/nox-logo.jpg.asset.json";
import {
  decodeIntroImage,
  nextIntroPhase,
  NOX_INTRO_EVENT,
  NOX_PHOTO_ANGLES,
  noxIntro,
  settleIntroResources,
  type NoxIntroPhase,
} from "@/lib/nox-motion";

const PHOTOS = ["denim", "tshirts", "jorts", "sweatshirts", "cotton-pants", "jackets"].flatMap(
  (slug) => {
    const src = noxCategoryCover(slug);
    return src ? [src] : [];
  },
);
const EASE = "cubic-bezier(0.215,0.61,0.355,1)";

export function NoxEntry() {
  // Identical server/client first render: no flash of the storefront before hydration.
  const [phase, setPhase] = useState<NoxIntroPhase>("boot");
  const [replay, setReplay] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    let active = true;
    let frame = 0;
    let current: NoxIntroPhase = "boot";
    const abort = new AbortController();
    const animations: Animation[] = [];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let unlockScroll: (() => void) | undefined;
    const focus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const inertNodes = new Map<HTMLElement, boolean>();
    const release = () => {
      unlockScroll?.();
      unlockScroll = undefined;
      inertNodes.forEach((value, node) => {
        node.inert = value;
      });
      inertNodes.clear();
    };
    const handoff = () => {
      document.documentElement.dataset.noxIntro = "handoff";
      window.dispatchEvent(new Event(NOX_INTRO_EVENT));
    };
    const finish = () => {
      if (!active) return;
      current = "complete";
      noxIntro.complete = true;
      release();
      setPhase("complete");
      delete document.documentElement.dataset.noxIntro;
      if (focus?.isConnected && focus !== document.body) focus.focus({ preventScroll: true });
    };
    const advance = () => {
      current = nextIntroPhase(current);
      setPhase(current);
    };
    const animate = (
      target: Element | null,
      keyframes: Keyframe[],
      duration: number,
      delay = 0,
    ) => {
      if (!target) return;
      const animation = target.animate(keyframes, { duration, delay, easing: EASE, fill: "both" });
      animations.push(animation);
    };
    // All motion in each phase uses this single clock; cancellation resolves its wait.
    let cancelClock: (() => void) | undefined;
    const clock = (duration: number, onTick?: (progress: number) => void) =>
      new Promise<void>((resolve) => {
        const start = performance.now();
        cancelClock = resolve;
        const tick = (now: number) => {
          if (!active) {
            resolve();
            return;
          }
          const progress = Math.min(1, (now - start) / duration);
          onTick?.(progress);
          if (progress === 1) {
            cancelClock = undefined;
            resolve();
          } else frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      });
    const skip = () => {
      if (!reduced.matches || current === "complete") return;
      cancelAnimationFrame(frame);
      cancelClock?.();
      abort.abort();
      animations.forEach((animation) => animation.cancel());
      handoff();
      finish();
    };

    if ((noxIntro.complete && replay === 0) || reduced.matches || !Element.prototype.animate) {
      handoff();
      finish();
      return () => {
        active = false;
      };
    }
    noxIntro.complete = false;
    document.documentElement.dataset.noxIntro = "waiting";
    unlockScroll = lockPageScroll();
    // Lock only siblings of the overlay, never an ancestor of it.
    let branch: HTMLElement | null = overlay;
    while (branch?.parentElement && branch !== document.body) {
      for (const sibling of Array.from(branch.parentElement.children)) {
        if (
          sibling instanceof HTMLElement &&
          sibling !== branch &&
          !["SCRIPT", "STYLE", "LINK"].includes(sibling.tagName)
        ) {
          inertNodes.set(sibling, sibling.inert);
          sibling.inert = true;
        }
      }
      branch = branch.parentElement;
    }
    if (counterRef.current) counterRef.current.textContent = "000";
    reduced.addEventListener("change", skip);
    advance();
    const hero = document.querySelector<HTMLImageElement>(".nox-hero__image");
    const resources = [
      ...PHOTOS,
      logo.url,
      ...(hero?.currentSrc || hero?.src ? [hero.currentSrc || hero.src] : []),
    ].map(decodeIntroImage);
    if (document.fonts) resources.push(document.fonts.ready.then(() => {}));
    void (async () => {
      await settleIntroResources(resources, abort.signal, 1200);
      if (!active || abort.signal.aborted) return;
      advance();
      overlay.querySelectorAll<HTMLImageElement>(".nox-entry__photo").forEach((image, index) => {
        animate(
          image,
          [
            { transform: "translate(-50%, -50%) rotate(0deg) scale(0.015)" },
            {
              transform: `translate(-50%, -50%) rotate(${NOX_PHOTO_ANGLES[index] ?? 0}deg) scale(1)`,
            },
          ],
          560,
          index * 120,
        );
      });
      const mark = overlay.querySelector(".nox-entry__brand");
      animate(
        mark,
        [
          { clipPath: "inset(100% 0 0)", transform: "translateY(22px)" },
          { clipPath: "inset(0)", transform: "translateY(0)" },
        ],
        650,
        350,
      );
      await clock(1800, (progress) => {
        // This is an entry-sequence counter, not a claimed download percentage.
        if (counterRef.current)
          counterRef.current.textContent = String(Math.floor(progress * 100)).padStart(3, "0");
      });
      if (!active || abort.signal.aborted) return;
      advance();
      overlay.querySelectorAll<HTMLImageElement>(".nox-entry__photo").forEach((image, index) => {
        animate(
          image,
          [
            {
              transform: `translate(-50%, -50%) rotate(${NOX_PHOTO_ANGLES[index] ?? 0}deg) scale(1)`,
            },
            {
              transform: `translate(-50%, -50%) rotate(${NOX_PHOTO_ANGLES[index] ?? 0}deg) scale(0)`,
            },
          ],
          460,
          (PHOTOS.length - index - 1) * 55,
        );
      });
      animate(
        counterRef.current,
        [
          { transform: "translateY(0)", opacity: 1 },
          { transform: "translateY(-100%)", opacity: 0 },
        ],
        240,
      );
      animate(
        mark,
        [
          { transform: "translateY(0)", clipPath: "inset(0)" },
          { transform: "translateY(48px)", clipPath: "inset(0 0 100%)" },
        ],
        550,
        180,
      );
      // Observed reference exit: lower edge retracts upward, never whole-overlay fading.
      animate(overlay, [{ clipPath: "inset(0 0 0%)" }, { clipPath: "inset(0 0 100%)" }], 850, 140);
      handoff();
      await clock(1000);
      finish();
    })().catch(() => {
      if (active) {
        handoff();
        finish();
      }
    });
    return () => {
      active = false;
      abort.abort();
      cancelAnimationFrame(frame);
      cancelClock?.();
      animations.forEach((animation) => animation.cancel());
      reduced.removeEventListener("change", skip);
      release();
      delete document.documentElement.dataset.noxIntro;
    };
  }, [replay]);

  if (phase === "complete")
    return import.meta.env.DEV ? (
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="nox-entry-replay"
        title="بازپخش ورود"
        aria-label="بازپخش ورود"
        onClick={() => {
          setPhase("boot");
          setReplay((value) => value + 1);
        }}
      >
        <RotateCcw size={15} />
      </Button>
    ) : null;
  return (
    <>
      <div ref={overlayRef} className="nox-entry" data-phase={phase} aria-hidden="true" dir="ltr">
        <div className="nox-entry__composition">
          <span className="nox-entry__bootmark" aria-hidden="true">
            NOX
            <span />
          </span>
          <div className="nox-entry__stack">
            {PHOTOS.map((src, index) => (
              <img
                key={src}
                className="nox-entry__photo"
                src={src}
                alt=""
                width={300}
                height={400}
                decoding="async"
                fetchPriority="high"
                data-photo={index}
                onError={(event) => {
                  event.currentTarget.hidden = true;
                }}
              />
            ))}
          </div>
          <div className="nox-entry__brand">
            <img src={logo.url} alt="" width={640} height={640} />
          </div>
          <div className="nox-entry__counter-mask">
            <span ref={counterRef} className="nox-entry__count">
              000
            </span>
          </div>
        </div>
      </div>
      <noscript>
        <style>
          {
            ".nox-entry{display:none!important}html:has(.nox-entry),body:has(.nox-entry){overflow:auto!important;overscroll-behavior:auto!important}"
          }
        </style>
      </noscript>
    </>
  );
}

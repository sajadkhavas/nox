import { useEffect, useRef, useState } from "react";
import { nextNoxCarouselFrame } from "@/lib/nox-carousel";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Pause, Play, Images } from "lucide-react";
import { ProductCard } from "@/components/lbb/ProductCard";
import type { ProductCardModel } from "@/components/lbb/ProductCard";

const PAGE_SIZE = 4;
const FRAME_MS = 3200;

export function NoxProductCarousel({ products }: { products: ProductCardModel[] }) {
  const host = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ page: 0, photo: 0 });
  const [visible, setVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const interacting = hovered || focused;
  const [reducedMotion, setReducedMotion] = useState(false);
  const pageCount = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const page = position.page % pageCount;
  const cards = Array.from(
    { length: Math.min(PAGE_SIZE, products.length) },
    (_, index) => products[(page * PAGE_SIZE + index) % products.length],
  );
  const photoCount = Math.max(
    1,
    ...cards.map((product) => ("previewImages" in product ? product.previewImages.length : 1)),
  );
  const canPlay = pageCount > 1 || photoCount > 1;

  useEffect(() => {
    const node = host.current;
    if (!node) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(media.matches);
    const updateTab = () => setTabVisible(document.visibilityState === "visible");
    updateMotion();
    updateTab();
    media.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateTab);
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
    });
    observer.observe(node);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateTab);
    };
  }, []);

  useEffect(() => {
    if (!visible || !tabVisible || paused || interacting || reducedMotion || !canPlay) return;
    const timer = window.setTimeout(() => {
      setPosition(nextNoxCarouselFrame(position, photoCount, pageCount));
    }, FRAME_MS);
    return () => window.clearTimeout(timer);
  }, [
    canPlay,
    interacting,
    page,
    pageCount,
    paused,
    photoCount,
    position.photo,
    reducedMotion,
    tabVisible,
    visible,
  ]);

  const move = (direction: number) =>
    setPosition({ page: (page + direction + pageCount) % pageCount, photo: 0 });

  return (
    <div ref={host} className="mt-8">
      <div
        className="grid grid-cols-2 items-start gap-3 lg:grid-cols-4 lg:gap-4"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
        }}
      >
        {cards.map((product, index) => (
          <div
            key={product.slug}
            className="min-w-0"
          >
            <ProductCard
              p={product}
              revealOrder={index}
              carouselImageIndex={Math.min(
                position.photo,
                Math.max(0, ("previewImages" in product ? product.previewImages.length : 1) - 1),
              )}
            />
          </div>
        ))}
      </div>
      {canPlay ? (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm">
          {pageCount > 1 ? (
            <Button variant="outline" size="icon" aria-label="محصولات قبلی" title="محصولات قبلی"
              type="button"
              className="nox-car-btn"
              onClick={() => move(-1)}
            >
              <ChevronRight />
            </Button>
          ) : null}
          {!reducedMotion ? (
            <Button variant="outline" size="icon" aria-label={paused ? "ادامه نمایش" : "توقف نمایش"} title={paused ? "ادامه نمایش" : "توقف نمایش"}
              type="button"
              className="nox-car-btn"
              onClick={() => setPaused((value) => !value)}
            >
              {paused ? <Play /> : <Pause />}
            </Button>
          ) : null}
          {photoCount > 1 ? (
            <Button variant="outline" size="icon" aria-label="عکس بعدی" title="عکس بعدی"
              type="button"
              className="nox-car-btn"
              onClick={() => setPosition({ page, photo: (position.photo + 1) % photoCount })}
            >
              <Images />
            </Button>
          ) : null}
          {pageCount > 1 ? (
            <Button variant="outline" size="icon" aria-label="محصولات بعدی" title="محصولات بعدی"
              type="button"
              className="nox-car-btn"
              onClick={() => move(1)}
            >
              <ChevronLeft />
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

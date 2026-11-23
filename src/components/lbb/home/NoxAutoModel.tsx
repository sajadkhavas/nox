import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";

import statueStill from "@/assets/nox-statue-still.png.asset.json";
import dollStill from "@/assets/nox-doll-still.png.asset.json";

const Viewer = lazy(() =>
  import("@/components/lbb/product/ProductModel3dViewer").then((module) => ({
    default: module.ProductModel3dViewer,
  })),
);

export function NoxAutoModel({ modelUrl, detailUrl, name, interactive = false }: { modelUrl: string; detailUrl?: string; name: string; interactive?: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const markReady = useCallback(() => setReady(true), []);
  const fallback = modelUrl.includes("doll") ? dollStill.url : statueStill.url;
  const fail = useCallback(() => setFailed(true), []);

  useEffect(() => {
    void import("@/components/lbb/product/ProductModel3dViewer");
    const node = host.current;
    if (!node) return;
    if (!("IntersectionObserver" in window)) {
      setMounted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setMounted(true);
        observer.disconnect();
      },
      { rootMargin: "900px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={host} className="relative h-full w-full" data-model-failed={failed}>
      {!ready && !failed && <div className="nox-model-loader" role="status" aria-label="بارگذاری مجسمه ناکس"><span className="nox-model-loader__orbit"/><span className="nox-model-loader__mark">N</span><span className="sr-only">مجسمه در حال بارگذاری است</span></div>}
      {failed && <img src={fallback} alt={name} width={480} height={480} loading="eager" decoding="async" className="nox-model-fallback" />}
      {mounted && !failed ? (
        <Suspense fallback={null}>
          <Viewer modelUrl={modelUrl} productName={name} onError={fail} presentation="showcase" interactive={interactive} detailUrl={detailUrl} onReady={markReady} />
        </Suspense>
      ) : null}
    </div>
  );
}

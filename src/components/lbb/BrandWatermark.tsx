import { NOX_LOGO_URL } from "@/components/lbb/Logo";

/** Stationary decorative canvas, below content and product photography. */
export function BrandWatermark() {
  return (
    <div className="nox-brand-watermark" aria-hidden="true">
      <img src={NOX_LOGO_URL} alt="" width={640} height={640} decoding="async" />
    </div>
  );
}

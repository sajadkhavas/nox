import { cn } from "@/lib/utils";

export const NOX_LOGO_URL = "/__l5e/assets-v1/fe19b9fb-8e5a-485f-b38f-dc11c0ebee6e/nox-logo.jpg";

/** Client supplied artwork, with its original proportions and complete silhouette. */
export function Logo({
  size = 34,
  className,
  withWordmark = false,
  square = false,
}: {
  size?: number;
  className?: string;
  withWordmark?: boolean;
  square?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span role="img" aria-label="نشان ناکس" className="nox-logo-cutout shrink-0" data-square={square || undefined} style={{ width: size, height: size, maskImage: `url(${NOX_LOGO_URL})`, maskMode: "luminance", maskSize: "contain", maskRepeat: "no-repeat", maskPosition: "center", backgroundColor: "currentColor", display: "inline-block" }} />
      {withWordmark ? <span className="sr-only">NOX Collection</span> : null}
    </span>
  );
}

import { cn } from "@/lib/utils";

export const NOX_LOGO_URL = "/brand/nox-logo.jpg";

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
      <img
        src={NOX_LOGO_URL}
        alt=""
        width={size}
        height={size}
        decoding="async"
        className="nox-logo shrink-0 object-contain"
        data-square={square || undefined}
        style={{ width: size, height: size }}
      />
      {withWordmark ? <span className="sr-only">NOX Collection</span> : null}
    </span>
  );
}

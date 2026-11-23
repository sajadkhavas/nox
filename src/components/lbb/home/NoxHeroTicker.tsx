const ITEMS = [
  ["FALL COLLECTION 2024", <path key="v" d="M8 8 L20 32 L32 8 M14 22 L26 22" strokeWidth="2" strokeLinecap="round" />],
  ["MADE IN DARKNESS", <><circle cx="20" cy="20" r="12" strokeWidth="1.5" /><circle cx="20" cy="20" r="4" fill="currentColor" opacity="0.5" /></>],
  ["LIMITED DROPS ONLY", <path key="e" d="M6 20 Q20 6 34 20 Q20 34 6 20Z" strokeWidth="1.5" />],
  ["NOX STREETWEAR", <><line x1="8" y1="8" x2="32" y2="32" strokeWidth="2.5" /><line x1="32" y1="8" x2="8" y2="32" strokeWidth="2.5" /></>],
  ["WEAR THE VOID", <path key="s" d="M20 4 L24 16 L36 16 L26 24 L30 36 L20 28 L10 36 L14 24 L4 16 L16 16Z" strokeWidth="1.2" />],
  ["BORN FROM SHADOW", <><ellipse cx="20" cy="20" rx="14" ry="8" strokeWidth="1.5" /><line x1="6" y1="20" x2="34" y2="20" strokeWidth="1" /></>],
] as const;

export function NoxHeroTicker() {
  const row = (copy: number) => ITEMS.flatMap(([label, glyph], index) => [
    <span className="nox-ticker__item" key={`${copy}-${label}`}><svg className="nox-ticker__glyph" viewBox="0 0 40 40" fill="none" stroke="currentColor" aria-hidden="true">{glyph}</svg>{label}</span>,
    <span className="nox-ticker__sep" key={`${copy}-sep-${index}`} aria-hidden="true">✦</span>,
  ]);
  return <div className="nox-ticker" dir="ltr" aria-label="NOX streetwear announcements"><div className="nox-ticker__track">{row(0)}<span aria-hidden="true" className="contents">{row(1)}</span></div></div>;
}
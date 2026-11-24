import { Logo } from "@/components/lbb/Logo";
import { NoxMotif } from "@/components/lbb/NoxMotif";
export function NoxHeroTicker() {
  return <div className="nox-ticker nox-ticker--ink" dir="ltr" aria-label="ناکس؛ استریت‌ویر با امضای خودت">
    <div className="nox-ticker__track" aria-hidden="true">{[0,1,2,3].map(i => <div className="nox-ink-repeat" key={i}><NoxMotif dense /><NoxMotif /></div>)}</div>
    <div className="nox-ticker__brand"><Logo size={60}/></div>
  </div>;
}

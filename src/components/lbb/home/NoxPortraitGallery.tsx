import { useNoxVisuals } from "@/lib/nox-visuals";
import { Shell } from "@/components/lbb/ui/primitives";
export function NoxPortraitGallery() {
 const visuals=useNoxVisuals();const images=visuals.portraits?.length ? visuals.portraits : ["/brand/editorial/portrait-cap.webp","/brand/editorial/portrait-white.webp"];
 return <section className="nox-portrait-section" aria-label="پرتره‌های دست‌ساز دنیای ناکس"><Shell className="nox-portrait-pair">
 {images.slice(0,2).map((url,i)=><figure className="nox-picture-frame nox-portrait-frame" key={url}><img src={url} alt={i===0 ? "پرتره نقاشی با کلاه مشکی و زنجیر طلایی؛ هنر دیواری ناکس" : "پرتره نقاشی با تیشرت سفید و گردنبند؛ هنر دیواری ناکس"} width={800} height={800} loading="lazy" decoding="async"/></figure>)}
 </Shell></section>;
}

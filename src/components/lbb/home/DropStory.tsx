import { Link } from "@tanstack/react-router";
import { ArrowUpLeft } from "lucide-react";
import { useNoxVisuals } from "@/lib/nox-visuals";
import { Shell } from "@/components/lbb/ui/primitives";
import type { CollectionDto } from "@/lib/backend-api";
import type { BackendCatalogCard } from "@/lib/backend-storefront";
export type LiveFeaturedStory = {collection:CollectionDto;products:BackendCatalogCard[]};
const names=["چشم ناکس؛ شروع یک دنیای دیگر","استایل، بیرون از مدار همیشگی","از زمین تا دنیای خودت","جزئیات دنیای ناکس"];
export function DropStory(_props:{liveStory?:LiveFeaturedStory|null}) {
 const visuals=useNoxVisuals();const gallery=visuals.gallery?.length ? visuals.gallery : [0,1,2,3].map(i=>`/brand/editorial/art-${i}.webp`);
 return <section className="nox-identity" aria-labelledby="drop-story-title" dir="rtl"><Shell>
 <div className="nox-section-kicker"><span dir="ltr">03 / THE NOX IDENTITY</span><span>دنیای ناکس</span></div>
 <div className="nox-identity__heading"><h2 id="drop-story-title">پوشاک ما، بخشی از دنیای ماست.</h2><div><p>ما ناکس را از سال ۲۰۲۱ با سلیقهٔ خودمان ساخته‌ایم؛ از تیشرت‌های گرافیکی و فرم‌های بگ تا نقاشی‌های روی دیوار فروشگاه. برای ما، استریت‌ویر فقط لباس نیست؛ راهی است برای نشان‌دادن چیزی که دوستش داری.</p><Link to="/about" className="nox-editorial-link">داستان ناکس <ArrowUpLeft size={18}/></Link></div></div>
 <div className="nox-identity__gallery">{gallery.map((url,i)=><figure key={url}><img src={url} alt={names[i] ?? "نقاشی دنیای ناکس"} width={640} height={640} loading="lazy" decoding="async"/><figcaption><span dir="ltr">NOX ART / {String(i+1).padStart(2,"0")}</span><span>{names[i]}</span></figcaption></figure>)}</div>
 </Shell></section>;
}

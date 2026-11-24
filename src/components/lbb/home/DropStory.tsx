import { NoxAutoModel } from "./NoxAutoModel";
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
 <div className="nox-identity__composition">
 <div className="nox-identity__story"><h2 id="drop-story-title">از خیابان.<br/>برای خودت.</h2><p>ما ناکس را از سال ۲۰۲۱ با الهام از استایل شخصی خودمان ساخته‌ایم؛ تیشرت‌های گرافیکی، شلوارهای بگ، هودی و کت‌هایی که با سلیقهٔ مجموعه و همکاری تولیدکنندهٔ طرف قرارداد آماده می‌شوند.</p><p>نقاشی‌ها و مجسمه‌های فروشگاه هم بخشی از همین دنیا هستند؛ دنیایی که قرار نیست شبیه همه باشد.</p><Link to="/about" className="nox-editorial-link">داستان ناکس <ArrowUpLeft size={18}/></Link></div>
 <div className="nox-identity__art-stage">
 <span className="nox-identity__latin" dir="ltr" aria-hidden="true">NOT A<br/>STANDARD.</span>
 <div className="nox-identity__doll"><NoxAutoModel modelUrl="/__l5e/assets-v1/f6fd597a-2a5f-4ac4-91a7-21b148878e5a/nox-doll.glb" name="کلهٔ سه‌بعدی نقاشی‌شدهٔ ناکس" interactive /></div>
 {gallery.slice(0,4).map((url,i)=><figure className="nox-picture-frame nox-orbit-frame" data-slot={i} key={url}><img src={url} alt={names[i]} width={640} height={640} loading="lazy" decoding="async"/></figure>)}
 </div></div>
 </Shell></section>;
}

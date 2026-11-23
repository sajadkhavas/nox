import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import heroPhoto from "@/assets/imported/nox-hero-retouched.webp.asset.json";
import { NoxHeroCalligraphy } from "./NoxHeroCalligraphy";
import { NoxHeroTicker } from "./NoxHeroTicker";
import type { StorefrontCategoryDto } from "@/lib/final-technical-api";

type HeroProduct = { slug: string; name: string; priceToman: number | null; image: string | null };
export function HeroNarrative(_props: {
  heroProduct?: HeroProduct | null; heroProducts?: HeroProduct[]; liveCategories?: StorefrontCategoryDto[] | null;
}) {
  return <>
    <section className="nox-hero" aria-labelledby="home-hero-title" dir="ltr">
      <div className="nox-hero__bleed-tl" aria-hidden="true" />
      <div className="nox-hero__bleed-br" aria-hidden="true" />
      <NoxHeroCalligraphy />
      <img className="nox-hero__image" src={heroPhoto.url} alt="ویترین فروشگاه NOX با کاپشن‌های چرم، ماسک‌ها و پوشاک استریت‌ویر" width={1174} height={1339} fetchPriority="high" loading="eager" decoding="async" />
      <div className="nox-hero__image-mask" aria-hidden="true" />
      <div className="nox-hero__content">
        <div className="nox-hero__eyebrow">New Collection 2024</div>
        <h1 id="home-hero-title" className="nox-hero__title"><span className="nox-text-motion">Where<br /><span className="nox-hero__accent">Darkness</span>Wears</span></h1>
        <p className="nox-hero__tagline">Streetwear forged in shadow. Every piece a ritual. Every cut a mark.</p>
        <div className="nox-hero__actions">
          <Button variant="hero" asChild className="nox-hero__button"><Link to="/shop">Shop the Drop</Link></Button>
          <Button variant="heroOutline" asChild className="nox-hero__button"><Link to="/lookbook">Lookbook</Link></Button>
        </div>
      </div>
      <div className="nox-hero__scroll" aria-hidden="true"><span>Scroll</span><i /></div>
    </section>
    <NoxHeroTicker />
    <div className="nox-hero__divider" aria-hidden="true" />
  </>;
}

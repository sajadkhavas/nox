import { useNoxVisuals } from "@/lib/nox-visuals";
import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import wallArt from "@/assets/imported/public/brand/nox-wall-art.webp.asset.json";
import { NoxMotif } from "@/components/lbb/NoxMotif";
import { NoxPortraitGallery } from "./NoxPortraitGallery";
import { NoxAutoModel } from "./NoxAutoModel";
import statueLite from "@/assets/imported/nox-statue-lite.glb.asset.json";
import catTshirts from "@/assets/imported/nox-cat-tshirts.webp.asset.json";
import catHoodies from "@/assets/imported/nox-cat-hoodies.webp.asset.json";
import catPants from "@/assets/imported/nox-cat-pants.webp.asset.json";
import catJorts from "@/assets/imported/nox-cat-jorts.webp.asset.json";
import catJackets from "@/assets/imported/nox-cat-jackets.webp.asset.json";
import catMasks from "@/assets/imported/nox-cat-face-masks.webp.asset.json";

const STATUE_FULL_URL = "/__l5e/assets-v1/0509a481-b782-4b15-abc6-e9054533fd42/nox-statue.glb";
import { ArrowUpLeft, LayoutGrid } from "lucide-react";
import { CategoryIcon } from "@/components/lbb/BrandIcon";
import { MerchantNavigationLink } from "@/components/lbb/navigation/MerchantNavigationLink";
import { SectionHead, Shell } from "@/components/lbb/ui/primitives";
import { noxCategoryCover } from "@/lib/nox-category-covers";
import { ImageReveal } from "@/components/lbb/ImageReveal";
import { CATEGORIES } from "@/lib/categories";
import { ACTIVE_HOME_CATEGORY_ORDER } from "@/lib/homepage";
import { fmtNum, productsByCategory } from "@/lib/products";
import type { CategorySlug } from "@/lib/products";
import type { StorefrontCategoryDto } from "@/lib/final-technical-api";
import { useStorefrontControl } from "@/lib/storefront-control";
import { useStorefrontPresentation } from "@/lib/storefront-presentation";

export function LegacyCategoryGateway({
  liveCategories,
}: {
  liveCategories?: StorefrontCategoryDto[] | null;
}) {
  const { source, home, sectionCopy } = useStorefrontControl();
  const presentation = useStorefrontPresentation();
  if (source === "live") {
    const copy = sectionCopy.categories;
    const order = new Map(home.categoryOrder.map((slug, index) => [slug, index]));
    const categories = [...(liveCategories ?? [])]
      .filter((category) => category.showOnHome === true)
      .sort((left, right) => {
        const leftOrder = order.get(left.slug) ?? Number.MAX_SAFE_INTEGER;
        const rightOrder = order.get(right.slug) ?? Number.MAX_SAFE_INTEGER;
        return leftOrder - rightOrder || left.name.localeCompare(right.name, "fa");
      });

    return (
      <section
        id="home-categories"
        dir="rtl"
        aria-labelledby="home-categories-title"
        className="border-t border-hairline bg-obsidian py-12 md:py-16"
      >
        <Shell>
          <SectionHead
            index="01"
            label={copy.label}
            title={<span id="home-categories-title">{copy.title}</span>}
            lede={copy.lede}
            action={
              <MerchantNavigationLink
                item={{
                  label: copy.actionLabel,
                  latin: "SHOP",
                  href: presentation.sectionLinks.categories,
                }}
                className="tech inline-flex min-h-11 items-center gap-2 text-signal"
              >
                {copy.actionLabel}
                <ArrowUpLeft size={15} aria-hidden="true" />
              </MerchantNavigationLink>
            }
          />

          {categories.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-hairline bg-carbon p-6 text-sm leading-7 text-metal">
              دسته‌بندی‌های فروشگاه به‌زودی در این بخش نمایش داده می‌شوند.
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
              {categories.map((category, index) => {
                const cover = category.image || noxCategoryCover(category.slug);
                return (
                  <Link
                    key={category.publicId}
                    to="/$category"
                    params={{ category: category.slug }}
                    aria-label={`مشاهده ${category.name}${typeof category.productCount === "number" ? ` — ${fmtNum(category.productCount)} محصول` : ""}`}
                    className="group flex min-w-0 flex-col overflow-hidden border border-hairline bg-carbon text-bone transition-colors hover:border-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                  >
                    <div className="flex aspect-square items-center justify-center overflow-hidden">
                      {cover ? (
                        <ImageReveal className="size-full" order={index}><img
                          src={cover}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="size-full object-cover"
                        /></ImageReveal>
                      ) : category.icon ? (
                        <img
                          src={category.icon}
                          alt=""
                          loading="lazy"
                          className="size-9 object-contain"
                        />
                      ) : (
                        <LayoutGrid className="size-9 text-signal" aria-hidden="true" />
                      )}
                    </div>
                    <span className="flex min-h-12 items-center justify-between gap-2 p-3 text-sm font-bold">
                      {category.name}
                      <ArrowUpLeft size={15} aria-hidden="true" />
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </Shell>
      </section>
    );
  }

  return <NoxCategoryStage />;
}


// Use the approved statue layout in both preview and live commerce mode.
export function CategoryGateway({ liveCategories }: { liveCategories?: StorefrontCategoryDto[] | null }) {
  return <NoxCategoryStage liveCategories={liveCategories} />;
}

const NOX_CATEGORY_CARDS = [
  { slug: "tshirts", image: catTshirts.url, name: "تیشرت", latin: "T-SHIRTS" },
  { slug: "hoodies", image: catHoodies.url, name: "هودی و دورس", latin: "HOODIES" },
  { slug: "pants", image: catPants.url, name: "شلوار", latin: "BAGGY / DENIM" },
  { slug: "jorts", image: catJorts.url, name: "جورتس", latin: "JORTS" },
  { slug: "jackets", image: catJackets.url, name: "کت", latin: "JACKETS" },
  { slug: "face-masks", image: catMasks.url, name: "فیس ماسک", latin: "FACE MASKS" },
] as const;

type CategoryStageCard = { slug: string; image: string; name: string; latin: string };

function NoxCategoryCard({ card, index, side }: { card: CategoryStageCard; index: number; side: "start" | "end" }) {
  return (
    <Link to="/$category" params={{ category: card.slug }} className="nox-cat-card" data-side={side} aria-label={`مشاهده ${card.name}`}>
      <span className="nox-cat-card__corner" data-corner="tl" /><span className="nox-cat-card__corner" data-corner="tr" />
      <span className="nox-cat-card__corner" data-corner="bl" /><span className="nox-cat-card__corner" data-corner="br" />
      <span className="nox-cat-card__img"><img src={card.image} alt={card.name} width={960} height={1280} loading="lazy" decoding="async" /></span>
      <span className="nox-cat-card__info">
        <span className="nox-cat-card__num" dir="ltr">0{index + 1}</span>
        <span className="nox-cat-card__name">{card.name}</span>
        <span className="nox-cat-card__sub" dir="ltr">{card.latin}</span>
        <span className="nox-cat-card__arrow">مشاهده همه <ArrowUpLeft size={13} aria-hidden="true" /></span>
      </span>
    </Link>
  );
}

function NoxCategoryStage({ liveCategories }: { liveCategories?: StorefrontCategoryDto[] | null } = {}) {
  const visuals = useNoxVisuals();
  const cards: CategoryStageCard[] = NOX_CATEGORY_CARDS.map((card) => {
    const aliases = card.slug === "hoodies" ? ["sweatshirts", "hoodies"] : [card.slug];
    const live = liveCategories?.find((category) => aliases.includes(category.slug));
    return live ? { ...card, slug: live.slug, name: live.name, image: live.image || visuals.categories?.[live.slug] || card.image } : { ...card, image: visuals.categories?.[card.slug === "hoodies" ? "sweatshirts" : card.slug] || card.image };
  });
  for (const category of liveCategories ?? []) {
    if (category.showOnHome && !category.parentPublicId && !cards.some((card) => card.slug === category.slug)) {
      cards.push({ slug: category.slug, name: category.name, image: category.image || noxCategoryCover(category.slug) || catPants.url, latin: category.slug });
    }
  }
  const split = Math.ceil(cards.length / 2);
  const rail = useRef<HTMLDivElement>(null);
  const scroll = (direction: 1 | -1) => {
    const node = rail.current;
    if (!node) return;
    node.scrollBy({ left: direction * node.clientWidth * 0.7, behavior: "smooth" });
  };
  return (
    <><section id="home-categories" dir="rtl" aria-labelledby="home-categories-title" className="nox-cat-section">
      <NoxSideLine side="start" />
      <NoxSideLine side="end" />
      <div className="nox-cat-head">
        <p className="nox-cat-head__label" dir="ltr">01 / NOX Category <span dir="rtl">دسته‌بندی‌های ناکس</span></p>
        <h2 id="home-categories-title" className="nox-cat-head__title">استایل تو، از اینجا شروع می‌شود</h2>
        <Link to="/shop" className="nox-cat-head__all">همه محصولات <ArrowUpLeft size={14} aria-hidden="true" /></Link>
      </div>
      <p className="nox-cat-intro">در ناکس، تیشرت گرافیکی، شلوار بگ، جورتس، هودی و کت را برای کنار هم ساختن استایل تو جمع کرده‌ایم.</p>
      <div className="nox-cat-layout">
        <div className="nox-cat-column" data-column="start">
          {cards.slice(0, split).map((card, index) => <NoxCategoryCard key={card.slug} card={card} index={index} side="start" />)}
        </div>
        <div className="nox-cat-statue">
          <div className="nox-cat-statue__wrap">
            <span className="nox-cat-statue__aura" aria-hidden="true" />
            <NoxAutoModel modelUrl={statueLite.url} detailUrl={STATUE_FULL_URL} name="مجسمه نوکس" interactive />
          </div>
          <img className="nox-cat-painting" src={visuals.painting ?? wallArt.url} alt="نقاشی دست‌ساز ناکس با نقش‌های رنگی و حلقهٔ فیروزه‌ای" width={600} height={600} loading="lazy" decoding="async" />
        </div>
        <div className="nox-cat-column" data-column="end">
          {cards.slice(split).map((card, index) => <NoxCategoryCard key={card.slug} card={card} index={index + split} side="end" />)}
        </div>
        <div className="nox-cat-rail-wrap">
          <div ref={rail} className="nox-cat-rail">
            {cards.map((card, index) => (
              <Link key={card.slug} to="/$category" params={{ category: card.slug }} className="nox-cat-chip" aria-label={`مشاهده ${card.name}`}>
                <span className="nox-cat-chip__img"><img src={card.image} alt="" width={960} height={1280} loading="lazy" decoding="async" /></span>
                <span className="nox-cat-chip__num" dir="ltr">0{index + 1}</span>
                <span className="nox-cat-chip__name">{card.name}</span>
              </Link>
            ))}
          </div>
          <div className="nox-cat-rail__controls">
            <button type="button" className="nox-cat-arrow" aria-label="دسته‌های قبلی" onClick={() => scroll(1)}>→</button>
            <button type="button" className="nox-cat-arrow" aria-label="دسته‌های بعدی" onClick={() => scroll(-1)}>←</button>
          </div>
        </div>
      </div>
    </section><NoxPortraitGallery /></>
  );
}

function NoxSideLine({ side }: { side: "start" | "end" }) {
 return <div className="nox-cat-sideline" data-side={side}><NoxMotif dense /></div>;
}

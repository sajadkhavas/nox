import { Link } from "@tanstack/react-router";
import { NoxProductCarousel } from "./NoxProductCarousel";
import { MerchantNavigationLink } from "@/components/lbb/navigation/MerchantNavigationLink";
import { SectionHead, Shell, StatePanel } from "@/components/lbb/ui/primitives";
import type { BackendCatalogCard } from "@/lib/backend-storefront";
import { products } from "@/lib/products";
import { useStorefrontControl } from "@/lib/storefront-control";
import { useStorefrontPresentation } from "@/lib/storefront-presentation";
import { ArrowUpLeft } from "lucide-react";

export function ProductMoments({ liveProducts }: { liveProducts?: BackendCatalogCard[] | null }) {
  const { source, sectionCopy } = useStorefrontControl();
  const presentation = useStorefrontPresentation();

  if (source === "live") {
    const items = liveProducts ?? [];
    const copy = sectionCopy.products;
    return (
      <section
        dir="rtl"
        aria-labelledby="home-products-title"
        className="border-t border-hairline bg-obsidian py-12 md:py-16"
      >
        <Shell>
          <SectionHead
            index="02"
            label={copy.label}
            title={<span id="home-products-title">{copy.title}</span>}
            lede={copy.lede}
            action={
              <MerchantNavigationLink
                item={{
                  label: copy.actionLabel,
                  latin: "CATALOG",
                  href: presentation.sectionLinks.products,
                }}
                className="tech inline-flex min-h-11 items-center gap-2 text-signal"
              >
                {copy.actionLabel}
                <ArrowUpLeft size={15} aria-hidden="true" />
              </MerchantNavigationLink>
            }
          />

          <NoxProductCarousel products={items} />
          {items.length === 0 ? (
            <StatePanel className="mt-8" title="هنوز محصول واقعی برای این بخش منتشر نشده است">
              با اضافه‌شدن محصولات منتخب، تازه‌ترین پیشنهادهای فروشگاه در این بخش نمایش داده
              می‌شوند.
            </StatePanel>
          ) : null}
        </Shell>
      </section>
    );
  }

  const currentSlugs = [
    "lbb-signature-tee",
    "denim-baggy-jean",
    "oversized-black-hoodie",
    "cargo-street-pants",
    "lbb-classic-hoodie",
    "graphic-tee-red",
  ];
  const curated = currentSlugs.flatMap((slug) =>
    products.filter((product) => product.slug === slug),
  );

  return (
    <section
      dir="rtl"
      aria-labelledby="home-products-title"
      className="border-t border-hairline bg-obsidian py-12 md:py-16"
    >
      <Shell>
        <SectionHead
          index="02"
          label="انتخاب‌های نوکس"
          title={<span id="home-products-title">فرم، فراتر از قالب.</span>}
          lede="انتخاب‌های استریت‌ویر · محصولات این پیش‌نمایش آزمایشی هستند."
          action={
            <Link to="/shop" className="tech inline-flex min-h-11 items-center gap-2 text-signal">
              کاتالوگ کامل
              <ArrowUpLeft size={15} aria-hidden="true" />
            </Link>
          }
        />

        <NoxProductCarousel products={curated} />
      </Shell>
    </section>
  );
}

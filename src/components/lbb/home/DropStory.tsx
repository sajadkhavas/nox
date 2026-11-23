import { NoxAutoModel } from "./NoxAutoModel";
import { NoxMotif } from "@/components/lbb/NoxMotif";
import { BRAND } from "@/lib/brand";
import { CompactCollectionStory } from "./CompactCollectionStory";
import { Link } from "@tanstack/react-router";
import { ArrowUpLeft } from "lucide-react";
import { CtaClasses, Shell, TechLabel } from "@/components/lbb/ui/primitives";
import type { CollectionDto } from "@/lib/backend-api";
import type { BackendCatalogCard } from "@/lib/backend-storefront";
import { getCollectionEditorialViewBySlug } from "@/lib/editorial-commerce";
import { productImage } from "@/lib/product-images";
import { useStorefrontControl } from "@/lib/storefront-control";

type ManagedCollectionDto = CollectionDto & { coverImage?: string | null };

export type LiveFeaturedStory = {
  collection: CollectionDto;
  products: BackendCatalogCard[];
};

export function DropStory({ liveStory }: { liveStory?: LiveFeaturedStory | null }) {
  const { source, featuredStory } = useStorefrontControl();

  if (source === "live") {
    if (!featuredStory.enabled || !liveStory) return null;

    const { collection, products } = liveStory;
    const collectionCover = (collection as ManagedCollectionDto).coverImage ?? null;
    const heroImage =
      collectionCover ?? products.find((product) => product.primaryImage)?.primaryImage ?? null;

    return (
      <CompactCollectionStory
        collection={collection}
        products={products}
        heroImage={heroImage}
        eyebrow={featuredStory.eyebrow}
        cta={featuredStory.collectionCta}
      />
    );
  }

  return <section className="nox-brand-story" aria-labelledby="drop-story-title">
    <div className="lbb-shell nox-brand-story__grid">
      <div className="nox-brand-story__text">
        <TechLabel>02 / THE NOX IDENTITY</TechLabel>
        <h2 id="drop-story-title">از خیابان.<br />برای خودت.</h2>
        <p>{BRAND.shortIntroduction}</p>
        <Link to="/about" className={CtaClasses("line", "lg")}>داستان NOX <ArrowUpLeft size={18} /></Link>
      </div>
      <div className="nox-brand-story__art">
        <span className="nox-brand-story__latin" dir="ltr" aria-hidden="true">NOT A<br />STANDARD.</span>
        <div className="nox-doll-stage"><NoxAutoModel modelUrl="/__l5e/assets-v1/f6fd597a-2a5f-4ac4-91a7-21b148878e5a/nox-doll.glb" name="سر عروسک نوکس" /></div>
      </div>
    </div>
    <div className="nox-brand-story__rule"><NoxMotif dense /></div>
  </section>;
}

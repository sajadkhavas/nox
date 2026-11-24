import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpLeft, RefreshCcw } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { ManagedPageHead } from "@/components/lbb/ManagedPageIntro";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { EmptyState, CtaClasses, Shell } from "@/components/lbb/ui/primitives";
import { COLLECTIONS } from "@/lib/collections";
import { getCollectionEditorialView } from "@/lib/editorial-commerce";
import { pageMeta, canonical, breadcrumbLd } from "@/lib/site";
import {
  backendErrorMessage,
  isLiveBackend,
  listCollections,
  type CollectionDto,
} from "@/lib/backend-api";
import { useStorefrontPresentation } from "@/lib/storefront-presentation";
import { resolveNoxVisuals, type NoxVisuals } from "@/lib/nox-visuals";
import { noxCategoryCover } from "@/lib/nox-category-covers";

type Editorial = {
  slug: string;
  name: string;
  latin?: string;
  summary: string;
  cover: string;
  tags: string[];
  count?: number;
};
type LoaderData = {
  mode: "live" | "prototype";
  collections: CollectionDto[];
  error: string | null;
  visuals: NoxVisuals;
};
export const Route = createFileRoute("/collections/")({
  loader: async (): Promise<LoaderData> => {
    const visualsPromise = resolveNoxVisuals();
    if (!isLiveBackend())
      return { mode: "prototype", collections: [], error: null, visuals: await visualsPromise };
    try {
      const response = await listCollections();
      return {
        mode: "live",
        collections: response.data,
        error: null,
        visuals: await visualsPromise,
      };
    } catch (error) {
      return {
        mode: "live",
        collections: [],
        error: backendErrorMessage(error),
        visuals: await visualsPromise,
      };
    }
  },
  head: () => ({
    meta: isLiveBackend()
      ? []
      : pageMeta({
          title: "کالکشن‌های پوشاک ناکس | NOX Collection",
          description:
            "کالکشن‌های استریت‌ویر ناکس؛ پوشاک گرافیکی، برش‌های آزاد و انتخاب‌های ما برای استایل شما.",
          path: "/collections",
        }),
    links: canonical("/collections"),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbLd([
            { name: "خانه", path: "/" },
            { name: "کالکشن‌ها", path: "/collections" },
          ]),
        ),
      },
    ],
  }),
  component: CollectionsIndexPage,
});
function CollectionsIndexPage() {
  const loader = Route.useLoaderData();
  const presentation = useStorefrontPresentation().pages.collections;
  const [filter, setFilter] = useState("all");
  const covers = [
    loader.visuals.categories?.sweatshirts || noxCategoryCover("sweatshirts")!,
    loader.visuals.categories?.tshirts || noxCategoryCover("tshirts")!,
    loader.visuals.categories?.pants || noxCategoryCover("denim")!,
  ];
  const entries: Editorial[] =
    loader.mode === "live"
      ? loader.collections.map((item, index) => ({
          slug: item.slug,
          name: item.name,
          summary:
            item.seo.metaDescription ||
            item.description ||
            "انتخاب‌های ناکس برای استایلی با امضای خودت.",
          cover:
            (item as CollectionDto & { coverImage?: string }).coverImage ||
            item.seo.primaryImage ||
            covers[index % covers.length],
          tags: [],
          count: item.productCount,
        }))
      : COLLECTIONS.map((item, index) => {
          const view = getCollectionEditorialView(item);
          return {
            slug: item.slug,
            name: item.nameFa,
            latin: item.latinName,
            summary: item.tagline,
            cover: covers[index % covers.length],
            tags: item.storyPoints,
            count: view.publicProducts.length || undefined,
          };
        });
  const lead = entries[0];
  const shown = filter === "all" ? entries : entries.filter((item) => item.slug === filter);
  return (
    <>
      <Navbar theme="dark" />
      <main className="nox-collections-page" dir="rtl" data-f17-route="collections">
        {loader.mode === "live" && (
          <ManagedPageHead presentation={presentation} path="/collections" />
        )}
        {loader.error ? (
          <Shell className="py-20">
            <EmptyState
              icon={<RefreshCcw size={32} />}
              title="کالکشن‌ها دریافت نشدند"
              body={loader.error}
              action={
                <button className={CtaClasses("signal")} onClick={() => window.location.reload()}>
                  تلاش دوباره
                </button>
              }
            />
          </Shell>
        ) : !lead ? (
          <Shell className="py-20">
            <EmptyState
              title="کالکشن تازه در راه است"
              body="انتخاب‌های منتشرشدهٔ ما را در فروشگاه ببینید."
              action={
                <Link to="/shop" className={CtaClasses("signal")}>
                  دیدن فروشگاه
                </Link>
              }
            />
          </Shell>
        ) : (
          <>
            <section className="nox-drop-hero" aria-labelledby="collection-hero-title">
              <div className="nox-drop-visual">
                <img
                  src={lead.cover}
                  alt={`پوشاک کالکشن ${lead.name}`}
                  fetchPriority="high"
                  width={1000}
                  height={1250}
                />
                <span className="nox-drop-pill">از انتخاب‌های ناکس</span>
                <span className="nox-drop-year" aria-hidden="true">
                  NOX
                </span>
              </div>
              <div className="nox-drop-info">
                <span className="nox-drop-season" dir="ltr">
                  NOX COLLECTION
                </span>
                <p className="nox-drop-eyebrow">پوشاک ما، بخشی از دنیای ماست.</p>
                <h1 id="collection-hero-title">{lead.name}</h1>
                {lead.latin && (
                  <span className="nox-collection-latin" dir="ltr">
                    {lead.latin}
                  </span>
                )}
                <p className="nox-drop-description">{lead.summary}</p>
                <div className="nox-drop-stats">
                  {typeof lead.count === "number" && (
                    <div>
                      <strong>{lead.count.toLocaleString("fa-IR")}</strong>
                      <span>محصول در کالکشن</span>
                    </div>
                  )}
                  <div>
                    <strong>ناکس</strong>
                    <span>استریت‌ویر با امضای خودت</span>
                  </div>
                </div>
                <div className="nox-drop-pieces">
                  {covers.map((cover, i) => (
                    <Link
                      key={cover}
                      to="/shop"
                      aria-label={["هودی و دورس", "تیشرت باکسی", "شلوار جین و بگ"][i]}
                    >
                      <img
                        src={cover}
                        alt={["هودی و دورس ناکس", "تیشرت باکسی ناکس", "شلوار جین و بگ ناکس"][i]}
                        width={300}
                        height={400}
                        loading="lazy"
                      />
                    </Link>
                  ))}
                </div>
                <div className="nox-drop-ctas">
                  <Link to="/collections/$slug" params={{ slug: lead.slug }}>
                    دیدن کالکشن <ArrowUpLeft size={17} />
                  </Link>
                  <Link to="/lookbook">لوک‌بوک ناکس</Link>
                </div>
              </div>
            </section>
            <section className="nox-collection-index" aria-labelledby="collections-title">
              <header>
                <div>
                  <p dir="ltr">Our collections</p>
                  <h2 id="collections-title">کالکشن‌های ناکس</h2>
                </div>
                <span>{entries.length.toLocaleString("fa-IR")} روایت از دنیای ما</span>
              </header>
              <div className="nox-collection-filter" aria-label="انتخاب کالکشن">
                <button
                  type="button"
                  aria-pressed={filter === "all"}
                  onClick={() => setFilter("all")}
                >
                  همه کالکشن‌ها
                </button>
                {entries.map((item) => (
                  <button
                    type="button"
                    key={item.slug}
                    aria-pressed={filter === item.slug}
                    onClick={() => setFilter(item.slug)}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
              <div className="nox-collection-rows">
                {shown.map((item) => (
                  <article key={item.slug} className="nox-collection-row">
                    <Link
                      className="nox-collection-photo"
                      to="/collections/$slug"
                      params={{ slug: item.slug }}
                    >
                      <img
                        src={item.cover}
                        alt={`استایل ${item.name}`}
                        loading="lazy"
                        width={900}
                        height={1100}
                      />
                    </Link>
                    <div className="nox-collection-copy">
                      <p className="nox-drop-eyebrow">از دنیای ناکس</p>
                      <h2>{item.name}</h2>
                      {item.latin && (
                        <p className="nox-collection-latin" dir="ltr">
                          {item.latin}
                        </p>
                      )}
                      <p className="nox-drop-description">{item.summary}</p>
                      {item.tags.length > 0 && (
                        <ul>
                          {item.tags.map((tag) => (
                            <li key={tag}>{tag}</li>
                          ))}
                        </ul>
                      )}
                      {typeof item.count === "number" && (
                        <p className="nox-collection-count">
                          {item.count.toLocaleString("fa-IR")} محصول
                        </p>
                      )}
                      <Link
                        to="/collections/$slug"
                        params={{ slug: item.slug }}
                        className="nox-collection-open"
                      >
                        ورود به کالکشن <ArrowUpLeft size={18} />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
      <Footer theme="dark" />
      <MobileBottomBar />
    </>
  );
}

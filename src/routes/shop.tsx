import { resolveNoxVisuals, NoxVisualsProvider } from "@/lib/nox-visuals";
import { NOX_CATEGORY_SLUGS, canonicalNoxCategorySlug } from "@/lib/nox-category-paths";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpLeft,
  PackageSearch,
  RefreshCcw,
  Search,
} from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { ManagedPageHead } from "@/components/lbb/ManagedPageIntro";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { ProductCard } from "@/components/lbb/ProductCard";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { ProductFilters } from "@/components/lbb/ProductFilters";
import { ProductGridControls } from "@/components/lbb/ProductGridControls";
import {
  Band,
  CtaClasses,
  EmptyState,
  GridSkeleton,
  Shell,
  TechLabel,
} from "@/components/lbb/ui/primitives";
import { products } from "@/lib/product-catalog";
import { evaluateProductEvidence } from "@/lib/product-evidence";
import { CATEGORIES } from "@/lib/categories";
import { noxCategoryCover } from "@/lib/nox-category-covers";
import { homeCategoryImage } from "@/lib/home-category-images";
import { ACTIVE_HOME_CATEGORY_ORDER } from "@/lib/homepage";
import {
  catalogueInventorySummary,
  countDiscoveryResults,
  createDiscoveryScope,
  createFacetCounts,
} from "@/lib/catalog-discovery";
import { absUrl, breadcrumbLd, canonical, pageMeta } from "@/lib/site";
import {
  applyFilters,
  hasSearchModifiers,
  isCanonicalSearch,
  normalizeBackendFilters,
  normalizeFilters,
  parseBackendFilterSearch,
  parseBackendFilters,
  parseFilterSearch,
  parseFilters,
  serializeBackendFilters,
  serializeFilters,
  stableSearchString,
  type Filters,
  type FilterScope,
} from "@/lib/product-filter";
import {
  backendErrorMessage,
  getCatalogFacets,
  isLiveBackend,
  listCategories,
  listProducts,
  type CategoryDto,
  type FacetsDto,
} from "@/lib/backend-api";
import {
  BACKEND_SUPPORTED_SORTS,
  backendCard,
  backendCatalogQuery,
  backendFacetVisuals,
  normalizeCatalogFilters,
  type BackendCatalogCard,
} from "@/lib/backend-storefront";
import { useStorefrontPresentation } from "@/lib/storefront-presentation";

const TITLE = "فروشگاه NOX | خرید پوشاک خیابانی و استریت‌ویر";
const DESC =
  "محصولات موجود NOX را با فیلترهای دسته، سایز، رنگ، قیمت و موجودی مرور کن و برای جزئیات هر مدل وارد صفحه همان محصول شو.";
const PAGE_SIZE = 12;
const BACKEND_PAGE_SIZE = 48;
const seasonalProducts = products;

function createItemListLd() {
  const publishedProducts = seasonalProducts.filter(
    (product) => evaluateProductEvidence(product).publishable,
  );
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "محصولات فروشگاه NOX",
    numberOfItems: publishedProducts.length,
    itemListElement: publishedProducts.slice(0, 20).map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absUrl(`/product/${product.slug}`),
      name: product.name,
    })),
  };
}

type LiveLoader = {
  mode: "live";
  products: BackendCatalogCard[];
  facets: FacetsDto | null;
  categories?: CategoryDto[];
  total: number;
  totalPages: number;
  filters: Filters;
  error: string | null;
};

type PrototypeLoader = { mode: "prototype" };
type ShopLoader = LiveLoader | PrototypeLoader;

export const Route = createFileRoute("/shop")({
  beforeLoad: async () => ({ noxVisuals: await resolveNoxVisuals() }),
  validateSearch: (search: Record<string, unknown>) =>
    isLiveBackend() ? parseBackendFilterSearch(search) : parseFilterSearch(search),
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ deps }): Promise<ShopLoader> => {
    if (!isLiveBackend()) return { mode: "prototype" };

    try {
      const [facetsResponse, categoryResponse] = await Promise.all([
        getCatalogFacets(),
        listCategories().catch(() => null),
      ]);
      const facets = facetsResponse.data;
      const visuals = backendFacetVisuals(facets);
      const scope: FilterScope = {
        categories: facets.categories.map((category) => category.slug),
        colors: visuals.colors,
        sizes: visuals.sizes,
        priceCeil: Math.max(1, visuals.priceCeil),
      };
      const filters = normalizeCatalogFilters(
        parseBackendFilters(deps.search as unknown as Record<string, unknown>),
        facets,
        scope,
      );
      try {
        const response = await listProducts({
          ...backendCatalogQuery(filters, facets),
          page: 1,
          per_page: BACKEND_PAGE_SIZE,
        });
        return {
          mode: "live",
          products: response.data.map(backendCard),
          facets,
          categories: categoryResponse?.data,
          total: response.meta.pagination?.total ?? response.data.length,
          totalPages: response.meta.pagination?.totalPages ?? 1,
          filters,
          error: null,
        };
      } catch (error) {
        return {
          mode: "live",
          products: [],
          facets,
          categories: categoryResponse?.data,
          total: 0,
          totalPages: 0,
          filters,
          error: backendErrorMessage(error),
        };
      }
    } catch (error) {
      return {
        mode: "live",
        products: [],
        facets: null,
        total: 0,
        totalPages: 0,
        filters: parseBackendFilters(deps.search as unknown as Record<string, unknown>),
        error: backendErrorMessage(error),
      };
    }
  },
  head: ({ match }) => {
    const filters = isLiveBackend()
      ? parseBackendFilters(match.search as unknown as Record<string, unknown>)
      : parseFilters(match.search as unknown as Record<string, unknown>);
    const scripts = [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbLd([
            { name: "خانه", path: "/" },
            { name: "فروشگاه", path: "/shop" },
          ]),
        ),
      },
    ];

    return {
      meta: isLiveBackend()
        ? hasSearchModifiers(filters)
          ? [{ name: "robots", content: "noindex, follow" }]
          : []
        : pageMeta({
            title: TITLE,
            description: DESC,
            path: "/shop",
            type: "website",
            robots: hasSearchModifiers(filters) ? "noindex, follow" : undefined,
          }),
      links: canonical("/shop"),
      scripts,
    };
  },
  component: ShopPage,
});

function ShopPage() {
  const loader = Route.useLoaderData();
  return loader.mode === "live" ? <LiveShop loader={loader} /> : <PrototypeShop />;
}

function LiveShop({ loader }: { loader: LiveLoader }) {
  const navigate = useNavigate({ from: "/shop" });
  const [isPending, startTransition] = useTransition();
  const [items, setItems] = useState(loader.products);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
  const facets = loader.facets;
  const visuals = facets ? backendFacetVisuals(facets) : { colors: [], sizes: [], priceCeil: 1 };
  const scope: FilterScope = useMemo(() => {
    if (!facets) return {};
    const options = backendFacetVisuals(facets);
    return {
      categories: facets.categories.map((category) => category.slug),
      colors: options.colors,
      sizes: options.sizes,
      priceCeil: Math.max(1, options.priceCeil),
    };
  }, [facets]);
  const appliedFilters = useMemo(
    () => normalizeBackendFilters(loader.filters, scope),
    [loader.filters, scope],
  );
  const [optimisticFilters, setOptimisticFilters] = useState(appliedFilters);
  const filters = normalizeBackendFilters(optimisticFilters, scope);
  const serialized = useMemo(
    () => serializeBackendFilters(appliedFilters, scope),
    [appliedFilters, scope],
  );
  const searchKey = stableSearchString(serialized);
  const requestKey = useRef(searchKey);

  useEffect(() => {
    requestKey.current = searchKey;
    setOptimisticFilters(appliedFilters);
    setItems(loader.products);
    setPage(1);
    setLoadingMore(false);
    setLoadMoreError(null);
  }, [loader.products, searchKey, appliedFilters]);

  useEffect(() => {
    if (typeof window === "undefined" || !facets || requestKey.current !== searchKey) return;
    if (!isCanonicalSearch(window.location.search, serialized)) {
      navigate({ search: serialized, replace: true, resetScroll: false });
    }
  }, [facets, navigate, searchKey, serialized]);

  const setFilters = (next: Filters) => {
    const normalized = normalizeBackendFilters(next, scope);
    setOptimisticFilters(normalized);
    requestKey.current = stableSearchString(serializeBackendFilters(normalized, scope));
    startTransition(() =>
      navigate({
        search: serializeBackendFilters(normalized, scope),
        replace: false,
        resetScroll: false,
      }),
    );
  };

  const categoryOptions = facets?.categories.map((category) => ({
    slug: category.slug,
    label: category.name,
    image: category.image,
  }));
  const categoryLabels = Object.fromEntries(
    (categoryOptions ?? []).map((category) => [category.slug, category.label]),
  );
  const colorLabels = Object.fromEntries(
    (facets?.colors ?? []).map((color) => [color.slug, color.name]),
  );
  const colorSwatches = Object.fromEntries(
    (facets?.colors ?? []).map((color) => [color.slug, color.hex]),
  );
  const renderFilters = (candidate: Filters, onChange: (next: Filters) => void) => (
    <ProductFilters
      filters={candidate}
      onChange={onChange}
      colors={visuals.colors}
      sizes={visuals.sizes}
      priceCeil={Math.max(1, visuals.priceCeil)}
      showCategory
      showSale={false}
      categoryOptions={categoryOptions}
      colorLabels={colorLabels}
      colorSwatches={colorSwatches}
    />
  );

  const getPreviewCount = useCallback(
    async (candidate: Filters) => {
      if (!facets) return 0;
      const response = await listProducts({
        ...backendCatalogQuery(candidate, facets),
        page: 1,
        per_page: 1,
      });
      return response.meta.pagination?.total ?? response.data.length;
    },
    [facets],
  );

  const loadMore = async () => {
    if (!facets || loadingMore || page >= loader.totalPages || requestKey.current !== searchKey)
      return;
    setLoadingMore(true);
    setLoadMoreError(null);
    try {
      const nextPage = page + 1;
      const response = await listProducts({
        ...backendCatalogQuery(filters, facets),
        page: nextPage,
        per_page: BACKEND_PAGE_SIZE,
      });
      if (requestKey.current !== searchKey) return;
      setItems((current) => {
        const seen = new Set(current.map((product) => product.id));
        return [
          ...current,
          ...response.data.map(backendCard).filter((product) => !seen.has(product.id)),
        ];
      });
      setPage(nextPage);
    } catch (error) {
      if (requestKey.current === searchKey) setLoadMoreError(backendErrorMessage(error));
    } finally {
      if (requestKey.current === searchKey) setLoadingMore(false);
    }
  };

  return (
    <ShopChrome
      categories={
        loader.categories?.map(({ slug, name, image }) => ({ slug, label: name, image })) ??
        categoryOptions ??
        []
      }
      status={
        loader.error
          ? "در حال حاضر دریافت اطلاعات فروشگاه امکان‌پذیر نیست. لطفاً کمی بعد دوباره تلاش کنید."
          : "قیمت، موجودی و گزینه‌های قابل انتخاب هر محصول به‌روز نمایش داده می‌شوند."
      }
    >
      <div className="nox-shop-layout grid grid-cols-1 gap-10 lg:grid-cols-[250px_1fr]">
        <aside className="hidden lg:block" aria-label="فیلتر محصولات">
          <div className="sticky top-[calc(var(--lbb-nav-h)+24px)] max-h-[calc(100dvh-var(--lbb-nav-h)-40px)] overflow-y-auto overscroll-contain pe-3">
            {facets ? renderFilters(filters, setFilters) : null}
          </div>
        </aside>

        <section aria-labelledby="shop-grid-title">
          <h2 id="shop-grid-title" className="sr-only">
            نتایج کاتالوگ NOX
          </h2>
          {facets ? (
            <ProductGridControls
              filters={filters}
              onChange={setFilters}
              resultCount={loader.total}
              filterSlot={renderFilters}
              getResultCount={() => loader.total}
              getPreviewCount={getPreviewCount}
              supportedSorts={BACKEND_SUPPORTED_SORTS}
              categoryLabels={categoryLabels}
              colorLabels={colorLabels}
            />
          ) : null}

          {loader.error ? (
            <EmptyState
              className="mt-6"
              icon={<RefreshCcw size={40} aria-hidden="true" />}
              title="کاتالوگ قابل تأیید نیست"
              body={loader.error}
              action={
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className={CtaClasses("signal")}
                >
                  تلاش دوباره
                </button>
              }
            />
          ) : isPending ? (
            <div className="mt-6" aria-busy="true" aria-label="در حال به‌روزرسانی محصولات">
              <GridSkeleton count={8} />
            </div>
          ) : loader.total === 0 ? (
            <EmptyState
              className="mt-6"
              icon={<PackageSearch size={40} aria-hidden="true" />}
              title="محصولی با این ترکیب فیلتر پیدا نشد"
              body="یکی از فیلترها را حذف کن یا کاتالوگ را به حالت پایه برگردان."
              action={
                <button
                  type="button"
                  onClick={() =>
                    setFilters({
                      ...filters,
                      cats: [],
                      colors: [],
                      sizes: [],
                      max: 0,
                      instock: false,
                    })
                  }
                  className={CtaClasses("signal")}
                >
                  بازگشت به همه قطعه‌ها
                </button>
              }
            />
          ) : (
            <>
              <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
                {items.map((product, index) => (
                  <ProductCard key={product.id} p={product} priority={index < 2} />
                ))}
              </div>
              {page < loader.totalPages ? (
                <div className="mt-10 flex flex-col items-center gap-3">
                  <button
                    type="button"
                    onClick={loadMore}
                    disabled={loadingMore}
                    className={CtaClasses("line")}
                  >
                    {loadingMore ? "در حال دریافت…" : "نمایش قطعه‌های بیشتر"}
                  </button>
                  {loadMoreError ? (
                    <p role="alert" className="text-xs text-signal">
                      {loadMoreError}
                    </p>
                  ) : null}
                </div>
              ) : (
                <p className="tech mt-10 text-center text-mute">همه نتایج نمایش داده شدند</p>
              )}
            </>
          )}
        </section>
      </div>
    </ShopChrome>
  );
}

function PrototypeShop() {
  const routeFilters = Route.useSearch();
  const filterScope = useMemo(() => createDiscoveryScope(seasonalProducts, true), []);
  const inventory = useMemo(() => catalogueInventorySummary(seasonalProducts), []);
  const filters = useMemo(
    () =>
      normalizeFilters(
        parseFilters(routeFilters as unknown as Record<string, unknown>),
        filterScope,
      ),
    [filterScope, routeFilters],
  );
  const navigate = useNavigate({ from: "/shop" });
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [isPending, startTransition] = useTransition();
  const searchKey = stableSearchString(serializeFilters(filters));

  useEffect(() => setVisible(PAGE_SIZE), [searchKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const expected = serializeFilters(filters);
    if (!isCanonicalSearch(window.location.search, expected)) {
      navigate({ search: expected, replace: true, resetScroll: false });
    }
  }, [filters, navigate]);

  const setFilters = (nextFilters: Filters) => {
    const normalized = normalizeFilters(nextFilters, filterScope);
    startTransition(() =>
      navigate({ search: serializeFilters(normalized), replace: false, resetScroll: false }),
    );
  };

  const filtered = useMemo(() => applyFilters(seasonalProducts, filters), [filters]);
  const shown = filtered.slice(0, visible);
  const getResultCount = (candidate: Filters) =>
    countDiscoveryResults(seasonalProducts, candidate, filterScope);
  const renderFilters = (candidate: Filters, onChange: (next: Filters) => void) => (
    <ProductFilters
      filters={candidate}
      onChange={onChange}
      colors={filterScope.colors}
      sizes={filterScope.sizes}
      priceCeil={filterScope.priceCeil}
      showCategory
      facetCounts={createFacetCounts(seasonalProducts, candidate, filterScope)}
    />
  );
  const desktopFilters = renderFilters(filters, setFilters);

  return (
    <ShopChrome
      categories={ACTIVE_HOME_CATEGORY_ORDER.map((slug) => ({
        slug,
        label: CATEGORIES[slug].nameFa,
      }))}
      status={`${inventory.label} پرداخت و ارسال واقعی در این نسخه فعال نیست.`}
    >
      <div className="nox-shop-layout grid grid-cols-1 gap-10 lg:grid-cols-[250px_1fr]">
        <aside className="hidden lg:block" aria-label="فیلتر محصولات">
          <div className="sticky top-[calc(var(--lbb-nav-h)+24px)]">{desktopFilters}</div>
        </aside>

        <section aria-labelledby="shop-grid-title">
          <h2 id="shop-grid-title" className="sr-only">
            نتایج کاتالوگ NOX
          </h2>
          <ProductGridControls
            filters={filters}
            onChange={setFilters}
            resultCount={filtered.length}
            filterSlot={renderFilters}
            getResultCount={getResultCount}
          />

          {isPending ? (
            <div className="mt-6" aria-busy="true" aria-label="در حال به‌روزرسانی محصولات">
              <GridSkeleton count={8} />
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              className="mt-6"
              icon={<PackageSearch size={40} aria-hidden="true" />}
              title="محصولی با این ترکیب فیلتر پیدا نشد"
              body="یکی از فیلترها را حذف کن یا کاتالوگ را به حالت پایه برگردان."
              action={
                <button
                  type="button"
                  onClick={() =>
                    setFilters({
                      ...filters,
                      cats: [],
                      colors: [],
                      sizes: [],
                      max: 0,
                      instock: false,
                      sale: false,
                    })
                  }
                  className={CtaClasses("signal")}
                >
                  بازگشت به همه قطعه‌ها
                </button>
              }
            />
          ) : (
            <>
              <div
                className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4"
                aria-busy={isPending}
              >
                {shown.map((product, index) => (
                  <ProductCard key={product.id} p={product} priority={index < 2} />
                ))}
              </div>
              {visible < filtered.length ? (
                <div className="mt-10 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setVisible((value) => value + PAGE_SIZE)}
                    className={CtaClasses("line")}
                  >
                    نمایش قطعه‌های بیشتر
                  </button>
                </div>
              ) : (
                <p className="tech mt-10 text-center text-mute">همه نتایج نمایش داده شدند</p>
              )}
            </>
          )}
        </section>
      </div>
    </ShopChrome>
  );
}

function ShopChrome({
  categories,
  status,
  children,
}: {
  categories: readonly { slug: string; label: string; image?: string | null }[];
  status: string;
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const presentation = useStorefrontPresentation();
  const page = presentation.pages.shop;
  const visuals = Route.useRouteContext().noxVisuals;
  const shopImage =
    visuals.shop || (!isLiveBackend() ? "/brand/editorial/shop-front.webp" : undefined);
  const shopCategories = NOX_CATEGORY_SLUGS.flatMap((slug) => {
    const category = categories.find((item) => canonicalNoxCategorySlug(item.slug) === slug);
    return category
      ? [{ ...category, slug, label: visuals.catalog?.categories?.[slug]?.name || category.label }]
      : [];
  });
  const [query, setQuery] = useState("");
  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const q = query.trim();
    if (q) void navigate({ to: "/search", search: { q } });
  };

  return (
    <>
      {presentation.source === "live" ? <ManagedPageHead presentation={page} path="/shop" /> : null}
      <Navbar theme="dark" />
      <main
        dir="rtl"
        className="nox-shop-page min-h-screen bg-obsidian pb-bottombar pt-[var(--lbb-nav-h)] md:pb-0"
      >
        <Shell className="py-4">
          <Breadcrumb items={[{ label: "خانه", to: "/" }, { label: "فروشگاه" }]} />
        </Shell>
        <header className="nox-shop-editorial">
          <Shell>
            <div className="nox-shop-hero-grid">
              <div className="nox-shop-photo">
                {shopImage && (
                  <img
                    src={shopImage}
                    alt="نمای ورودی فروشگاه پوشاک ناکس با تابلو و مانکن‌های استریت‌ویر"
                    width={1086}
                    height={1448}
                    fetchPriority="high"
                    decoding="async"
                  />
                )}
              </div>
              <div className="nox-shop-intro">
                <span className="nox-shop-latin" dir="ltr">
                  The shop
                </span>
                <h1>{visuals.catalog?.shopTitle || "فروشگاه پوشاک استریت‌ویر ناکس"}</h1>
                <p>
                  {visuals.catalog?.shopIntro ||
                    "دستهٔ دلخواهت را انتخاب کن و محصولات منتشرشدهٔ ناکس را ببین."}
                </p>
                <form onSubmit={submitSearch} role="search" className="nox-shop-search">
                  <label htmlFor="shop-search" className="sr-only">
                    جست‌وجو در فروشگاه
                  </label>
                  <input
                    id="shop-search"
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="جست‌وجوی پوشاک…"
                  />
                  <button type="submit" disabled={!query.trim()} aria-label="جست‌وجو">
                    <Search size={18} />
                  </button>
                </form>
                <a href="#shop-results" className="nox-editorial-link">
                  دیدن محصولات <ArrowUpLeft size={17} />
                </a>
                <p className="nox-shop-summary">{status}</p>
              </div>
            </div>
          </Shell>
          <Shell className="nox-shop-categories">
            <div className="nox-shop-category-heading">
              <h2>از دنیای ناکس انتخاب کن</h2>
              <span dir="ltr">NOX Category</span>
            </div>
            <div className="nox-shop-category-rail">
              {shopCategories.map((category) => {
                const slug = canonicalNoxCategorySlug(category.slug);
                const cover =
                  visuals.categories?.[slug] ||
                  visuals.categories?.[slug === "hoodies" ? "sweatshirts" : slug] ||
                  category.image ||
                  (!isLiveBackend() ? noxCategoryCover(slug) : undefined);
                return (
                  <Link
                    key={slug}
                    to="/shop/$category"
                    params={{ category: slug }}
                    className="nox-shop-category-card"
                  >
                    {cover && (
                      <img
                        src={cover}
                        alt={`پوشاک ${category.label} ناکس`}
                        width={400}
                        height={500}
                        loading="lazy"
                      />
                    )}
                    <span>
                      {category.label}
                      <ArrowUpLeft size={18} />
                    </span>
                  </Link>
                );
              })}
            </div>
          </Shell>
        </header>
        <Band id="shop-results" hairline={false} className="scroll-mt-24 !py-0">
          <Shell>{children}</Shell>
        </Band>
      </main>
      <Footer theme="dark" />
      <MobileBottomBar />
    </>
  );
}

import { SHOP_NAVIGATION } from "@/lib/navigation";
import { NoxMotif } from "@/components/lbb/NoxMotif";
import { Link } from "@tanstack/react-router";
import { ArrowUpLeft, LockKeyhole } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  CATALOG_NAVIGATION,
  RETAINED_CURRENT_CATEGORY_NAVIGATION,
  catalogNavigationGroup,
  type CatalogTaxonomyNode,
} from "@/lib/catalog-taxonomy";
import { isLiveBackend } from "@/lib/backend-api";
import { listStorefrontCategories, type StorefrontCategoryDto } from "@/lib/final-technical-api";

function nodeLabels(nodes: readonly CatalogTaxonomyNode[] | undefined) {
  if (!nodes?.length) return [];

  return nodes.map((node) => {
    if (!node.children?.length) return node.label;

    return `${node.label}: ${node.children.map((child) => child.label).join("، ")}`;
  });
}

type LiveCategoryNode = StorefrontCategoryDto & { children: LiveCategoryNode[] };

let cachedCategories: StorefrontCategoryDto[] | null = null;
let categoryRequest: Promise<StorefrontCategoryDto[]> | null = null;
let categoryCachedAt = 0;

function loadCategories(): Promise<StorefrontCategoryDto[]> {
  if (cachedCategories && Date.now() - categoryCachedAt < 60_000) {
    return Promise.resolve(cachedCategories);
  }
  if (!categoryRequest) {
    categoryRequest = listStorefrontCategories()
      .then((items) => {
        cachedCategories = items;
        categoryCachedAt = Date.now();
        return items;
      })
      .finally(() => {
        categoryRequest = null;
      });
  }
  return categoryRequest;
}

function buildLiveTree(categories: StorefrontCategoryDto[]): LiveCategoryNode[] {
  const nodes = new Map<string, LiveCategoryNode>();
  for (const category of categories) {
    nodes.set(category.publicId, { ...category, children: [] });
  }

  const roots: LiveCategoryNode[] = [];
  for (const node of nodes.values()) {
    const parent = node.parentPublicId ? nodes.get(node.parentPublicId) : null;
    if (parent && parent.publicId !== node.publicId) parent.children.push(node);
    else roots.push(node);
  }

  const prune = (node: LiveCategoryNode): LiveCategoryNode | null => {
    const children = node.children
      .map(prune)
      .filter((value): value is LiveCategoryNode => value !== null);
    if (node.showInHeader !== true && children.length === 0) return null;
    return { ...node, children };
  };

  const sortNodes = (items: LiveCategoryNode[]): LiveCategoryNode[] =>
    [...items]
      .sort((a, b) => a.name.localeCompare(b.name, "fa"))
      .map((item) => ({ ...item, children: sortNodes(item.children) }));

  return sortNodes(roots.map(prune).filter((value): value is LiveCategoryNode => value !== null));
}

export function CatalogTaxonomyMenu({
  pathname = "",
  onNavigate,
  compact = false,
}: {
  pathname?: string;
  onNavigate?: () => void;
  compact?: boolean;
}) {
  const live = isLiveBackend();
  const [categories, setCategories] = useState<StorefrontCategoryDto[] | null>(cachedCategories);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!live) return;
    let cancelled = false;
    setFailed(false);
    void loadCategories()
      .then((items) => {
        if (!cancelled) setCategories(items);
      })
      .catch(() => {
        if (!cancelled) {
          setCategories([]);
          setFailed(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [live]);

  const liveTree = useMemo(() => buildLiveTree(categories ?? []), [categories]);

  if (live) {
    return (
      <LiveTaxonomy
        tree={liveTree}
        loading={categories === null}
        failed={failed}
        compact={compact}
        pathname={pathname}
        onNavigate={onNavigate}
      />
    );
  }

  return <PrototypeTaxonomy compact={compact} pathname={pathname} onNavigate={onNavigate} />;
}

function LiveTaxonomy({
  tree,
  loading,
  failed,
  compact,
  pathname,
  onNavigate,
}: {
  tree: LiveCategoryNode[];
  loading: boolean;
  failed: boolean;
  compact: boolean;
  pathname: string;
  onNavigate?: () => void;
}) {
  if (loading) {
    return (
      <div
        className="mt-3 rounded-2xl border border-hairline bg-carbon p-5 text-sm text-metal"
        role="status"
      >
        در حال دریافت دسته‌بندی‌های فروشگاه…
      </div>
    );
  }

  if (failed) {
    return (
      <div className="mt-3 rounded-2xl border border-hairline bg-carbon p-5 text-sm leading-7 text-metal">
        دسته‌بندی‌های زنده فعلاً قابل دریافت نیستند. برای جلوگیری از نمایش ساختار قدیمی، منوی نمونه
        جایگزین نمی‌شود.
      </div>
    );
  }

  if (tree.length === 0) {
    return (
      <div className="mt-3 rounded-2xl border border-hairline bg-carbon p-5 text-sm leading-7 text-metal">
        دسته‌بندی‌های فروشگاه به‌زودی در این منو نمایش داده می‌شوند.
      </div>
    );
  }

  return (
    <div className={compact ? "mt-3 grid gap-2" : "mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3"}>
      {tree.map((root, index) => {
        const active = pathname === `/${root.slug}`;
        return (
          <article
            key={root.publicId}
            className={`min-w-0 rounded-2xl border bg-carbon p-4 transition-colors ${
              active ? "border-signal" : "border-hairline hover:border-signal/60"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <Link
                to="/shop/$category"
                params={{ category: root.slug }}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className="group flex min-w-0 flex-1 items-start gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
              >
                {root.icon ? (
                  <img
                    src={root.icon}
                    alt=""
                    width={44}
                    height={44}
                    loading="lazy"
                    className="h-11 w-11 shrink-0 rounded-xl border border-hairline bg-white object-contain p-1.5"
                  />
                ) : (
                  <span className="num grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-hairline text-[10px] text-mute">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                )}
                <span className="min-w-0">
                  <span
                    className={`block text-base font-black transition-colors group-hover:text-signal ${active ? "text-signal" : "text-bone"}`}
                  >
                    {root.name}
                  </span>
                </span>
              </Link>
              <ArrowUpLeft size={15} className="mt-1 shrink-0 text-mute" aria-hidden="true" />
            </div>

            {root.children.length > 0 ? (
              <ul className="mt-4 grid gap-2 border-t border-hairline-soft pt-3">
                {root.children.map((child) => (
                  <li key={child.publicId}>
                    <Link
                      to="/shop/$category"
                      params={{ category: child.slug }}
                      onClick={onNavigate}
                      className={`flex min-h-10 items-center justify-between gap-3 rounded-lg px-2 text-xs font-bold transition-colors hover:bg-carbon-2 hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
                        pathname === `/${child.slug}` ? "text-signal" : "text-bone"
                      }`}
                    >
                      <span className="min-w-0 truncate">{child.name}</span>
                      {typeof child.productCount === "number" ? (
                        <span className="num shrink-0 text-[10px] text-mute">
                          {child.productCount.toLocaleString("fa-IR")}
                        </span>
                      ) : null}
                    </Link>
                    {child.children.length > 0 ? (
                      <div className="mt-1 flex flex-wrap gap-1.5 px-2">
                        {child.children.map((grandchild) => (
                          <Link
                            key={grandchild.publicId}
                            to="/shop/$category"
                            params={{ category: grandchild.slug }}
                            onClick={onNavigate}
                            className={`rounded-full border px-2.5 py-1 text-[10px] transition-colors hover:border-signal hover:text-signal ${
                              pathname === `/${grandchild.slug}`
                                ? "border-signal text-signal"
                                : "border-hairline-soft text-metal"
                            }`}
                          >
                            {grandchild.name}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

function PrototypeTaxonomy({
  pathname,
  onNavigate,
  compact,
}: {
  pathname: string;
  onNavigate?: () => void;
  compact: boolean;
}) {
  return (
    <div className={compact ? "nox-taxonomy nox-taxonomy--compact" : "nox-taxonomy"}>
      {SHOP_NAVIGATION.filter((item) => item.to === "/shop/$category").map((item, index) => {
        const slug = (item.params as { category: string }).category;
        return (
          <Link
            key={slug}
            to="/shop/$category"
            params={{ category: slug }}
            onClick={onNavigate}
            aria-current={pathname === `/${slug}` ? "page" : undefined}
            className="nox-taxonomy__link"
          >
            <span className="nox-taxonomy__number">0{index + 1}</span>
            <span>
              <strong>{item.label}</strong>
              <small dir="ltr">{item.latin}</small>
            </span>
            <ArrowUpLeft size={19} aria-hidden="true" />
          </Link>
        );
      })}
      <div className="nox-taxonomy__motif">
        <NoxMotif dense />
      </div>
    </div>
  );
}

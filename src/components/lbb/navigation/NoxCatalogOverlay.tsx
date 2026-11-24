import { Link } from "@tanstack/react-router";
import { ArrowUpLeft, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { useNavigationOverlay } from "@/lib/navigation-overlay";
import { useStorefrontControl } from "@/lib/storefront-control";
import { PERSONAL_NAVIGATION } from "@/lib/navigation";
import { NavigationLink } from "./NavigationLink";
import { MerchantNavigationLink } from "./MerchantNavigationLink";
import { isLiveBackend } from "@/lib/backend-api";
import { listStorefrontCategories } from "@/lib/final-technical-api";
import { Logo } from "@/components/lbb/Logo";

type MenuCategory = { slug: string; name: string };
const preview: MenuCategory[] = [
  { slug: "tshirts", name: "تیشرت" },
  { slug: "hoodies", name: "هودی" },
  { slug: "pants", name: "شلوار" },
  { slug: "jorts", name: "جورتس" },
  { slug: "jackets", name: "جکت" },
  { slug: "face-masks", name: "فیس ماسک" },
];
const groups = ["همه", "بالاتنه", "پایین‌تنه", "اکسسوری"];
const groupOf = (slug: string) =>
  /pants|denim|cotton|jorts/.test(slug) ? 2 : /mask|accessor|socks|shoes/.test(slug) ? 3 : 1;

export function NoxCatalogOverlay() {
  const { close, dismissForNavigation } = useNavigationOverlay();
  const { navigation, brand } = useStorefrontControl();
  const dialog = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState(0);
  const [categories, setCategories] = useState<MenuCategory[]>(isLiveBackend() ? [] : preview);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(isLiveBackend());
  useFocusTrap(true, dialog, close);
  useEffect(() => {
    if (!isLiveBackend()) return;
    let cancelled = false;
    listStorefrontCategories()
      .then((items) => {
        if (!cancelled) setCategories(items.filter((item) => item.showInHeader === true));
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);
  const shown = categories.filter((item) => tab === 0 || groupOf(item.slug) === tab);
  return (
    <div
      ref={dialog}
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="nox-menu-title"
      className="nox-catalog-overlay"
    >
      <header className="nox-catalog-top">
        <Link to="/" onClick={dismissForNavigation} className="nox-catalog-brand" data-autofocus>
          <Logo size={32} />
          <span dir="ltr">NOX COLLECTION</span>
        </Link>
        <span className="nox-catalog-meta" dir="ltr">
          NOX / CATALOG INDEX
        </span>
        <button type="button" onClick={close} aria-label="بستن منو" className="nox-catalog-close">
          <X size={20} />
        </button>
      </header>
      <div className="nox-catalog-body">
        <aside className="nox-catalog-aside">
          <nav aria-label="دنیای ناکس">
            <h2>دنیای ناکس</h2>
            {navigation.editorial.map((item) => (
              <MerchantNavigationLink
                key={`${item.href}-${item.label}`}
                item={item}
                onNavigate={dismissForNavigation}
                className="nox-catalog-editorial"
              >
                <strong>{item.label}</strong>
                {item.description && <small>{item.description}</small>}
              </MerchantNavigationLink>
            ))}
          </nav>
          <nav aria-label="حساب و راهنمای خرید">
            <h2>همراه شما</h2>
            {PERSONAL_NAVIGATION.map((item) => (
              <NavigationLink
                key={String(item.to)}
                item={item}
                onNavigate={dismissForNavigation}
                className="nox-catalog-personal"
              />
            ))}
            {navigation.service.map((item) => (
              <MerchantNavigationLink
                key={`${item.href}-${item.label}`}
                item={item}
                onNavigate={dismissForNavigation}
                className="nox-catalog-personal"
              />
            ))}
          </nav>
        </aside>
        <section className="nox-catalog-main">
          <div className="nox-catalog-heading">
            <div>
              <p>از دنیای ناکس انتخاب کن</p>
              <h2 id="nox-menu-title">
                استایل تو،
                <br />
                قواعد خودت.
              </h2>
            </div>
            <Link to="/shop" onClick={dismissForNavigation}>
              همه محصولات <ArrowUpLeft size={18} />
            </Link>
          </div>
          <div className="nox-catalog-tabs" aria-label="نوع پوشاک">
            {groups.map((group, i) => (
              <button type="button" key={group} aria-pressed={tab === i} onClick={() => setTab(i)}>
                {group}
              </button>
            ))}
          </div>
          <div className="nox-catalog-rows" aria-live="polite">
            {loading ? (
              <p className="nox-catalog-notice">در حال دریافت دسته‌ها…</p>
            ) : error ? (
              <p className="nox-catalog-notice">
                دسته‌ها دریافت نشدند.{" "}
                <Link to="/shop" onClick={dismissForNavigation}>
                  ورود به فروشگاه
                </Link>
              </p>
            ) : shown.length === 0 ? (
              <p className="nox-catalog-notice">در این بخش هنوز دسته‌ای منتشر نشده است.</p>
            ) : (
              shown.map((item) => (
                <Link
                  to="/shop/$category"
                  params={{ category: item.slug }}
                  key={item.slug}
                  onClick={dismissForNavigation}
                  className="nox-catalog-row"
                >
                  <span className="nox-catalog-number" dir="ltr">
                    {String(categories.indexOf(item) + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <strong>{item.name}</strong>
                    <small dir="ltr">{item.slug.replaceAll("-", " ")}</small>
                  </span>
                  <ArrowUpLeft size={25} />
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
      <footer className="nox-catalog-bottom">
        <a href={brand.instagramUrl} target="_blank" rel="noreferrer">
          اینستاگرام ناکس
        </a>
        <span dir="ltr">NOX COLLECTION · SINCE 2021</span>
        <Link to="/contact" onClick={dismissForNavigation}>
          ارتباط با ما
        </Link>
      </footer>
    </div>
  );
}

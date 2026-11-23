import type { LinkProps } from "@tanstack/react-router";

export type NavigationItem = {
  label: string;
  latin: string;
  description?: string;
  to: LinkProps["to"];
  params?: LinkProps["params"];
};

export const SHOP_NAVIGATION: NavigationItem[] = [
  {
    label: "همه محصولات",
    latin: "SHOP ALL",
    description: "مشاهده کامل کاتالوگ",
    to: "/shop",
  },
  {
    label: "تیشرت",
    latin: "T-SHIRTS",
    description: "اورسایز، باکس، یقه‌دار، آستین‌بلند و حلقه‌ای",
    to: "/$category",
    params: { category: "tshirts" },
  },
  {
    label: "هودی و دورس",
    latin: "SWEATSHIRTS",
    description: "در موجودی فعلی، هودی فعال است",
    to: "/$category",
    params: { category: "hoodies" },
  },
  {
    label: "شلوار",
    latin: "PANTS",
    description: "جین، بگ و کتان",
    to: "/$category",
    params: { category: "pants" },
  },
  { label: "جورتس", latin: "JORTS", to: "/$category", params: { category: "jorts" } },
  { label: "کت", latin: "JACKETS", to: "/$category", params: { category: "jackets" } },
  { label: "فیس ماسک", latin: "FACE MASKS", to: "/$category", params: { category: "face-masks" } },
];

export const EDITORIAL_NAVIGATION: NavigationItem[] = [
  {
    label: "کالکشن‌ها",
    latin: "COLLECTIONS",
    description: "دراپ‌ها و فصل‌های NOX",
    to: "/collections",
  },
  { label: "لوک‌بوک", latin: "LOOKBOOK", description: "استایل‌ها در بافت شهری", to: "/lookbook" },
  { label: "ژورنال", latin: "JOURNAL", description: "راهنما، فرهنگ و متریال", to: "/journal" },
];

export const SERVICE_NAVIGATION: NavigationItem[] = [
  { label: "راهنمای سایز", latin: "SIZE GUIDE", to: "/size-guide" },
  { label: "ارسال و مرجوعی", latin: "SHIPPING", to: "/shipping-returns" },
  { label: "پیگیری سفارش", latin: "TRACK ORDER", to: "/track-order" },
  { label: "سوالات متداول", latin: "FAQ", to: "/faq" },
  { label: "تماس", latin: "CONTACT", to: "/contact" },
];

export const BRAND_NAVIGATION: NavigationItem[] = [
  { label: "درباره NOX", latin: "ABOUT", to: "/about" },
  { label: "قوانین", latin: "TERMS", to: "/terms" },
  { label: "حریم خصوصی", latin: "PRIVACY", to: "/privacy" },
];

export const PERSONAL_NAVIGATION: NavigationItem[] = [
  { label: "حساب کاربری", latin: "ACCOUNT", to: "/account" },
  { label: "علاقه‌مندی‌ها", latin: "WISHLIST", to: "/wishlist" },
  { label: "سبد خرید", latin: "CART", to: "/cart" },
];

export function navigationHref(item: NavigationItem): string {
  if (item.to === "/$category") {
    const params = item.params as { category?: string } | undefined;
    return params?.category ? `/${params.category}` : "/shop";
  }
  return String(item.to);
}

export function isNavigationItemActive(pathname: string, item: NavigationItem): boolean {
  const href = navigationHref(item);
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

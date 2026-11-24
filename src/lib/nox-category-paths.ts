export const NOX_CATEGORY_SLUGS = [
  "tshirts",
  "hoodies",
  "pants",
  "jorts",
  "jackets",
  "face-masks",
] as const;
export function canonicalNoxCategorySlug(slug: string) {
  return slug === "sweatshirts"
    ? "hoodies"
    : ["denim", "cotton-pants", "shloar"].includes(slug)
      ? "pants"
      : slug;
}
export function noxCategoryPath(slug: string) {
  return `/shop/${canonicalNoxCategorySlug(slug)}`;
}
export function normalizeNoxCategoryHref(href: string) {
  const match = href.match(
    /^\/(?:shop\/)?(tshirts|hoodies|sweatshirts|pants|denim|cotton-pants|shloar|jorts|jackets|face-masks)\/?([?#].*)?$/,
  );
  return match ? noxCategoryPath(match[1]) + (match[2] ?? "") : href;
}

import hoodiesAsset from "@/assets/imported/src/assets/products/hoodie-classic.jpg.asset.json";
const hoodies = hoodiesAsset.url;
import pantsAsset from "@/assets/imported/src/assets/products/cargo-pants.jpg.asset.json";
const pants = pantsAsset.url;
import tshirtsAsset from "@/assets/imported/src/assets/products/signature-tee.jpg.asset.json";
const tshirts = tshirtsAsset.url;
import shoesAsset from "@/assets/imported/src/assets/products/urban-runner.jpg.asset.json";
const shoes = shoesAsset.url;
import socksAsset from "@/assets/imported/src/assets/products/lbb-socks.jpg.asset.json";
const socks = socksAsset.url;
import { noxCategoryCover } from "./nox-category-covers";
import type { CategorySlug } from "./products";

const IMAGES: Record<CategorySlug, string> = {
  jorts: noxCategoryCover("jorts") ?? "",
  jackets: noxCategoryCover("jackets") ?? "",
  "face-masks": noxCategoryCover("face-masks") ?? "",
  hoodies: noxCategoryCover("sweatshirts") ?? hoodies,
  pants: noxCategoryCover("denim") ?? pants,
  tshirts: noxCategoryCover("tshirts") ?? tshirts,
  shoes,
  socks,
};

/** Clean product-first cover shot for category discovery surfaces. */
export const categoryImage = (slug: CategorySlug) => IMAGES[slug] ?? hoodies;

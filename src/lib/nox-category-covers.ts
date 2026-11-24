import tshirts from "@/assets/imported/nox-cat-tshirts.webp.asset.json";
import sweatshirts from "@/assets/imported/nox-cat-hoodies.webp.asset.json";
import pants from "@/assets/imported/nox-cat-pants.webp.asset.json";
import jorts from "@/assets/imported/nox-cat-jorts.webp.asset.json";
import jackets from "@/assets/imported/nox-cat-jackets.webp.asset.json";
import masks from "@/assets/imported/nox-cat-face-masks.webp.asset.json";
const covers: Record<string, string> = {
  tshirts: tshirts.url,
  sweatshirts: sweatshirts.url,
  hoodies: sweatshirts.url,
  pants: pants.url,
  denim: pants.url,
  "cotton-pants": pants.url,
  jorts: jorts.url,
  jackets: jackets.url,
  "face-masks": masks.url,
};
export function noxCategoryCover(slug: string): string | undefined {
  return Object.hasOwn(covers, slug) ? covers[slug] : undefined;
}

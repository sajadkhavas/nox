import faceMaskConcept from "@/assets/imported/nox-face-mask-concept.asset.json";

const covers: Partial<Record<string, string>> = {
  // Owner-requested generated category artwork, not verified product photography.
  "face-masks": faceMaskConcept.url,
  denim: "/__l5e/assets-v1/4a27eaef-aee7-4a60-b200-3a4f1cd3fb95/denim.webp",
  "cotton-pants": "/__l5e/assets-v1/24b22707-5174-4cab-bae6-6efabb71c937/cotton-pants.webp",
  jorts: "/__l5e/assets-v1/5c550490-cf53-423d-8bcc-1884e1e46944/jorts.webp",
  tshirts: "/__l5e/assets-v1/8e769b41-decd-4682-9711-89d500f3d10d/tshirts.webp",
  sweatshirts: "/__l5e/assets-v1/22116885-3a83-4f40-9c0d-d9b99a9941f5/sweatshirts.webp",
  jackets: "/__l5e/assets-v1/b27a1392-2e60-4184-98f4-d56101a61853/jackets.webp",
};

export function noxCategoryCover(slug: string): string | undefined {
  return Object.hasOwn(covers, slug) ? covers[slug] : undefined;
}

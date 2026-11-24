import hoodieClassicAsset from "@/assets/imported/src/assets/products/hoodie-classic.jpg.asset.json";
const hoodieClassic = hoodieClassicAsset.url;
import cargoPantsAsset from "@/assets/imported/src/assets/products/cargo-pants.jpg.asset.json";
const cargoPants = cargoPantsAsset.url;
import signatureTeeAsset from "@/assets/imported/src/assets/products/signature-tee.jpg.asset.json";
const signatureTee = signatureTeeAsset.url;
import urbanRunnerAsset from "@/assets/imported/src/assets/products/urban-runner.jpg.asset.json";
const urbanRunner = urbanRunnerAsset.url;
import lbbSocksAsset from "@/assets/imported/src/assets/products/lbb-socks.jpg.asset.json";
const lbbSocks = lbbSocksAsset.url;
import oversizedBlackHoodieAsset from "@/assets/imported/src/assets/products/oversized-black-hoodie.jpg.asset.json";
const oversizedBlackHoodie = oversizedBlackHoodieAsset.url;
import denimBaggyAsset from "@/assets/imported/src/assets/products/denim-baggy.jpg.asset.json";
const denimBaggy = denimBaggyAsset.url;
import graphicTeeRedAsset from "@/assets/imported/src/assets/products/graphic-tee-red.jpg.asset.json";
const graphicTeeRed = graphicTeeRedAsset.url;
import lifestyle1Asset from "@/assets/imported/src/assets/editorial/lifestyle-1.jpg.asset.json";
const lifestyle1 = lifestyle1Asset.url;
import lifestyle2Asset from "@/assets/imported/src/assets/editorial/lifestyle-2.jpg.asset.json";
const lifestyle2 = lifestyle2Asset.url;
import heroMainAsset from "@/assets/imported/src/assets/editorial/generated/home-hero-v2.webp.asset.json";
const heroMain = heroMainAsset.url;
import dropShabgardAsset from "@/assets/imported/src/assets/editorial/generated/drop-shabgard-v2.webp.asset.json";
const dropShabgard = dropShabgardAsset.url;
import communityStudioAsset from "@/assets/imported/src/assets/editorial/generated/community-studio-v2.webp.asset.json";
const communityStudio = communityStudioAsset.url;

export { communityStudio, dropShabgard, lifestyle1, lifestyle2, heroMain };

const MAIN: Record<string, string> = {
  "lbb-classic-hoodie": hoodieClassic,
  "cargo-street-pants": cargoPants,
  "lbb-signature-tee": signatureTee,
  "urban-runner-sneaker": urbanRunner,
  "lbb-crew-socks": lbbSocks,
  "oversized-black-hoodie": oversizedBlackHoodie,
  "denim-baggy-jean": denimBaggy,
  "graphic-tee-red": graphicTeeRed,
};

/** Primary product shot for a slug (falls back to the classic hoodie). */
export const productImage = (slug: string) => MAIN[slug] ?? hoodieClassic;

/** Full gallery: primary shot + editorial context shots. */
export const productGallery = (slug: string) => [
  productImage(slug),
  lifestyle2,
  lifestyle1,
  heroMain,
];

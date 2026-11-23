import { describe, expect, it } from "vitest";
import { STORE_SETTINGS, getPublicEnamad } from "@/lib/store-settings";
import { CATEGORY_SLUGS } from "@/lib/categories";
import { products } from "@/lib/products";
import { canPurchaseVariant } from "@/lib/product-decision-policy";
import { evaluateProductEvidence } from "@/lib/product-evidence";

describe("NOX confirmed business boundaries", () => {
  it("keeps the confirmed hours without inventing Friday availability", () => {
    expect(STORE_SETTINGS.location.openingHours).toEqual(["شنبه تا چهارشنبه: ۱۱ تا ۲۰", "پنجشنبه: ۱۱ تا ۱۵", "جمعه: تعطیل"]);
  });
  it("does not assign an unconfirmed exchange deadline", () => {
    expect(STORE_SETTINGS.returns.returnWindowDays).toBeNull();
  });
  it("does not display an unverified trust badge", () => {
    expect(getPublicEnamad(STORE_SETTINGS, "footer")).toBeNull();
  });
  it("keeps shoes and socks out of the confirmed NOX categories", () => {
    expect(CATEGORY_SLUGS).toEqual(["pants", "jorts", "tshirts", "hoodies", "jackets", "face-masks"]);
    expect(products.some((product) => product.category === "shoes" || product.category === "socks")).toBe(false);
  });
  it("disables purchase of sold-out products", () => {
    expect(canPurchaseVariant({ commerceReady: true, productAvailability: "sold-out", variantAvailability: "available" })).toBe(false);
  });
  it("never marks prototype records as production-publishable", () => {
    expect(products.length).toBeGreaterThan(0);
    expect(products.every((product) => !evaluateProductEvidence(product).publishable)).toBe(true);
  });
});
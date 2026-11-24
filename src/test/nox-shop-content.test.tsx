import { describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { canonicalNoxCategorySlug, normalizeNoxCategoryHref } from "@/lib/nox-category-paths";
import { NoxVisualsProvider } from "@/lib/nox-visuals";
import { NoxCategoryGuide } from "@/components/lbb/NoxCategoryGuide";
vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children }: any) => <a href={to}>{children}</a>,
}));
describe("managed catalog content", () => {
  it("keeps a single canonical category path and retains filter parameters", () => {
    expect(normalizeNoxCategoryHref("/pants?size=L")).toBe("/shop/pants?size=L");
    expect(normalizeNoxCategoryHref("/shop/sweatshirts/")).toBe("/shop/hoodies");
    expect(canonicalNoxCategorySlug("denim")).toBe("pants");
    expect(normalizeNoxCategoryHref("/product/black-jean")).toBe("/product/black-jean");
  });
  it("renders backend-provided guide sections and a backend image without injecting HTML", () => {
    const html = renderToStaticMarkup(
      <NoxVisualsProvider
        value={{
          catalog: {
            categories: {
              pants: {
                slug: "pants",
                name: "شلوار",
                intro: "معرفی",
                title: "راهنمای شلوار",
                image: "http://127.0.0.1:8000/storage/pants.webp",
                sections: [{ heading: "اندازه", text: "<script>bad()</script> سایز را بررسی کن." }],
              },
            },
          },
        }}
      >
        <NoxCategoryGuide slug="denim" />
      </NoxVisualsProvider>,
    );
    expect(html).toContain("http://127.0.0.1:8000/storage/pants.webp");
    expect(html).toContain("راهنمای شلوار");
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>");
  });
});

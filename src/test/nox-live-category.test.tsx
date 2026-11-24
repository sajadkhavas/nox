import { describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import type { StorefrontCategoryDto } from "@/lib/final-technical-api";
vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, params, children, ...props }: any) => (
    <a href={to === "/shop/$category" ? `/shop/${params.category}` : to} {...props}>
      {children}
    </a>
  ),
}));
vi.mock("@/components/lbb/home/NoxAutoModel", () => ({
  NoxAutoModel: () => <div data-tested-statue />,
}));
import { CategoryGateway } from "@/components/lbb/home/CategoryGateway";
describe("approved category layout with live data", () => {
  it("retains the statue, desktop cards and mobile rail while using backend category slugs", () => {
    const categories = [
      {
        publicId: "hoodie-id",
        slug: "sweatshirts",
        name: "هودی و دورس",
        image: "/storage/hoodies.webp",
        showOnHome: true,
      },
    ] as StorefrontCategoryDto[];
    const html = renderToStaticMarkup(<CategoryGateway liveCategories={categories} />);
    expect(html).toContain("data-tested-statue");
    expect(html).toContain("nox-cat-rail");
    expect(html).toContain('href="/shop/sweatshirts"');
    expect(html).toContain("/storage/hoodies.webp");
    expect(html.match(/class="nox-cat-card"/g)).toHaveLength(6);
    expect(html.match(/class="nox-cat-chip"/g)).toHaveLength(6);
  });
  it("keeps all six approved categories before products are uploaded", () => {
    const html = renderToStaticMarkup(<CategoryGateway liveCategories={[]} />);
    expect(html).toContain("data-tested-statue");
    expect(html.match(/class="nox-cat-card"/g)).toHaveLength(6);
  });
});

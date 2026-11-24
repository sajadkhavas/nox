import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
const state = vi.hoisted(() => ({ live: false, close: vi.fn(), dismiss: vi.fn(), list: vi.fn() }));
vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, params, children, ...props }: any) => (
    <a href={to === "/$category" ? `/${params.category}` : to} {...props}>
      {children}
    </a>
  ),
}));
vi.mock("@/hooks/use-focus-trap", () => ({ useFocusTrap: vi.fn() }));
vi.mock("@/lib/navigation-overlay", () => ({
  useNavigationOverlay: () => ({ close: state.close, dismissForNavigation: state.dismiss }),
}));
vi.mock("@/lib/storefront-control", () => ({
  useStorefrontControl: () => ({
    navigation: { editorial: [], service: [] },
    brand: { instagramUrl: "https://instagram.com/nox" },
  }),
}));
vi.mock("@/lib/backend-api", () => ({ isLiveBackend: () => state.live }));
vi.mock("@/lib/final-technical-api", () => ({ listStorefrontCategories: state.list }));
vi.mock("@/components/lbb/navigation/NavigationLink", () => ({ NavigationLink: () => null }));
vi.mock("@/components/lbb/Logo", () => ({ Logo: () => null }));
import { NoxCatalogOverlay } from "@/components/lbb/navigation/NoxCatalogOverlay";
describe("NOX catalog menu", () => {
  beforeEach(() => {
    state.live = false;
    state.list.mockReset();
    state.close.mockReset();
    state.dismiss.mockReset();
  });
  it("filters categories without losing category destinations and closes when requested", () => {
    render(<NoxCatalogOverlay />);
    expect(screen.getByRole("link", { name: /شلوار جین و بگ/ })).toHaveAttribute("href", "/pants");
    fireEvent.click(screen.getByRole("button", { name: "پایین‌تنه" }));
    expect(screen.queryByRole("link", { name: /تیشرت باکسی/ })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /جورتس/ })).toHaveAttribute("href", "/jorts");
    fireEvent.click(screen.getByRole("button", { name: "بستن منو" }));
    expect(state.close).toHaveBeenCalledOnce();
  });
  it("uses backend slugs and does not substitute preview categories in live mode", async () => {
    state.live = true;
    state.list.mockResolvedValue([
      { slug: "owner-jackets", name: "کت سفارشی", showInHeader: true },
      { slug: "hidden", name: "پنهان", showInHeader: false },
    ]);
    render(<NoxCatalogOverlay />);
    await waitFor(() =>
      expect(screen.getByRole("link", { name: /کت سفارشی/ })).toHaveAttribute(
        "href",
        "/owner-jackets",
      ),
    );
    expect(screen.queryByText("پنهان")).not.toBeInTheDocument();
    expect(screen.queryByText("تیشرت باکسی")).not.toBeInTheDocument();
  });
});

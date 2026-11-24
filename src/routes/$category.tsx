import { createFileRoute, redirect } from "@tanstack/react-router";
import { canonicalNoxCategorySlug } from "@/lib/nox-category-paths";
export const Route = createFileRoute("/$category")({
  beforeLoad: ({ params, search }) => {
    throw redirect({
      to: "/shop/$category",
      params: { category: canonicalNoxCategorySlug(params.category) },
      search,
      statusCode: 301,
    });
  },
});

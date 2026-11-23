import { expect, it } from "vitest";
import { nextNoxCarouselFrame } from "@/lib/nox-carousel";

it("changes each photo before moving to the next product group", () => {
  expect(nextNoxCarouselFrame({ page: 0, photo: 0 }, 3, 2)).toEqual({ page: 0, photo: 1 });
  expect(nextNoxCarouselFrame({ page: 0, photo: 1 }, 3, 2)).toEqual({ page: 0, photo: 2 });
  expect(nextNoxCarouselFrame({ page: 0, photo: 2 }, 3, 2)).toEqual({ page: 1, photo: 0 });
});
it("wraps from the final group back to the first", () => {
  expect(nextNoxCarouselFrame({ page: 1, photo: 2 }, 3, 2)).toEqual({ page: 0, photo: 0 });
});
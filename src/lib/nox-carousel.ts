export function nextNoxCarouselFrame(position: { page: number; photo: number }, photoCount: number, pageCount: number) {
  const pages = Math.max(1, pageCount);
  const photos = Math.max(1, photoCount);
  return position.photo + 1 < photos
    ? { page: position.page % pages, photo: position.photo + 1 }
    : { page: (position.page + 1) % pages, photo: 0 };
}
/**
 * Helpers for Django REST Framework `PageNumberPagination` responses:
 * `{ count, next, previous, results }`.
 * Keep `pageSize` identical to your backend `PageNumberPagination.page_size`.
 */

export type PageToken = number | "ellipsis";

/**
 * Total page count from DRF `count` and the same `page_size` the API uses.
 */
export function drfTotalPages(totalCount: number, pageSize: number): number {
  if (pageSize <= 0) return 1;
  return Math.max(1, Math.ceil(totalCount / pageSize));
}

/**
 * Compact page buttons: `1 … window … last` (e.g. page 1 → 1 2 3 4 … 10).
 * `current` is clamped to `[1, totalPages]` so stale indices after filters stay valid.
 */
export function getPaginationItems(
  current: number,
  totalPages: number
): PageToken[] {
  if (totalPages <= 1) return [];

  const c = Math.min(Math.max(1, current), totalPages);

  const maxPagesWithoutEllipsis = 5;
  if (totalPages <= maxPagesWithoutEllipsis) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items: PageToken[] = [];
  items.push(1);

  let left: number;
  let right: number;

  if (c <= 3) {
    left = 2;
    right = 4;
  } else if (c >= totalPages - 2) {
    left = Math.max(2, totalPages - 3);
    right = totalPages - 1;
  } else {
    left = Math.max(2, c - 1);
    right = Math.min(totalPages - 1, c + 1);
  }

  if (left > 2) {
    items.push("ellipsis");
  }
  for (let p = left; p <= right; p++) {
    items.push(p);
  }
  if (right < totalPages - 1) {
    items.push("ellipsis");
  }
  items.push(totalPages);
  return items;
}

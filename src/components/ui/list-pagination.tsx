"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPaginationItems } from "@/lib/pagination";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export type ListPaginationProps = {
  /** Current page (1-based). Must match DRF `?page=`. */
  page: number;
  /** Total pages from `drfTotalPages(response.count, pageSize)` (same `pageSize` as Django). */
  totalPages: number;
  /** DRF list payload: `Boolean(response.previous)` */
  hasPrevious: boolean;
  /** DRF list payload: `Boolean(response.next)` */
  hasNext: boolean;
  onPageChange: (page: number) => void;
  /** Optional `response.count` for the summary line. */
  totalCount?: number;
  disabled?: boolean;
  /** Refetch in flight (shows spinner next to summary). */
  isFetching?: boolean;
  /** If true, render nothing when `totalPages <= 1`. Default true. */
  hideWhenSinglePage?: boolean;
  /** Show “Page x of y · z total”. Default true. */
  showSummary?: boolean;
  className?: string;
};

/**
 * Reusable pagination bar for DRF-paginated lists (previous / numbered pages / next).
 * Wire `page` + `onPageChange` to your list query (`?page=`).
 */
export function ListPagination({
  page,
  totalPages,
  hasPrevious,
  hasNext,
  onPageChange,
  totalCount,
  disabled = false,
  isFetching = false,
  hideWhenSinglePage = true,
  showSummary = true,
  className,
}: ListPaginationProps) {
  const items = React.useMemo(
    () => getPaginationItems(page, totalPages),
    [page, totalPages]
  );

  if (hideWhenSinglePage && totalPages <= 1) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 pt-4 border-t border-gray-100",
        className
      )}
    >
      {showSummary ? (
        <p className="text-sm text-gray-600">
          Page {page} of {totalPages}
          {totalCount !== undefined ? (
            <>
              <span className="text-gray-400 mx-2">·</span>
              {totalCount} total
            </>
          ) : null}
          {isFetching ? (
            <Loader2 className="inline h-4 w-4 ml-2 align-middle animate-spin text-gray-400" />
          ) : null}
        </p>
      ) : isFetching ? (
        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
      ) : null}

      <Pagination>
        <PaginationContent className="flex-wrap justify-center">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={!hasPrevious || disabled}
              className={
                !hasPrevious || disabled
                  ? "pointer-events-none opacity-50"
                  : undefined
              }
              onClick={(e) => {
                e.preventDefault();
                if (hasPrevious && !disabled) onPageChange(Math.max(1, page - 1));
              }}
            />
          </PaginationItem>
          {items.map((item, idx) =>
            item === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${idx}`}>
                <span
                  className="flex min-w-9 h-9 items-center justify-center text-sm font-medium text-gray-500 select-none"
                  aria-hidden
                >
                  …
                </span>
              </PaginationItem>
            ) : (
              <PaginationItem key={item}>
                <PaginationLink
                  href="#"
                  isActive={item === page}
                  onClick={(e) => {
                    e.preventDefault();
                    if (!disabled && item !== page) onPageChange(item);
                  }}
                  className={
                    disabled ? "pointer-events-none opacity-50" : undefined
                  }
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={!hasNext || disabled}
              className={
                !hasNext || disabled
                  ? "pointer-events-none opacity-50"
                  : undefined
              }
              onClick={(e) => {
                e.preventDefault();
                if (hasNext && !disabled) onPageChange(page + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

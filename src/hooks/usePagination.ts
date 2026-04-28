import { useEffect, type Dispatch, type SetStateAction } from "react";

/**
 * When DRF `count` drops (search/filter), keep `page` state ≤ `totalPages`
 * so the UI matches `?page=` and the numbered buttons stay valid.
 */
export function useClampPageToTotalPages(
  totalPages: number,
  setPage: Dispatch<SetStateAction<number>>
) {
  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages, setPage]);
}

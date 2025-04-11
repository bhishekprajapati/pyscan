"use client";

import { useMemo, useState } from "react";

type UsePaginatorParam<T> = {
  data: T;
  defaultPage: number;
  defaultPageSize: number;
  pageSizes: number[];
};

export type Paginator = ReturnType<typeof usePaginator>;

export const usePaginator = <T extends unknown[]>(
  param: UsePaginatorParam<T>,
) => {
  const { data, defaultPage, defaultPageSize, pageSizes } = param;

  const count = data.length;
  const [page, setPage] = useState(defaultPage);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const totalPages = Math.ceil(count / pageSize);

  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return data.slice(start, end);
  }, [page, pageSize, data]) as T;

  const isFirstPage = page === 1;
  const isLastPage = page === totalPages;

  return {
    pageData,
    page,
    pageSize,
    totalPages,
    isFirstPage,
    isLastPage,
    setPage(page: number) {
      if (page <= totalPages || page >= 1) {
        setPage(page);
      } else {
        console.warn("Illegal page number ", page);
      }
    },
    setPageSize: (count: number) => {
      const size = pageSizes.find((size) => size === count);
      if (size !== undefined) {
        setPage(1);
        setPageSize(count);
      }
    },
    nextPage() {
      if (!isLastPage) {
        setPage((p) => p + 1);
      }
    },
    prevPage() {
      if (!isFirstPage) {
        setPage((p) => p - 1);
      }
    },
    toFirstPage() {
      setPage(1);
    },
    toLastPage() {
      setPage(totalPages);
    },
    getPageSizes() {
      return [...pageSizes];
    },
  };
};

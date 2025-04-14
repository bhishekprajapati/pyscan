"use client";

import { useState } from "react";

type UsePaginatorParam = {
  initialPage: number;
  initialPageSize: number;
  initialPageSizes: number[];
};

export type Paginator = ReturnType<typeof usePaginator>;

export const usePaginator = (param: UsePaginatorParam) => {
  const { initialPage, initialPageSize, initialPageSizes } = param;

  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [pageSizes] = useState(initialPageSizes);
  const [totalPages, setTotalPages] = useState(1);

  const isFirstPage = page === 1;
  const isLastPage = page === totalPages;

  return {
    page,
    pageSize,
    pageSizes,
    totalPages,
    setTotalPages,
    isFirstPage,
    isLastPage,
    onLastPress: () => setPage(totalPages),
    onFirstPress: () => setPage(1),
    onNextPress: () => !isLastPage && setPage((p) => p + 1),
    onPrevPress: () => !isFirstPage && setPage((p) => p - 1),
    onPageSizeSelect: (num: number) => {
      setPage(1);
      setPageSize(num);
    },
  };
};

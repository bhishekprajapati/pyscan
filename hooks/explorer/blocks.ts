"use client";

import { isServer, useQuery } from "@tanstack/react-query";
import api from "@/lib/api-sdk";
import { useCursorPaginator } from "../table";

export const useBlocks = () => {
  const { cursor, limit, setCursor } = useCursorPaginator({
    initialCursor: new Date().toISOString(),
  });

  const query = useQuery({
    queryKey: ["mainnet", "blocks", limit, cursor],
    queryFn: async ({ signal }) => {
      const res = await api.public.explorer.getBlocks(
        {
          // @ts-expect-error ...
          limit: limit.toString(),
          cursor,
        },
        { signal },
      );
      if (!res.ok) {
        throw Error(res.error.message);
      }
      return res.data;
    },
    enabled: !isServer,
  });

  return {
    query,
    nextPage: () => {
      if (query.data) {
        setCursor(query.data.meta.cursor);
      }
    },
  };
};

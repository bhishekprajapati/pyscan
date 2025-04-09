"use client";

import { useQuery } from "@tanstack/react-query";

export const useHolderCounts = () => {
  // auto public and private endpoint switching logic goes here...
  const query = useQuery({
    queryKey: [""],
    placeholderData: [""],
  });

  return { query };
};

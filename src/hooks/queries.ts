"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getUsers } from "@/lib/api";

export function useUsers(page: number, search: string, limit = 8) {
  return useQuery({
    queryKey: ["users", page, search, limit],
    queryFn: () =>
      getUsers({
        page,
        search,
        limit,
      }),
    placeholderData: keepPreviousData,
  });
}

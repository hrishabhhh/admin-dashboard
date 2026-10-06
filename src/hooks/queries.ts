"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTransactions, getUser, getUsers } from "@/lib/api";

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

export function useUser(id: number) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser(id),
    enabled: Number.isInteger(id) && id > 0,
  });
}

export function useTransactions(page: number, limit = 8) {
  return useQuery({
    queryKey: ["transactions", page, limit],
    queryFn: () =>
      getTransactions({
        page,
        limit,
      }),
    placeholderData: keepPreviousData,
  });
}

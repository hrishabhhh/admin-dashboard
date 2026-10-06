"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  getBooking,
  getBookings,
  getTransaction,
  getTransactions,
  getUser,
  getUsers,
} from "@/lib/api";

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

export function useTransaction(id: number) {
  return useQuery({
    queryKey: ["transaction", id],
    queryFn: () => getTransaction(id),
    enabled: Number.isInteger(id) && id > 0,
  });
}

export function useBookings(page: number, limit = 8) {
  return useQuery({
    queryKey: ["bookings", page, limit],
    queryFn: () =>
      getBookings({
        page,
        limit,
      }),
    placeholderData: keepPreviousData,
  });
}

export function useBooking(id: number) {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: () => getBooking(id),
    enabled: Number.isInteger(id) && id > 0,
  });
}

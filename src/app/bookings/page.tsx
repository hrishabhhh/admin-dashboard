"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Download,
  Eye,
  Filter,
  Pencil,
  Plus,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";

import { StatusBadge } from "@/components/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { useBookings } from "@/hooks/queries";

import type { Booking, BookingStatus } from "@/types";

type StatusFilter = "All" | BookingStatus;

export default function BookingsPage() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState<StatusFilter>("All");

  const [service, setService] = useState("All");

  const { data, isLoading, isError, isFetching, refetch } = useBookings(page);

  const services = useMemo(() => {
    if (!data) {
      return [];
    }

    return Array.from(new Set(data.bookings.map((booking) => booking.service)));
  }, [data]);

  const bookings = useMemo(() => {
    if (!data) {
      return [];
    }

    const query = search.trim().toLowerCase();

    return data.bookings.filter((booking) => {
      const matchesSearch =
        !query ||
        booking.bookingId.toLowerCase().includes(query) ||
        booking.customerName.toLowerCase().includes(query) ||
        booking.service.toLowerCase().includes(query);

      const matchesStatus = status === "All" || booking.status === status;

      const matchesService = service === "All" || booking.service === service;

      return matchesSearch && matchesStatus && matchesService;
    });
  }, [data, search, status, service]);

  const totalPages = data ? Math.ceil(data.total / data.limit) : 1;

  return (
    <div className="mx-auto max-w-[1440px] p-4 md:p-8">
      {/* MOBILE */}
      <div className="md:hidden">
        <h1 className="text-xl font-semibold">Active Bookings</h1>

        <p className="text-sm text-slate-500">
          Manage and schedule corporate bookings
        </p>

        <div className="mt-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search bookings..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-lg border border-slate-200 bg-white"
            aria-label="Filter bookings"
          >
            <Filter className="size-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* DESKTOP TITLE */}
      <div className="mb-6 hidden items-start justify-between md:flex">
        <div>
          <h2 className="text-2xl font-semibold">Bookings Directory</h2>

          <p className="text-sm text-slate-500">
            Manage all service bookings and consultation meetings
          </p>
        </div>

        <button
          type="button"
          className="flex h-10 items-center gap-2 rounded-lg bg-indigo-600 px-5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <Plus className="size-4" />
          New Booking
        </button>
      </div>

      {/* STATS */}
      <div className="mt-5 grid grid-cols-2 gap-2 md:mt-0 md:grid-cols-4 md:gap-4">
        <BookingStat
          mobileLabel="Total Bookings"
          label="Total Bookings"
          value="3,456"
          change="↑ 8.4%"
          positive
        />

        <BookingStat
          mobileLabel="Active Sessions"
          label="Active Bookings"
          value="1,234"
          change="↓ 3.1%"
        />

        <BookingStat
          mobileLabel="Completed"
          label="Completed Bookings"
          value="2,089"
          change="↑ 12.1%"
          positive
        />

        <BookingStat
          mobileLabel="Cancelled"
          label="Cancelled Bookings"
          value="133"
          change="↓ 1.4%"
          positive
        />
      </div>

      {/* MOBILE CREATE */}
      <button
        type="button"
        className="mt-4 h-10 w-full rounded-lg bg-indigo-600 text-sm font-medium text-white md:hidden"
      >
        + Create New Booking
      </button>

      {/* DESKTOP FILTERS */}
      <div className="mt-6 hidden items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 md:flex">
        <div className="relative w-[240px]">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search bookings by ID or client..."
            className="h-10 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-indigo-500"
          />
        </div>

        <select className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600">
          <option>Date Range: Last 30 Days</option>
        </select>

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as StatusFilter)}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600"
        >
          <option value="All">Status: All</option>

          <option value="Confirmed">Confirmed</option>

          <option value="Completed">Completed</option>

          <option value="Pending">Pending</option>

          <option value="Cancelled">Cancelled</option>
        </select>

        <select
          value={service}
          onChange={(event) => setService(event.target.value)}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600"
        >
          <option value="All">Service Type: All</option>

          {services.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="ml-auto flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-4 text-sm text-slate-600"
        >
          <Download className="size-4" />
          Export List
        </button>
      </div>

      {/* DATA */}
      <div className="mt-4 md:mt-6">
        {isLoading ? (
          <BookingsLoading />
        ) : isError ? (
          <BookingsError onRetry={refetch} />
        ) : bookings.length === 0 ? (
          <BookingsEmpty />
        ) : (
          <>
            {/* DESKTOP TABLE */}
            <div className="hidden rounded-lg border border-slate-200 bg-white p-5 md:block">
              <div className="grid grid-cols-[125px_1.2fr_1fr_175px_115px_115px_110px_80px] rounded-md bg-slate-50 px-3 py-3 text-xs font-medium uppercase text-slate-500">
                <span>Booking ID</span>
                <span>Customer</span>
                <span>Service</span>
                <span>Date & Time</span>
                <span>Duration</span>
                <span>Status</span>
                <span>Amount</span>
                <span>Actions</span>
              </div>

              {bookings.map((booking) => (
                <DesktopBookingRow key={booking.id} booking={booking} />
              ))}

              <Pagination
                page={page}
                total={data?.total ?? 0}
                totalPages={totalPages}
                loading={isFetching}
                onPrevious={() =>
                  setPage((current) => Math.max(current - 1, 1))
                }
                onNext={() =>
                  setPage((current) => Math.min(current + 1, totalPages))
                }
              />
            </div>

            {/* MOBILE CARDS */}
            <div className="space-y-3 md:hidden">
              {bookings.slice(0, 5).map((booking) => (
                <MobileBookingCard key={booking.id} booking={booking} />
              ))}

              <Pagination
                page={page}
                total={data?.total ?? 0}
                totalPages={totalPages}
                loading={isFetching}
                onPrevious={() =>
                  setPage((current) => Math.max(current - 1, 1))
                }
                onNext={() =>
                  setPage((current) => Math.min(current + 1, totalPages))
                }
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function BookingStat({
  label,
  mobileLabel,
  value,
  change,
  positive = false,
}: {
  label: string;
  mobileLabel: string;
  value: string;
  change: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 md:p-5">
      <div className="flex items-start justify-between">
        <p className="text-xs text-slate-500 md:text-sm">
          <span className="md:hidden">{mobileLabel}</span>

          <span className="hidden md:inline">{label}</span>
        </p>

        <div className="hidden size-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 md:flex">
          <CalendarDays className="size-4" />
        </div>
      </div>

      <p
        className={`mt-1 text-lg font-semibold md:mt-5 md:text-2xl ${
          mobileLabel === "Completed"
            ? "text-emerald-700 md:text-slate-900"
            : mobileLabel === "Cancelled"
              ? "text-red-700 md:text-slate-900"
              : mobileLabel === "Active Sessions"
                ? "text-indigo-600 md:text-slate-900"
                : ""
        }`}
      >
        {value}
      </p>

      <div className="mt-1 hidden items-center gap-1 text-xs md:flex">
        <span
          className={
            positive
              ? "rounded bg-emerald-100 px-1.5 py-0.5 font-medium text-emerald-700"
              : "rounded bg-red-100 px-1.5 py-0.5 font-medium text-red-600"
          }
        >
          {change}
        </span>

        <span className="text-slate-400">vs last month</span>
      </div>
    </div>
  );
}

function DesktopBookingRow({ booking }: { booking: Booking }) {
  return (
    <div className="grid grid-cols-[125px_1.2fr_1fr_175px_115px_115px_110px_80px] items-center border-b border-slate-200 px-3 py-3 text-sm last:border-0">
      <span className="font-semibold">#{booking.bookingId}</span>

      <div className="flex min-w-0 items-center gap-3">
        <Image
          src={booking.customerImage}
          alt={booking.customerName}
          width={26}
          height={26}
          className="size-[26px] shrink-0 rounded-full object-cover"
        />

        <span className="truncate">{booking.customerName}</span>
      </div>

      <span className="truncate">{booking.service}</span>

      <span className="text-slate-600">{booking.date}</span>

      <span className="text-slate-600">{booking.duration}</span>

      <div>
        <StatusBadge status={booking.status} />
      </div>

      <span className="font-semibold">{formatMoney(booking.amount)}</span>

      <div className="flex gap-3">
        <Link
          href={`/bookings/${booking.id}`}
          aria-label={`View ${booking.bookingId}`}
        >
          <Eye className="size-4 text-slate-600" />
        </Link>

        <Link
          href={`/bookings/${booking.id}`}
          aria-label={`Edit ${booking.bookingId}`}
        >
          <Pencil className="size-4 text-slate-600" />
        </Link>
      </div>
    </div>
  );
}

function MobileBookingCard({ booking }: { booking: Booking }) {
  const mobileStatus =
    booking.status === "Confirmed" ? "Active" : booking.status;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <span className="text-sm font-semibold">#{booking.bookingId}</span>

        <StatusBadge status={mobileStatus} />
      </div>

      <div className="mt-3 flex items-center">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Image
            src={booking.customerImage}
            alt={booking.customerName}
            width={34}
            height={34}
            className="size-[34px] rounded-full object-cover"
          />

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              {booking.customerName}
            </p>

            <p className="truncate text-xs text-slate-500">{booking.service}</p>
          </div>
        </div>

        <p className="ml-3 text-sm font-semibold text-indigo-600">
          {formatMoney(booking.amount)}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-[11px] text-slate-500">{booking.date}</p>

        <Link
          href={`/bookings/${booking.id}`}
          className="flex size-7 items-center justify-center rounded bg-slate-50"
        >
          <Pencil className="size-4 text-slate-600" />
        </Link>
      </div>
    </div>
  );
}

function Pagination({
  page,
  total,
  totalPages,
  loading,
  onPrevious,
  onNext,
}: {
  page: number;
  total: number;
  totalPages: number;
  loading: boolean;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const start = (page - 1) * 8 + 1;

  const end = Math.min(page * 8, total);

  return (
    <div className="mt-6 flex items-center justify-between">
      <p className="hidden text-sm text-slate-500 md:block">
        Showing{" "}
        <strong className="text-slate-900">
          {start}-{end}
        </strong>{" "}
        of <strong className="text-slate-900">{total.toLocaleString()}</strong>{" "}
        results
      </p>

      <div className="ml-auto flex gap-2">
        <button
          type="button"
          disabled={page === 1 || loading}
          onClick={onPrevious}
          className="rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        <button
          type="button"
          disabled={page >= totalPages || loading}
          onClick={onNext}
          className="rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function formatMoney(amount: number) {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function BookingsLoading() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="space-y-4">
        {Array.from({
          length: 6,
        }).map((_, index) => (
          <div key={index} className="flex items-center gap-4">
            <Skeleton className="size-9 rounded-full" />

            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-52" />
            </div>

            <Skeleton className="h-7 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

function BookingsError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-lg border border-red-200 bg-white px-6 py-12 text-center">
      <h3 className="font-semibold">Unable to load bookings</h3>

      <p className="mt-1 text-sm text-slate-500">
        Something went wrong while fetching booking data.
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
      >
        Try Again
      </button>
    </div>
  );
}

function BookingsEmpty() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-6 py-12 text-center">
      <h3 className="font-semibold">No bookings found</h3>

      <p className="mt-1 text-sm text-slate-500">
        Try changing your search or filters.
      </p>
    </div>
  );
}

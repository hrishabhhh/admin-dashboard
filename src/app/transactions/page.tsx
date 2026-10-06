"use client";

import Image from "next/image";
import Link from "next/link";
import { Download, Eye, Filter, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { StatusBadge } from "@/components/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTransactions } from "@/hooks/queries";

import type { Transaction, TransactionType } from "@/types";

type TypeFilter = "All" | TransactionType;

export default function TransactionsPage() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");

  const [type, setType] = useState<TypeFilter>("All");

  const { data, isLoading, isError, isFetching, refetch } =
    useTransactions(page);

  const transactions = useMemo(() => {
    if (!data) {
      return [];
    }

    const query = search.trim().toLowerCase();

    return data.transactions.filter((transaction) => {
      const matchesSearch =
        !query ||
        transaction.transactionId.toLowerCase().includes(query) ||
        transaction.customerName.toLowerCase().includes(query);

      const matchesType = type === "All" || transaction.type === type;

      return matchesSearch && matchesType;
    });
  }, [data, search, type]);

  const totalPages = data ? Math.ceil(data.total / data.limit) : 1;

  return (
    <div className="mx-auto max-w-[1440px] p-4 md:p-8">
      {/* Mobile heading */}
      <div className="mb-4 md:hidden">
        <h1 className="text-xl font-semibold">Transactions Ledger</h1>

        <p className="text-sm text-slate-500">
          Monitor corporate financial ledger
        </p>
      </div>

      {/* Desktop heading */}
      <div className="mb-6 hidden items-start justify-between md:flex">
        <div>
          <h2 className="text-2xl font-semibold">Transaction History</h2>

          <p className="text-sm text-slate-500">
            Monitor and manage all corporate financial transactions
          </p>
        </div>

        <button
          type="button"
          className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600"
        >
          <Download className="size-4" />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <TransactionStat
          label="Total Txns"
          desktopLabel="Total Transactions"
          value="24,891"
        />

        <TransactionStat label="Total Volume" value="$1,204,821" />

        <TransactionStat
          label="Avg. Amount"
          desktopLabel="Avg. Transaction"
          value="$48.20"
        />

        <TransactionStat label="Success Rate" value="96.8%" success />
      </div>

      {/* Filters */}
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="relative flex-1 md:max-w-[240px]">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search ID or User..."
              className="h-10 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          {/* Desktop filters */}
          <select className="hidden h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 md:block">
            <option>Date: Last 30 Days</option>
          </select>

          <select
            value={type}
            onChange={(event) => setType(event.target.value as TypeFilter)}
            className="hidden h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 md:block"
          >
            <option value="All">Type: All Types</option>

            <option value="Payment">Payment</option>

            <option value="Refund">Refund</option>

            <option value="Transfer">Transfer</option>
          </select>

          <select className="hidden h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 md:block">
            <option>Amount: All</option>
          </select>

          {/* Mobile filter button */}
          <button
            type="button"
            className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white md:hidden"
            aria-label="Filter transactions"
          >
            <Filter className="size-5 text-slate-600" />
          </button>

          <button
            type="button"
            className="size-10 shrink-0 rounded-lg border border-slate-200 bg-white md:hidden"
            aria-label="More filters"
          />
        </div>
      </div>

      {/* Content */}
      <div className="mt-6">
        {isLoading ? (
          <TransactionsLoading />
        ) : isError ? (
          <TransactionsError onRetry={refetch} />
        ) : transactions.length === 0 ? (
          <TransactionsEmpty />
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden rounded-lg border border-slate-200 bg-white p-5 md:block">
              <div className="grid grid-cols-[130px_1.4fr_110px_130px_130px_180px_70px] rounded-md bg-slate-50 px-3 py-3 text-xs font-medium uppercase text-slate-500">
                <span>Transaction ID</span>
                <span>User</span>
                <span>Type</span>
                <span>Amount</span>
                <span>Status</span>
                <span>Date & Time</span>
                <span>Actions</span>
              </div>

              {transactions.map((transaction) => (
                <DesktopTransactionRow
                  key={transaction.id}
                  transaction={transaction}
                />
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

            {/* Mobile */}
            <div className="space-y-3 md:hidden">
              {transactions.slice(0, 5).map((transaction) => (
                <MobileTransactionCard
                  key={transaction.id}
                  transaction={transaction}
                />
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

function TransactionStat({
  label,
  desktopLabel,
  value,
  success = false,
}: {
  label: string;
  desktopLabel?: string;
  value: string;
  success?: boolean;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 md:p-4">
      <p className="text-xs text-slate-500 md:text-sm">
        <span className={desktopLabel ? "md:hidden" : ""}>{label}</span>

        {desktopLabel && (
          <span className="hidden md:inline">{desktopLabel}</span>
        )}
      </p>

      <p
        className={`mt-1 text-lg font-semibold md:text-xl ${
          success ? "text-emerald-700" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function DesktopTransactionRow({ transaction }: { transaction: Transaction }) {
  return (
    <div className="grid grid-cols-[130px_1.4fr_110px_130px_130px_180px_70px] items-center border-b border-slate-200 px-3 py-3 text-sm last:border-0">
      <span className="font-medium">#{transaction.transactionId}</span>

      <div className="flex items-center gap-3">
        {transaction.customerImage && (
          <Image
            src={transaction.customerImage}
            alt={transaction.customerName}
            width={28}
            height={28}
            className="size-7 rounded-full object-cover"
          />
        )}

        <span className="truncate">{transaction.customerName}</span>
      </div>

      <TransactionTypeBadge type={transaction.type} />

      <span
        className={
          transaction.amount < 0
            ? "font-semibold text-red-500"
            : "font-semibold"
        }
      >
        {formatMoney(transaction.amount)}
      </span>

      <div>
        <StatusBadge status={transaction.status} />
      </div>

      <span className="text-slate-500">{transaction.date}</span>

      <Link
        href={`/transactions/${transaction.id}`}
        className="flex size-8 items-center justify-center"
        aria-label={`View ${transaction.transactionId}`}
      >
        <Eye className="size-4 text-slate-600" />
      </Link>
    </div>
  );
}

function MobileTransactionCard({ transaction }: { transaction: Transaction }) {
  return (
    <Link
      href={`/transactions/${transaction.id}`}
      className="block rounded-lg border border-slate-200 bg-white p-3"
    >
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <span className="text-sm font-semibold">
          #{transaction.transactionId}
        </span>

        <StatusBadge status={transaction.status} />
      </div>

      <div className="mt-3 flex items-center">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {transaction.customerImage && (
            <Image
              src={transaction.customerImage}
              alt={transaction.customerName}
              width={34}
              height={34}
              className="size-[34px] rounded-full object-cover"
            />
          )}

          <p className="truncate text-sm text-slate-600">
            {transaction.customerName}
          </p>
        </div>

        <div className="text-right">
          <p
            className={`text-sm font-semibold ${
              transaction.amount < 0 ? "text-red-500" : ""
            }`}
          >
            {formatMoney(transaction.amount)}
          </p>

          <TransactionTypeBadge type={transaction.type} />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-slate-500">{transaction.date}</p>

        <span className="flex size-6 items-center justify-center rounded-full bg-slate-100">
          <span className="size-2.5 rounded-full bg-slate-600" />
        </span>
      </div>
    </Link>
  );
}

function TransactionTypeBadge({ type }: { type: TransactionType }) {
  const classes: Record<TransactionType, string> = {
    Payment: "bg-blue-100 text-blue-700",
    Refund: "bg-red-100 text-red-600",
    Transfer: "bg-blue-100 text-blue-700",
  };
  return (
    <span
      className={`inline-flex w-fit rounded px-2 py-1 text-xs font-medium ${classes[type]}`}
    >
      {type}
    </span>
  );
}

function formatMoney(amount: number) {
  const formatted = Math.abs(amount).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  return amount < 0 ? `-${formatted}` : formatted;
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

function TransactionsLoading() {
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

function TransactionsError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-lg border border-red-200 bg-white px-6 py-12 text-center">
      <h3 className="font-semibold">Unable to load transactions</h3>

      <p className="mt-1 text-sm text-slate-500">
        Something went wrong while loading the ledger.
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

function TransactionsEmpty() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-6 py-12 text-center">
      <h3 className="font-semibold">No transactions found</h3>

      <p className="mt-1 text-sm text-slate-500">
        Try changing your search or filters.
      </p>
    </div>
  );
}

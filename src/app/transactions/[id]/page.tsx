"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRightLeft, Check, Printer } from "lucide-react";
import { useParams } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/StatusBadge";
import { useTransaction } from "@/hooks/queries";

export default function TransactionDetailPage() {
  const params = useParams<{ id: string }>();

  const transactionId = Number(params.id);

  const {
    data: transaction,
    isLoading,
    isError,
    refetch,
  } = useTransaction(transactionId);

  if (!Number.isInteger(transactionId) || transactionId <= 0) {
    return <TransactionError message="Invalid transaction ID" />;
  }

  if (isLoading) {
    return <TransactionDetailLoading />;
  }

  if (isError || !transaction) {
    return (
      <TransactionError
        message="Unable to load transaction"
        onRetry={refetch}
      />
    );
  }

  const firstName = transaction.customerName.split(" ")[0];

  return (
    <div className="mx-auto max-w-[1440px] p-4 md:p-8">
      {/* Desktop breadcrumb */}
      <div className="mb-6 hidden items-center gap-2 text-sm md:flex">
        <Link
          href="/transactions"
          className="text-slate-500 hover:text-indigo-600"
        >
          Transactions
        </Link>

        <span className="text-slate-400">/</span>

        <span className="font-semibold text-slate-900">
          #{transaction.transactionId}
        </span>
      </div>

      {/* DESKTOP summary */}
      <section className="hidden items-center justify-between rounded-lg border border-slate-200 bg-white p-6 md:flex">
        <div className="flex items-center gap-5">
          <div className="flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <ArrowRightLeft className="size-6" />
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-semibold">
                Transaction #{transaction.transactionId}
              </h2>

              <StatusBadge status={transaction.status} />
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Reference #{transaction.referenceId}
              {" • "}
              Generated on {transaction.date}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-600"
          >
            <Printer className="size-4" />
            Print Receipt
          </button>

          <button
            type="button"
            className="h-10 rounded-lg bg-indigo-600 px-5 text-sm font-medium text-white"
          >
            Refund Transaction
          </button>
        </div>
      </section>

      {/* MOBILE summary */}
      <section className="rounded-lg border border-slate-200 bg-white p-6 text-center md:hidden">
        <p className="text-sm text-slate-500">
          Transaction #{transaction.transactionId}
        </p>

        <p className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
          {formatMoney(transaction.amount)}
        </p>

        <div className="mt-3">
          <StatusBadge status={transaction.status} />
        </div>
      </section>

      {/* Mobile actions */}
      <div className="mt-4 grid grid-cols-2 gap-3 md:hidden">
        <button
          type="button"
          className="h-10 rounded-lg bg-indigo-600 text-sm font-medium text-white"
        >
          Refund
        </button>

        <button
          type="button"
          className="flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-400 bg-white text-sm font-medium text-slate-600"
        >
          <Printer className="size-4" />
          Print Receipt
        </button>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1.8fr)_minmax(300px,1fr)]">
        <div className="space-y-6">
          {/* Transaction details */}
          <DetailCard
            title="Transaction Details"
            desktopTitle="Transaction Invoice Details"
          >
            <DetailRow
              label="Type"
              desktopLabel="Transaction Type"
              value={
                transaction.type === "Payment"
                  ? "Service Payment"
                  : transaction.type
              }
            />

            <DetailRow
              label="Method"
              desktopLabel="Payment Method"
              value={transaction.paymentMethod}
            />

            <DetailRow
              label="Date & Time"
              desktopLabel="Processing Gateway Fee"
              value={transaction.date}
              desktopValue={formatMoney(transaction.processingFee)}
            />

            <div className="md:hidden">
              <DetailRow label="Reference ID" value={transaction.referenceId} />

              <DetailRow
                label="Processing Fee"
                value={formatMoney(transaction.processingFee)}
                last
              />
            </div>

            <div className="hidden md:block">
              <DetailRow
                label="Subtotal"
                value={formatMoney(transaction.subtotal)}
              />

              <div className="flex items-center justify-between pt-4">
                <span className="font-semibold">Grand Total</span>

                <span className="text-xl font-bold text-indigo-600">
                  {formatMoney(Math.abs(transaction.amount))}
                </span>
              </div>
            </div>
          </DetailCard>

          {/* Customer */}
          <section className="rounded-lg border border-slate-200 bg-white p-4 md:p-5">
            <h3 className="mb-4 font-semibold">
              <span className="md:hidden">Customer Details</span>

              <span className="hidden md:inline">Customer Profile Summary</span>
            </h3>

            {/* Mobile */}
            <div className="md:hidden">
              <DetailRow label="Name" value={transaction.customerName} />

              <DetailRow
                label="Email"
                value={`${firstName.toLowerCase()}@example.com`}
              />

              <DetailRow label="Phone" value="+1 555-0123" />

              <DetailRow
                label="Account ID"
                value={`#USR-${String(transaction.userId).padStart(4, "0")}`}
                last
              />
            </div>

            {/* Desktop */}
            <div className="hidden items-center gap-4 md:flex">
              <Image
                src={transaction.customerImage}
                alt={transaction.customerName}
                width={48}
                height={48}
                className="size-12 rounded-full object-cover"
              />

              <div>
                <p className="font-medium">{transaction.customerName}</p>

                <p className="text-sm text-slate-500">
                  {firstName.toLowerCase()}
                  @example.com
                  {" • "}
                  ID #USR-
                  {String(transaction.userId).padStart(4, "0")}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Processing */}
        <section className="rounded-lg border border-slate-200 bg-white p-4 md:self-start md:p-5">
          <h3 className="mb-5 font-semibold">
            <span className="md:hidden">Status Timeline</span>

            <span className="hidden md:inline">Processing History</span>
          </h3>

          <div className="space-y-5">
            <TimelineItem
              success
              title="Transaction Completed"
              desktopTitle="Completed & Disbursed"
              description="Funds successfully settled into merchant vault."
              desktopDescription="Settled in merchant bank account"
              time="Oct 1, 10:33 AM"
            />

            <TimelineItem
              title="Processing"
              desktopTitle="Processing & Authorized"
              description="Card authenticated via 3D Secure."
              desktopDescription="Visa Gateway auth approved"
              time="Oct 1, 10:32 AM"
            />

            <TimelineItem
              title="Initiated"
              description="Payment request received from mobile checkout."
              desktopDescription="Checkout session initialized"
              time="Oct 1, 10:32 AM"
              last
            />
          </div>
        </section>
      </div>

      {/* Related ledger desktop */}
      <section className="mt-6 hidden rounded-lg border border-slate-200 bg-white p-5 md:block">
        <h3 className="mb-3 font-semibold">Related Customer Ledger Entries</h3>

        <div className="grid grid-cols-[140px_1fr_120px_130px_1fr] rounded-md bg-slate-50 px-3 py-3 text-xs font-medium uppercase text-slate-500">
          <span>Transaction ID</span>
          <span>Gateway Method</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Settled At</span>
        </div>

        <LedgerRow
          id={`TXN-${7100 + transaction.userId}`}
          method="Visa Card (*4582)"
          amount="$120.00"
          date="Aug 15, 2024 10:14"
        />

        <LedgerRow
          id={`TXN-${5900 + transaction.userId}`}
          method="Direct PayPal Link"
          amount="$350.00"
          date="Jul 02, 2024 16:50"
        />
      </section>
    </div>
  );
}

function DetailCard({
  title,
  desktopTitle,
  children,
}: {
  title: string;
  desktopTitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 md:p-5">
      <h3 className="mb-2 font-semibold">
        <span className={desktopTitle ? "md:hidden" : ""}>{title}</span>

        {desktopTitle && (
          <span className="hidden md:inline">{desktopTitle}</span>
        )}
      </h3>

      {children}
    </section>
  );
}

function DetailRow({
  label,
  desktopLabel,
  value,
  desktopValue,
  last = false,
}: {
  label: string;
  desktopLabel?: string;
  value: string;
  desktopValue?: string;
  last?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-[125px_1fr] gap-3 py-2.5 text-sm md:grid-cols-[220px_1fr] ${
        last ? "" : "border-b border-slate-200"
      }`}
    >
      <span className="text-slate-500">
        <span className={desktopLabel ? "md:hidden" : ""}>{label}</span>

        {desktopLabel && (
          <span className="hidden md:inline">{desktopLabel}</span>
        )}
      </span>

      <span className="text-right font-medium text-slate-900">
        <span className={desktopValue ? "md:hidden" : ""}>{value}</span>

        {desktopValue && (
          <span className="hidden md:inline">{desktopValue}</span>
        )}
      </span>
    </div>
  );
}

function TimelineItem({
  title,
  desktopTitle,
  description,
  desktopDescription,
  time,
  success = false,
  last = false,
}: {
  title: string;
  desktopTitle?: string;
  description: string;
  desktopDescription?: string;
  time: string;
  success?: boolean;
  last?: boolean;
}) {
  return (
    <div className="relative pl-9">
      <div
        className={`absolute left-0 top-0 flex size-6 items-center justify-center rounded-full ${
          success
            ? "bg-emerald-100 text-emerald-600"
            : "bg-indigo-50 text-indigo-600"
        }`}
      >
        <Check className="size-4" />
      </div>

      {!last && (
        <div className="absolute left-[11px] top-6 h-[calc(100%+20px)] w-px bg-slate-200" />
      )}

      <p className="text-sm font-semibold">
        <span className={desktopTitle ? "md:hidden" : ""}>{title}</span>

        {desktopTitle && (
          <span className="hidden md:inline">{desktopTitle}</span>
        )}
      </p>

      <p className="text-xs text-slate-500">
        <span className={desktopDescription ? "md:hidden" : ""}>
          {description}
        </span>

        {desktopDescription && (
          <span className="hidden md:inline">{desktopDescription}</span>
        )}
      </p>

      <p className="text-xs text-slate-400">{time}</p>
    </div>
  );
}

function LedgerRow({
  id,
  method,
  amount,
  date,
}: {
  id: string;
  method: string;
  amount: string;
  date: string;
}) {
  return (
    <div className="grid grid-cols-[140px_1fr_120px_130px_1fr] items-center border-b border-slate-200 px-3 py-3 text-sm last:border-0">
      <span className="font-medium">#{id}</span>

      <span className="text-slate-600">{method}</span>

      <span className="font-semibold">{amount}</span>

      <div>
        <StatusBadge status="Completed" />
      </div>

      <span className="text-slate-500">{date}</span>
    </div>
  );
}

function formatMoney(amount: number) {
  const formatted = Math.abs(amount).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  return amount < 0 ? `-${formatted}` : formatted;
}

function TransactionDetailLoading() {
  return (
    <div className="mx-auto max-w-[1440px] space-y-6 p-4 md:p-8">
      <Skeleton className="h-32 rounded-lg" />

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <Skeleton className="h-72 rounded-lg" />
        <Skeleton className="h-72 rounded-lg" />
      </div>
    </div>
  );
}

function TransactionError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="p-4 md:p-8">
      <div className="rounded-lg border border-red-200 bg-white p-12 text-center">
        <h2 className="font-semibold">{message}</h2>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

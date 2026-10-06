"use client";

import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { useParams } from "next/navigation";

import { StatusBadge } from "@/components/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { useBooking } from "@/hooks/queries";

export default function BookingDetailPage() {
  const params = useParams<{ id: string }>();

  const bookingId = Number(params.id);

  const { data: booking, isLoading, isError, refetch } = useBooking(bookingId);

  if (!Number.isInteger(bookingId) || bookingId <= 0) {
    return <BookingError message="Invalid booking ID" />;
  }

  if (isLoading) {
    return <BookingDetailLoading />;
  }

  if (isError || !booking) {
    return <BookingError message="Unable to load booking" onRetry={refetch} />;
  }

  return (
    <div className="mx-auto max-w-[1440px] p-4 md:p-8">
      {/* Desktop breadcrumb */}
      <div className="mb-6 hidden items-center gap-2 text-sm md:flex">
        <Link href="/bookings" className="text-slate-500 hover:text-indigo-600">
          Bookings
        </Link>

        <span className="text-slate-400">/</span>

        <span className="font-semibold text-slate-900">
          #{booking.bookingId}
        </span>
      </div>

      {/* Desktop summary */}
      <section className="hidden items-center justify-between rounded-lg border border-slate-200 bg-white p-6 md:flex">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold">
              Booking #{booking.bookingId}
            </h2>

            <StatusBadge status={booking.status} />

            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
              Completed
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            {booking.service} • Scheduled for {booking.date}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            className="h-10 rounded-lg border border-slate-200 px-5 text-sm font-medium text-slate-600"
          >
            Reschedule
          </button>

          <button
            type="button"
            className="h-10 rounded-lg bg-red-100 px-5 text-sm font-medium text-red-700"
          >
            Cancel Booking
          </button>
        </div>
      </section>

      {/* Mobile summary */}
      <section className="rounded-lg border border-slate-200 bg-white p-6 text-center md:hidden">
        <p className="text-sm text-slate-500">Booking #{booking.bookingId}</p>

        <h2 className="mt-2 text-xl font-semibold">{booking.service}</h2>

        <div className="mt-3 flex justify-center gap-2">
          <StatusBadge status={booking.status} />

          <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-600">
            Premium
          </span>
        </div>
      </section>

      {/* Mobile actions */}
      <div className="mt-4 grid grid-cols-2 gap-3 md:hidden">
        <button
          type="button"
          className="h-10 rounded-lg bg-indigo-600 text-sm font-medium text-white"
        >
          Reschedule
        </button>

        <button
          type="button"
          className="h-10 rounded-lg border border-red-600 text-sm font-medium text-red-700"
        >
          Cancel Booking
        </button>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1.8fr)_minmax(300px,1fr)]">
        <div className="space-y-6">
          {/* Booking details */}
          <DetailCard
            title="Booking Details"
            desktopTitle="Booking Meeting Logistics"
          >
            <DetailRow
              label="Service"
              desktopLabel="Service Type"
              value={booking.service}
            />

            <DetailRow
              label="Date"
              desktopLabel="Scheduled Date"
              value={booking.date.split(" ").slice(0, 3).join(" ")}
            />

            <DetailRow
              label="Time"
              desktopLabel="Meeting Time Slot"
              value="10:00 AM - 11:00 AM"
            />

            <DetailRow label="Duration" value={booking.duration} mobileOnly />

            <DetailRow
              label="Location"
              desktopLabel="Meeting Location"
              value={booking.location}
              valueClassName="md:text-indigo-600"
            />

            <div className="pt-3">
              <p className="text-sm text-slate-500">
                <span className="md:hidden">Customer Notes</span>

                <span className="hidden md:inline">Client Special Notes</span>
              </p>

              <p className="mt-1 text-sm text-slate-700">{booking.notes}</p>
            </div>
          </DetailCard>

          {/* Customer */}
          <section className="rounded-lg border border-slate-200 bg-white p-4 md:p-5">
            <h3 className="mb-3 font-semibold">
              <span className="md:hidden">Customer Profile</span>

              <span className="hidden md:inline">Customer Overview</span>
            </h3>

            {/* Mobile */}
            <div className="md:hidden">
              <DetailRow label="Name" value={booking.customerName} />

              <DetailRow label="Email" value={booking.customerEmail} />

              <DetailRow label="Phone" value={booking.customerPhone} />

              <DetailRow
                label="Previous Bookings"
                value={`${booking.previousBookings} bookings completed`}
                valueClassName="text-indigo-600"
                last
              />
            </div>

            {/* Desktop */}
            <div className="hidden items-center md:flex">
              <Image
                src={booking.customerImage}
                alt={booking.customerName}
                width={42}
                height={42}
                className="size-10 rounded-full object-cover"
              />

              <div className="ml-3">
                <p className="text-sm font-semibold">{booking.customerName}</p>

                <p className="text-xs text-slate-500">
                  {booking.customerEmail}
                </p>
              </div>

              <p className="ml-auto text-sm text-slate-500">
                {booking.previousBookings} Total Bookings Completed
              </p>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          {/* Payment */}
          <section className="rounded-lg border border-slate-200 bg-white p-4 md:p-5">
            <h3 className="mb-3 font-semibold">
              <span className="md:hidden">Payment Information</span>

              <span className="hidden md:inline">Payment Ledger Breakdown</span>
            </h3>

            <DetailRow
              label="Amount"
              desktopLabel="Billing Amount"
              value={formatMoney(booking.amount)}
            />

            <DetailRow
              label="Payment Status"
              value="Paid"
              valueClassName="text-emerald-700"
            />

            <DetailRow
              label="Method"
              value="Invoiced (Credit Card)"
              mobileOnly
            />

            <DetailRow
              label="Invoice"
              desktopLabel="Invoice Link"
              value={`#${booking.invoiceId}`}
              valueClassName="text-indigo-600"
              last
            />
          </section>

          {/* Logs */}
          <section className="rounded-lg border border-slate-200 bg-white p-4 md:p-5">
            <h3 className="mb-4 font-semibold">
              <span className="md:hidden">Booking Log</span>

              <span className="hidden md:inline">Booking Lifecycle Logs</span>
            </h3>

            <div className="space-y-5">
              <TimelineItem
                title="Automated Reminder Sent"
                desktopTitle="Confirmation Sent"
                description="SMS and Email dispatch verified."
                desktopDescription="Outlook invite dispatched"
                time="Today, 09:00 AM"
              />

              <TimelineItem
                success
                title="Booking Confirmed"
                desktopTitle="Status Set to Confirmed"
                description="Consultant accepted session invitation."
                desktopDescription="Consultant assigned automatically"
                time="Oct 1, 11:15 AM"
              />

              <TimelineItem
                title="Booking Created"
                description="Checkout verified via transaction."
                desktopDescription="Client self-service reservation"
                time="Oct 1, 10:33 AM"
                last
              />
            </div>
          </section>
        </div>
      </div>
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
  valueClassName = "",
  mobileOnly = false,
  last = false,
}: {
  label: string;
  desktopLabel?: string;
  value: string;
  valueClassName?: string;
  mobileOnly?: boolean;
  last?: boolean;
}) {
  return (
    <div
      className={`${mobileOnly ? "md:hidden" : ""} grid grid-cols-[125px_1fr] gap-3 py-2.5 text-sm md:grid-cols-[190px_1fr] ${
        last ? "" : "border-b border-slate-200"
      }`}
    >
      <span className="text-slate-500">
        <span className={desktopLabel ? "md:hidden" : ""}>{label}</span>

        {desktopLabel && (
          <span className="hidden md:inline">{desktopLabel}</span>
        )}
      </span>

      <span
        className={`text-right font-medium ${
          valueClassName || "text-slate-900"
        }`}
      >
        {value}
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
    <div className="relative pl-8">
      <div
        className={`absolute left-0 top-0 flex size-5 items-center justify-center rounded-full ${
          success
            ? "bg-emerald-100 text-emerald-600"
            : "bg-indigo-50 text-indigo-600"
        }`}
      >
        {success ? (
          <Check className="size-3.5" />
        ) : (
          <span className="size-2 rounded-full bg-indigo-600" />
        )}
      </div>

      {!last && (
        <div className="absolute left-[9px] top-5 h-[calc(100%+20px)] w-px bg-slate-200" />
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

function BookingDetailLoading() {
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

function BookingError({
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

function formatMoney(amount: number) {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

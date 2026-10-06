"use client";

import Image from "next/image";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { useParams } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/StatusBadge";
import { useUser } from "@/hooks/queries";

export default function UserDetailPage() {
  const params = useParams<{ id: string }>();

  const userId = Number(params.id);

  const { data: user, isLoading, isError, refetch } = useUser(userId);

  if (!Number.isInteger(userId) || userId <= 0) {
    return <UserError message="Invalid user ID" />;
  }

  if (isLoading) {
    return <UserDetailLoading />;
  }

  if (isError || !user) {
    return <UserError message="Unable to load this user" onRetry={refetch} />;
  }

  const recentActivity = [
    {
      title: "Logged in from Chrome / macOS",
      description: "IP: 192.168.1.45",
      time: "10 mins ago",
    },
    {
      title: "Updated security settings",
      description: "Changed master recovery email",
      time: "2 hours ago",
    },
    {
      title: "Approved transaction #TXN-7823",
      description: "Value $245.00 approved manually",
      time: "1 day ago",
    },
  ];

  return (
    <div className="mx-auto max-w-[1440px] p-4 md:p-8">
      {/* Desktop breadcrumb */}
      <div className="mb-6 hidden items-center gap-2 text-sm md:flex">
        <Link href="/users" className="text-slate-500 hover:text-indigo-600">
          Users
        </Link>

        <span className="text-slate-400">/</span>

        <span className="font-medium text-slate-900">{user.name}</span>
      </div>

      {/* Profile summary */}
      <section className="rounded-lg border border-slate-200 bg-white p-5 md:flex md:items-center md:justify-between md:p-6">
        <div className="flex flex-col items-center text-center md:flex-row md:text-left">
          <Image
            src={user.image}
            alt={user.name}
            width={72}
            height={72}
            className="size-[72px] rounded-full object-cover"
          />

          <div className="mt-3 md:ml-5 md:mt-0">
            <div className="flex flex-col items-center gap-2 md:flex-row">
              <h2 className="text-2xl font-semibold text-slate-900">
                {user.name}
              </h2>

              <div className="flex gap-2">
                <StatusBadge status={user.status} />

                <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700 md:hidden">
                  {user.role}
                </span>

                <span className="hidden rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700 md:inline-flex">
                  Confirmed
                </span>
              </div>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              {user.email}
              <span className="hidden md:inline">
                {" "}
                • Joined {user.joinedDate}
              </span>
            </p>
          </div>
        </div>

        {/* Desktop actions */}
        <div className="hidden gap-3 md:flex">
          <button
            type="button"
            className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-600"
          >
            <Pencil className="size-4" />
            Edit Profile
          </button>

          <button
            type="button"
            className="h-10 rounded-lg bg-red-100 px-5 text-sm font-medium text-red-700"
          >
            Suspend User
          </button>
        </div>
      </section>

      {/* Mobile actions */}
      <div className="mt-4 grid grid-cols-2 gap-3 md:hidden">
        <button
          type="button"
          className="h-10 rounded-lg bg-indigo-600 text-sm font-medium text-white"
        >
          Edit Profile
        </button>

        <button
          type="button"
          className="h-10 rounded-lg border border-red-600 bg-white text-sm font-medium text-red-700"
        >
          Suspend User
        </button>
      </div>

      {/* Main information */}
      <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1.8fr)_minmax(300px,1fr)]">
        <div className="space-y-6">
          <InfoCard title="Personal Information">
            <InfoRow label="Full Name" value={user.name} />

            <InfoRow
              label="Email"
              desktopLabel="Email Address"
              value={user.email}
            />

            <InfoRow
              label="Phone"
              desktopLabel="Phone Number"
              value={user.phone}
            />

            <InfoRow label="Date of Birth" value={user.birthDate} />

            <InfoRow
              label="Address"
              desktopLabel="Mailing Address"
              value={user.address}
              last
            />
          </InfoCard>

          <InfoCard title="Account Details" desktopTitle="Account Information">
            <InfoRow
              label="User ID"
              value={`#USR-${String(user.id).padStart(4, "0")}`}
            />

            <InfoRow label="Joined Date" value={user.joinedDate} />

            <InfoRow
              label="Last Login"
              desktopLabel="Last Login Activity"
              value={user.lastActive}
            />

            <div className="md:hidden">
              <InfoRow label="Role" value={user.role} />
            </div>

            <InfoRow
              label="2FA Status"
              desktopLabel="Two-Factor Security"
              value={user.twoFactorEnabled ? "Enabled" : "Disabled"}
              valueClassName={
                user.twoFactorEnabled ? "text-emerald-700" : "text-red-600"
              }
              last
            />
          </InfoCard>
        </div>

        {/* Activity */}
        <section className="rounded-lg border border-slate-200 bg-white p-4 md:p-5">
          <h3 className="mb-4 font-semibold text-slate-900">
            <span className="md:hidden">Recent Activity</span>

            <span className="hidden md:inline">Recent Activity Log</span>
          </h3>

          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <ActivityItem key={activity.title} {...activity} />
            ))}

            {/* Two additional rows on desktop like Figma */}
            <div className="hidden md:block">
              <ActivityItem
                title="Completed transaction #TXN-7823"
                description="Direct invoice payment received"
                time="Sep 27, 2024"
              />
            </div>

            <div className="hidden md:block">
              <ActivityItem
                title="Updated profile photo"
                description="Refreshed corporate portrait"
                time="Sep 15, 2024"
              />
            </div>
          </div>
        </section>
      </div>

      {/* Bottom desktop/mobile data */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white p-4 md:p-5">
          <h3 className="mb-3 font-semibold">
            {user.name.split(" ")[0]}&apos;s Recent Transactions
          </h3>

          <div className="hidden grid-cols-[1fr_100px_110px_120px] rounded-md bg-slate-50 px-3 py-3 text-xs font-medium uppercase text-slate-500 md:grid">
            <span>ID</span>
            <span>Amount</span>
            <span>Status</span>
            <span>Date</span>
          </div>

          <TransactionRow id="TXN-7823" amount="$245.00" date="Oct 1, 2024" />

          <TransactionRow id="TXN-6912" amount="$120.00" date="Sep 14, 2024" />
        </section>

        {/* Figma hides recent bookings on mobile */}
        <section className="hidden rounded-lg border border-slate-200 bg-white p-5 md:block">
          <h3 className="mb-3 font-semibold">
            {user.name.split(" ")[0]}&apos;s Recent Bookings
          </h3>

          <div className="grid grid-cols-[100px_1fr_110px_120px] rounded-md bg-slate-50 px-3 py-3 text-xs font-medium uppercase text-slate-500">
            <span>ID</span>
            <span>Service</span>
            <span>Status</span>
            <span>Date & Time</span>
          </div>

          <BookingRow
            id="BKG-2341"
            service="Consultation"
            status="Confirmed"
            date="Oct 15, 14:00"
          />

          <BookingRow
            id="BKG-1980"
            service="Executive Coaching"
            status="Completed"
            date="Sep 01, 10:30"
          />
        </section>
      </div>
    </div>
  );
}

function InfoCard({
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

function InfoRow({
  label,
  desktopLabel,
  value,
  valueClassName = "",
  last = false,
}: {
  label: string;
  desktopLabel?: string;
  value: string;
  valueClassName?: string;
  last?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-[120px_1fr] gap-3 py-2.5 text-sm md:grid-cols-[180px_1fr] ${
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

function ActivityItem({
  title,
  description,
  time,
}: {
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="relative pl-5">
      <span className="absolute left-0 top-1.5 size-2.5 rounded-full bg-indigo-600" />

      <span className="absolute bottom-[-18px] left-[4px] top-4 w-px bg-slate-200 last:hidden" />

      <p className="text-sm font-medium text-slate-900">{title}</p>

      <p className="text-xs text-slate-500">{description}</p>

      <p className="text-xs text-slate-400">{time}</p>
    </div>
  );
}

function TransactionRow({
  id,
  amount,
  date,
}: {
  id: string;
  amount: string;
  date: string;
}) {
  return (
    <div className="grid grid-cols-[1fr_90px] items-center border-b border-slate-200 py-3 text-sm last:border-0 md:grid-cols-[1fr_100px_110px_120px] md:px-3">
      <div>
        <p className="font-medium">#{id}</p>

        <p className="text-xs text-slate-500 md:hidden">{date}</p>
      </div>

      <span className="text-right font-semibold md:text-left">{amount}</span>

      <div className="hidden md:block">
        <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
          Success
        </span>
      </div>

      <span className="hidden text-slate-500 md:block">{date}</span>
    </div>
  );
}

function BookingRow({
  id,
  service,
  status,
  date,
}: {
  id: string;
  service: string;
  status: "Confirmed" | "Completed";
  date: string;
}) {
  return (
    <div className="grid grid-cols-[100px_1fr_110px_120px] items-center border-b border-slate-200 px-3 py-3 text-sm last:border-0">
      <span className="font-medium">#{id}</span>

      <span>{service}</span>

      <div>
        <StatusBadge status={status} />
      </div>

      <span className="text-slate-500">{date}</span>
    </div>
  );
}

function UserDetailLoading() {
  return (
    <div className="mx-auto max-w-[1440px] space-y-6 p-4 md:p-8">
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="size-16 rounded-full" />

          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-64 rounded-lg" />
        <Skeleton className="h-64 rounded-lg" />
      </div>
    </div>
  );
}

function UserError({
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

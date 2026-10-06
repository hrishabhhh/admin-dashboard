import Link from "next/link";
import {
  ArrowRightLeft,
  CalendarDays,
  DollarSign,
  Eye,
  Users,
} from "lucide-react";

import { RevenueChart } from "@/components/RevenueChart";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";

const transactions = [
  {
    id: "TXN-1082",
    name: "Albert Flores",
    amount: "$150.00",
    date: "Oct 1, 2024",
    status: "Completed" as const,
    initials: "AF",
  },
  {
    id: "TXN-1081",
    name: "Jenny Wilson",
    amount: "$2,350.00",
    date: "Sep 30, 2024",
    status: "Pending" as const,
    initials: "JW",
  },
  {
    id: "TXN-1079",
    name: "Guy Hawkins",
    amount: "$85.00",
    date: "Sep 28, 2024",
    status: "Failed" as const,
    initials: "GH",
  },
  {
    id: "TXN-1078",
    name: "Esther Howard",
    amount: "$1,200.00",
    date: "Sep 27, 2024",
    status: "Completed" as const,
    initials: "EH",
  },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-[1440px] p-4 md:p-8">
      {/* Mobile heading */}
      <div className="mb-4 md:hidden">
        <h1 className="text-xl font-semibold text-slate-900">
          Welcome back, Sarah
        </h1>

        <p className="text-sm text-slate-500">Tuesday, October 1, 2024</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-slate-200 md:gap-6">
        {["Overview", "Analytics", "Reports", "Settings"].map((tab, index) => (
          <button
            key={tab}
            type="button"
            className={
              index === 0
                ? "border-b-2 border-indigo-600 px-4 py-3 text-sm font-medium text-indigo-600"
                : "hidden px-4 py-3 text-sm text-slate-500 md:block"
            }
          >
            {tab}
          </button>
        ))}

        <button
          type="button"
          className="rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-600 md:hidden"
        >
          Analytics
        </button>

        <button
          type="button"
          className="rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-600 md:hidden"
        >
          Reports
        </button>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <StatCard
          title="Total Users"
          value="12,847"
          change="12.5%"
          trend="up"
          icon={Users}
        />

        <StatCard
          title="Total Revenue"
          value="$284,392"
          change="8.2%"
          trend="up"
          icon={DollarSign}
        />

        <StatCard
          title="Active Bookings"
          value="1,234"
          change="3.1%"
          trend="down"
          icon={CalendarDays}
        />

        <StatCard
          title="Pending Transactions"
          value="89"
          change="24.6%"
          trend="up"
          icon={ArrowRightLeft}
        />
      </div>

      {/* Main dashboard grid */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,2fr)_360px]">
        <div className="space-y-6">
          <RevenueChart />

          {/* Recent transactions */}
          <section className="rounded-lg border border-slate-200 bg-white p-4 md:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">
                Recent Transactions
              </h2>

              <Link
                href="/transactions"
                className="text-sm font-medium text-indigo-600 md:hidden"
              >
                View All
              </Link>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block">
              <div className="grid grid-cols-[120px_1fr_120px_120px_130px_50px] rounded-md bg-slate-50 px-3 py-3 text-xs font-medium uppercase text-slate-500">
                <span>Transaction ID</span>
                <span>User</span>
                <span>Amount</span>
                <span>Status</span>
                <span>Date</span>
                <span />
              </div>

              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="grid grid-cols-[120px_1fr_120px_120px_130px_50px] items-center border-b border-slate-200 px-3 py-3 text-sm last:border-0"
                >
                  <span className="font-medium">#{transaction.id}</span>

                  <div className="flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center rounded-full bg-slate-200 text-[10px] font-semibold">
                      {transaction.initials}
                    </div>

                    <span>{transaction.name}</span>
                  </div>

                  <span className="font-medium">{transaction.amount}</span>

                  <div>
                    <StatusBadge status={transaction.status} />
                  </div>

                  <span className="text-slate-500">{transaction.date}</span>

                  <Eye className="size-4 text-slate-500" />
                </div>
              ))}
            </div>

            {/* Mobile cards */}
            <div className="space-y-2 md:hidden">
              {transactions.slice(0, 3).map((transaction) => (
                <Link
                  key={transaction.id}
                  href={`/transactions/${transaction.id}`}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold">
                      {transaction.initials}
                    </div>

                    <div>
                      <p className="text-sm font-medium">{transaction.name}</p>

                      <p className="text-xs text-slate-500">
                        #{transaction.id} • {transaction.date}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      {transaction.amount}
                    </p>

                    <StatusBadge status={transaction.status} />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-4 font-semibold">System Alerts</h2>

            <div className="space-y-4">
              <Alert
                color="bg-red-500"
                title="Server capacity at 92%"
                description="Scale resources"
                time="2 hours ago"
              />

              <Alert
                color="bg-amber-500"
                title="15 transactions pending"
                description="Pending review"
                time="5 hours ago"
              />

              <Alert
                color="bg-blue-500"
                title="System maintenance scheduled"
                description="Scheduled for Oct 5"
                time="Yesterday"
              />
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-4 font-semibold">System Health</h2>

            <div className="space-y-3 text-sm">
              <HealthRow label="Uptime" value="99.8%" />
              <HealthRow label="Avg Response Time" value="142ms" />
              <HealthRow label="Active Sessions" value="3,241" desktopOnly />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Alert({
  color,
  title,
  description,
  time,
}: {
  color: string;
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="flex gap-3">
      <span className={`mt-1.5 size-2 shrink-0 rounded-full ${color}`} />

      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-slate-500">{description}</p>
        <p className="text-xs text-slate-400">{time}</p>
      </div>
    </div>
  );
}

function HealthRow({
  label,
  value,
  desktopOnly = false,
}: {
  label: string;
  value: string;
  desktopOnly?: boolean;
}) {
  return (
    <div
      className={
        desktopOnly
          ? "hidden items-center justify-between border-b border-slate-100 pb-2 last:border-0 md:flex"
          : "flex items-center justify-between border-b border-slate-100 pb-2 last:border-0"
      }
    >
      <span className="text-slate-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

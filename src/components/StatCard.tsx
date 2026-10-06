import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
};

export function StatCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
}: StatCardProps) {
  const positive = trend === "up";

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-5 flex items-start justify-between">
        <p className="text-sm text-slate-500">{title}</p>

        <div className="flex size-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
          <Icon className="size-4" />
        </div>
      </div>

      <p className="text-2xl font-semibold text-slate-900">{value}</p>

      <div className="mt-1 flex items-center gap-1 text-xs">
        <span
          className={
            positive
              ? "rounded bg-emerald-100 px-1.5 py-0.5 font-medium text-emerald-700"
              : "rounded bg-red-100 px-1.5 py-0.5 font-medium text-red-600"
          }
        >
          {positive ? "↑" : "↓"} {change}
        </span>

        <span className="text-slate-400">vs last month</span>
      </div>
    </div>
  );
}

"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { month: "Apr", revenue: 80000 },
  { month: "May", revenue: 150000 },
  { month: "Jun", revenue: 110000 },
  { month: "Jul", revenue: 240000 },
  { month: "Aug", revenue: 200000 },
  { month: "Sep", revenue: 310000 },
];

export function RevenueChart() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 md:p-5">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Revenue Overview</h2>

          <p className="text-xs text-slate-500">Apr 2024 – Sep 2024</p>
        </div>

        <div className="hidden gap-1 md:flex">
          {["7D", "1M", "3M", "6M", "1Y"].map((range) => (
            <button
              key={range}
              type="button"
              className={
                range === "6M"
                  ? "rounded-md bg-slate-100 px-3 py-1 text-xs font-medium text-slate-900"
                  : "rounded-md px-3 py-1 text-xs text-slate-500"
              }
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden h-[220px] md:block">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.12} />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="#e2e8f0"
            />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              width={52}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              tickFormatter={(value) => `$${value / 1000}K`}
            />

            <Tooltip />

            <Area
              type="linear"
              dataKey="revenue"
              stroke="#4f46e5"
              strokeWidth={2}
              fill="url(#revenueFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Mobile */}
      <div className="flex h-28 items-end gap-3 md:hidden">
        {data.map((item) => (
          <div
            key={item.month}
            className="flex flex-1 flex-col items-center gap-2"
          >
            <div className="flex h-20 w-full items-end">
              <div
                className="w-full rounded-t bg-indigo-500"
                style={{
                  height: `${(item.revenue / 310000) * 100}%`,
                }}
              />
            </div>

            <span className="text-[10px] text-slate-400">{item.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

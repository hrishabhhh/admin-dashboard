"use client";

import { Bell, Search } from "lucide-react";
import { usePathname } from "next/navigation";

function getPageTitle(pathname: string) {
  if (/^\/users\/[^/]+$/.test(pathname)) {
    return "User Directory";
  }

  if (pathname.startsWith("/users")) {
    return "User Management";
  }

  if (/^\/transactions\/[^/]+$/.test(pathname)) {
    return "Transactions Log";
  }

  if (pathname.startsWith("/transactions")) {
    return "Transactions Ledger";
  }

  if (/^\/bookings\/[^/]+$/.test(pathname)) {
    return "Booking Management";
  }

  if (pathname.startsWith("/bookings")) {
    return "Bookings";
  }

  return "Welcome back, Sarah";
}

export function Header() {
  const pathname = usePathname();

  return (
    <header className="hidden h-[70px] items-center justify-between border-b border-slate-200 bg-white px-8 md:flex">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">
          {getPageTitle(pathname)}
        </h1>

        <p className="text-sm text-slate-500">Tuesday, October 1, 2024</p>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search console..."
            className="h-9 w-60 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500"
          />
        </div>

        <button
          type="button"
          className="relative flex size-10 items-center justify-center rounded-full border border-slate-200 text-slate-600"
          aria-label="Notifications"
        >
          <Bell className="size-5" />

          <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
            3
          </span>
        </button>

        <div className="flex size-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
          SJ
        </div>
      </div>
    </header>
  );
}

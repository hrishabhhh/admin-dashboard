"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  LayoutGrid,
  Users,
  ArrowRightLeft,
  Settings,
} from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutGrid,
  },
  {
    label: "Users",
    href: "/users",
    icon: Users,
  },
  {
    label: "Transactions",
    href: "/transactions",
    icon: ArrowRightLeft,
  },
  {
    label: "Bookings",
    href: "/bookings",
    icon: CalendarDays,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col bg-slate-800 text-white md:flex">
      <div className="flex h-[70px] items-center gap-3 px-4">
        <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-600">
          <Settings className="size-5" />
        </div>

        <span className="text-xl font-semibold">AdminHub</span>
      </div>

      <nav className="flex-1 space-y-1 px-4 pt-3">
        {navItems.map((item) => {
          const Icon = item.icon;

          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                active
                  ? "bg-slate-700 text-white"
                  : "text-slate-400 hover:bg-slate-700/60 hover:text-white",
              )}
            >
              <Icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mx-4 border-t border-slate-700 py-5">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
            SJ
          </div>

          <div>
            <p className="text-sm font-medium text-white">Sarah Jenkins</p>
            <p className="text-xs text-slate-400">Super Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

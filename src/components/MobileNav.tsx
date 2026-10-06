"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  LayoutGrid,
  UserRound,
  Users,
  ArrowRightLeft,
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
    label: "Transaction",
    href: "/transactions",
    icon: ArrowRightLeft,
  },
  {
    label: "Bookings",
    href: "/bookings",
    icon: CalendarDays,
  },
  {
    label: "Profile",
    href: "/users/1",
    icon: UserRound,
  },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid h-[70px] grid-cols-5 border-t border-slate-200 bg-white md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;

        const active =
          item.label === "Profile"
            ? pathname.startsWith("/users/") && pathname !== "/users"
            : item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 text-[10px]",
              active ? "text-indigo-600" : "text-slate-400",
            )}
          >
            <Icon className="size-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

"use client";

import Link from "next/link";
import {
  ArrowRightLeft,
  CalendarDays,
  LayoutGrid,
  Settings,
  Users,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { closeMobileMenu } from "@/store/uiSlice";

import type { AppDispatch, RootState } from "@/store/store";

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

export function MobileMenu() {
  const dispatch = useDispatch<AppDispatch>();

  const open = useSelector((state: RootState) => state.ui.mobileMenuOpen);

  return (
    <Sheet
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          dispatch(closeMobileMenu());
        }
      }}
    >
      <SheetContent
        side="left"
        className="w-64 border-none bg-slate-800 p-4 text-white"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3 text-white">
            <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-600">
              <Settings className="size-5" />
            </span>
            AdminHub
          </SheetTitle>
        </SheetHeader>

        <nav className="mt-8 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => dispatch(closeMobileMenu())}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                <Icon className="size-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

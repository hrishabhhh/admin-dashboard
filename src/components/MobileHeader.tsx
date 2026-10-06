"use client";

import { Bell, Menu, Settings, ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import { openMobileMenu } from "@/store/uiSlice";
import type { AppDispatch } from "@/store/store";

function getDetailTitle(pathname: string) {
  if (/^\/users\/[^/]+$/.test(pathname)) {
    return "User Detail";
  }

  if (/^\/transactions\/[^/]+$/.test(pathname)) {
    return "Transaction Detail";
  }

  if (/^\/bookings\/[^/]+$/.test(pathname)) {
    return "Booking Detail";
  }

  return null;
}

export function MobileHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const detailTitle = getDetailTitle(pathname);

  if (detailTitle) {
    return (
      <header className="sticky top-0 z-40 flex h-14 items-center border-b border-slate-200 bg-white px-4 md:hidden">
        <button
          type="button"
          onClick={() => router.back()}
          className="mr-4 flex size-8 items-center justify-center"
          aria-label="Go back"
        >
          <ArrowLeft className="size-5" />
        </button>

        <h1 className="font-semibold text-slate-900">{detailTitle}</h1>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 md:hidden">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => dispatch(openMobileMenu())}
          aria-label="Open navigation"
        >
          <Menu className="size-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-md bg-indigo-600 text-white">
            <Settings className="size-4" />
          </div>

          <span className="font-semibold text-slate-900">AdminHub</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="relative flex size-8 items-center justify-center rounded-full border border-slate-200"
          aria-label="Notifications"
        >
          <Bell className="size-4 text-slate-600" />

          <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-semibold text-white">
            3
          </span>
        </button>

        <div className="flex size-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
          SJ
        </div>
      </div>
    </header>
  );
}

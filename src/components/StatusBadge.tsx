import { cn } from "@/lib/utils";

type Status =
  | "Completed"
  | "Pending"
  | "Failed"
  | "Active"
  | "Inactive"
  | "Suspended"
  | "Confirmed"
  | "Cancelled"
  | "Refunded";

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-1 text-xs font-medium",

        (status === "Completed" ||
          status === "Active" ||
          status === "Confirmed") &&
          "bg-emerald-100 text-emerald-700",

        (status === "Pending" || status === "Inactive") &&
          "bg-amber-100 text-amber-700",

        (status === "Failed" ||
          status === "Cancelled" ||
          status === "Suspended") &&
          "bg-red-100 text-red-700",

        status === "Refunded" && "bg-slate-100 text-slate-600",
      )}
    >
      {status}
    </span>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";

import { StatusBadge } from "@/components/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { useUsers } from "@/hooks/queries";

import type { AdminUser, UserRole, UserStatus } from "@/types";

type RoleFilter = "All" | UserRole;

type StatusFilter = "All" | UserStatus;

export default function UsersPage() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");

  const [role, setRole] = useState<RoleFilter>("All");

  const [status, setStatus] = useState<StatusFilter>("All");

  const [selectedIds, setSelectedIds] = useState<number[]>([1, 2]);

  const deferredSearch = useDeferredValue(search);

  const { data, isLoading, isError, isFetching, refetch } = useUsers(
    page,
    deferredSearch,
  );

  const users = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.users.filter((user) => {
      const matchesRole = role === "All" || user.role === role;

      const matchesStatus = status === "All" || user.status === status;

      return matchesRole && matchesStatus;
    });
  }, [data, role, status]);

  const totalPages = data ? Math.ceil(data.total / data.limit) : 1;

  function toggleUser(id: number) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((userId) => userId !== id)
        : [...current, id],
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] p-4 md:p-8">
      {/* Mobile page heading */}
      <div className="mb-4 md:hidden">
        <h1 className="text-xl font-semibold">User Management</h1>

        <p className="text-sm text-slate-500">
          Manage registered application users
        </p>
      </div>

      {/* Desktop page heading */}
      <div className="mb-6 hidden items-start justify-between md:flex">
        <div>
          <h2 className="text-2xl font-semibold">Users Directory</h2>

          <p className="text-sm text-slate-500">
            Manage all registered users in your application
          </p>
        </div>

        <button className="flex h-10 items-center gap-2 rounded-lg bg-indigo-600 px-5 text-sm font-medium text-white hover:bg-indigo-700">
          <Plus className="size-4" />
          Add User
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        <SmallStat
          title="Total Users"
          value={data?.total.toLocaleString() ?? "—"}
        />

        <SmallStat
          title="Active"
          value={data ? Math.round(data.total * 0.8).toLocaleString() : "—"}
        />

        <SmallStat
          title="New This Mo"
          value={data ? Math.round(data.total * 0.066).toLocaleString() : "—"}
        />
      </div>

      {/* Filters */}
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1 md:max-w-[280px]">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search users by name or email..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={role}
            onChange={(event) => setRole(event.target.value as RoleFilter)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none"
          >
            <option value="All">Role: All</option>
            <option value="Admin">Admin</option>
            <option value="Editor">Editor</option>
            <option value="Viewer">Viewer</option>
          </select>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as StatusFilter)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none"
          >
            <option value="All">Status: All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Suspended">Suspended</option>
          </select>

          <select className="ml-auto hidden h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none md:block">
            <option>Date Joined</option>
            <option>Name</option>
            <option>Last Active</option>
          </select>
        </div>
      </div>

      {/* Mobile Add User */}
      <button className="mt-4 h-10 w-full rounded-lg bg-indigo-600 text-sm font-medium text-white md:hidden">
        Add New User
      </button>

      {/* Bulk selection */}
      {selectedIds.length > 0 && (
        <div className="mt-6 hidden items-center justify-between rounded-lg border border-indigo-500 bg-indigo-50 px-4 py-3 md:flex">
          <div className="flex items-center gap-2 text-sm font-medium text-indigo-600">
            <Check className="size-4" />
            {selectedIds.length} users selected
          </div>

          <div className="flex gap-3">
            <button className="rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-medium">
              Change Role
            </button>

            <button className="rounded-md border border-red-200 bg-white px-4 py-2 text-xs font-medium text-red-600">
              Suspend Accounts
            </button>
          </div>
        </div>
      )}

      <div className="mt-6">
        {isLoading ? (
          <UsersLoading />
        ) : isError ? (
          <UsersError onRetry={refetch} />
        ) : users.length === 0 ? (
          <UsersEmpty />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden rounded-lg border border-slate-200 bg-white p-5 md:block">
              <div className="grid grid-cols-[40px_1.8fr_1fr_1fr_1fr_1.2fr_100px] rounded-md bg-slate-50 px-3 py-3 text-xs font-medium uppercase text-slate-500">
                <span />

                <span>User</span>
                <span>Role</span>
                <span>Status</span>
                <span>Join Date</span>
                <span>Last Active</span>
                <span>Actions</span>
              </div>

              {users.map((user) => (
                <DesktopUserRow
                  key={user.id}
                  user={user}
                  selected={selectedIds.includes(user.id)}
                  onToggle={() => toggleUser(user.id)}
                />
              ))}

              <Pagination
                page={page}
                total={data?.total ?? 0}
                totalPages={totalPages}
                loading={isFetching}
                onPrevious={() =>
                  setPage((current) => Math.max(current - 1, 1))
                }
                onNext={() =>
                  setPage((current) => Math.min(current + 1, totalPages))
                }
              />
            </div>

            {/* Mobile cards */}
            <div className="space-y-3 md:hidden">
              {users.slice(0, 5).map((user) => (
                <MobileUserCard key={user.id} user={user} />
              ))}

              <Pagination
                page={page}
                total={data?.total ?? 0}
                totalPages={totalPages}
                loading={isFetching}
                onPrevious={() =>
                  setPage((current) => Math.max(current - 1, 1))
                }
                onNext={() =>
                  setPage((current) => Math.min(current + 1, totalPages))
                }
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SmallStat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 md:p-4">
      <p className="text-[11px] text-slate-500 md:text-sm">{title}</p>

      <p className="mt-1 text-base font-semibold md:text-xl">{value}</p>
    </div>
  );
}

function DesktopUserRow({
  user,
  selected,
  onToggle,
}: {
  user: AdminUser;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="grid grid-cols-[40px_1.8fr_1fr_1fr_1fr_1.2fr_100px] items-center border-b border-slate-200 px-3 py-3 text-sm last:border-b-0">
      <input
        type="checkbox"
        checked={selected}
        onChange={onToggle}
        className="size-4 accent-indigo-600"
      />

      <Link href={`/users/${user.id}`} className="flex items-center gap-3">
        <Image
          src={user.image}
          alt={user.name}
          width={36}
          height={36}
          className="rounded-full"
        />

        <div className="min-w-0">
          <p className="truncate font-medium">{user.name}</p>

          <p className="truncate text-xs text-slate-500">{user.email}</p>
        </div>
      </Link>

      <RoleBadge role={user.role} />

      <div>
        <StatusBadge status={user.status} />
      </div>

      <span className="text-slate-600">{user.joinedDate}</span>

      <span className="text-slate-600">{user.lastActive}</span>

      <div className="flex gap-3">
        <Link href={`/users/${user.id}`}>
          <Pencil className="size-4 text-slate-600" />
        </Link>

        <button type="button" aria-label={`Delete ${user.name}`}>
          <Trash2 className="size-4 text-red-500" />
        </button>
      </div>
    </div>
  );
}

function MobileUserCard({ user }: { user: AdminUser }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="flex items-start">
        <Link
          href={`/users/${user.id}`}
          className="flex min-w-0 flex-1 items-center gap-3"
        >
          <Image
            src={user.image}
            alt={user.name}
            width={42}
            height={42}
            className="rounded-full"
          />

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user.name}</p>

            <p className="truncate text-xs text-slate-500">{user.email}</p>
          </div>
        </Link>

        <div className="ml-2 flex gap-2">
          <Link
            href={`/users/${user.id}`}
            className="flex size-8 items-center justify-center rounded-full border border-slate-200"
          >
            <Pencil className="size-4 text-slate-600" />
          </Link>

          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-full border border-slate-200"
          >
            <Trash2 className="size-4 text-red-500" />
          </button>
        </div>
      </div>

      <div className="my-3 border-t border-slate-200" />

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <RoleBadge role={user.role} />
          <StatusBadge status={user.status} />
        </div>

        <span className="text-[11px] text-slate-500">
          Active {user.lastActive}
        </span>
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: UserRole }) {
  const styles = {
    Admin: "bg-indigo-100 text-indigo-700",
    Editor: "bg-blue-100 text-blue-700",
    Viewer: "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`inline-flex w-fit rounded-md px-2 py-1 text-xs font-medium ${styles[role]}`}
    >
      {role}
    </span>
  );
}

function Pagination({
  page,
  total,
  totalPages,
  loading,
  onPrevious,
  onNext,
}: {
  page: number;
  total: number;
  totalPages: number;
  loading: boolean;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div className="mt-6 flex items-center justify-between">
      <p className="hidden text-sm text-slate-500 md:block">
        Showing{" "}
        <strong className="text-slate-900">
          {(page - 1) * 8 + 1}-{Math.min(page * 8, total)}
        </strong>{" "}
        of <strong className="text-slate-900">{total.toLocaleString()}</strong>{" "}
        results
      </p>

      <div className="ml-auto flex gap-2">
        <button
          type="button"
          disabled={page === 1 || loading}
          onClick={onPrevious}
          className="rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        <button
          type="button"
          disabled={page >= totalPages || loading}
          onClick={onNext}
          className="rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function UsersLoading() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full" />

            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-52" />
            </div>

            <Skeleton className="h-7 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

function UsersError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-lg border border-red-200 bg-white px-6 py-12 text-center">
      <h3 className="font-semibold">Unable to load users</h3>

      <p className="mt-1 text-sm text-slate-500">
        Something went wrong while fetching user data.
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
      >
        Try Again
      </button>
    </div>
  );
}

function UsersEmpty() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-6 py-12 text-center">
      <h3 className="font-semibold">No users found</h3>

      <p className="mt-1 text-sm text-slate-500">
        Try changing your search or filters.
      </p>
    </div>
  );
}

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Users,
  UserPlus,
  AlertTriangle,
  Calendar,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Pencil,
  Ban,
} from "lucide-react";

import StatCard from "../../../components/admin/StatCard";
import { adminServices } from "../services/adminServices";
import { Modal } from "../../../components/common/Modal";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string[];
  status: "ACTIVE" | "BLOCKED";
  isVerified: boolean;
  profilePhotoUrl?: string;
}

interface PaginatedResult<T> {
  items: T[];
  totalItems: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function UserManagement() {
  const [usersData, setUsersData] = useState<PaginatedResult<User>>({
    items: [],
    totalItems: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [statusUser, setStatusUser] = useState<User | null>(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = async (
    page = 1,
    searchValue = search,
    statusVal = statusFilter,
    verifiedVal = verifiedFilter,
    sortVal = sortOption
  ) => {
    try {
      setLoading(true);

      let sort;
      let sortOrder;
      if (sortVal) {
        const parts = sortVal.split('_');
        sort = parts[0];
        sortOrder = parts[1];
      }

      const response = await adminServices.getAllUsers({
        page,
        limit: usersData.limit,
        search: searchValue,
        status: statusVal || undefined,
        isVerified: verifiedVal || undefined,
        sort,
        sortOrder
      });

      setUsersData(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchUsers(1, "", "", "", "");
  }, []);

  // Search
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchUsers(1, search, statusFilter, verifiedFilter, sortOption);
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);

  // Filters & Sort
  useEffect(() => {
    fetchUsers(1, search, statusFilter, verifiedFilter, sortOption);
  }, [statusFilter, verifiedFilter, sortOption]);

  const handlePreviousPage = () => {
    if (usersData.page <= 1) return;

    fetchUsers(
      usersData.page - 1,
      search,
      statusFilter,
      verifiedFilter,
      sortOption
    );
  };

  const handleNextPage = () => {
    if (usersData.page >= usersData.totalPages) return;

    fetchUsers(
      usersData.page + 1,
      search,
      statusFilter,
      verifiedFilter,
      sortOption
    );
  };

  const updateUserInList = (id: string, update: Partial<User>) => {
    setUsersData((current) => ({
      ...current,
      items: current.items.map((user) => user.id === id ? { ...user, ...update } : user),
    }));
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditPhone(user.phone || "");
  };

  const saveUser = async () => {
    if (!editingUser) return;
    if (editName.trim().length < 2) {
      toast.error("Enter a valid user name");
      return;
    }
    try {
      setIsSubmitting(true);
      await adminServices.updateUser(editingUser.id, { name: editName.trim(), phone: editPhone.trim() || undefined });
      updateUserInList(editingUser.id, { name: editName.trim(), phone: editPhone.trim() || undefined });
      setEditingUser(null);
      toast.success("User details updated successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Unable to update user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateUserStatus = async () => {
    if (!statusUser) return;
    const isBlocking = statusUser.status === "ACTIVE";
    try {
      setIsSubmitting(true);
      if (isBlocking) await adminServices.blockUser(statusUser.id);
      else await adminServices.unblockUser(statusUser.id);
      updateUserInList(statusUser.id, { status: isBlocking ? "BLOCKED" : "ACTIVE" });
      setStatusUser(null);
      toast.success(isBlocking ? "User blocked" : "User unblocked");
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Unable to ${isBlocking ? "block" : "unblock"} user`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const startItem =
    usersData.totalItems === 0
      ? 0
      : (usersData.page - 1) *
      usersData.limit +
      1;

  const endItem = Math.min(
    usersData.page * usersData.limit,
    usersData.totalItems
  );

  return (
    <div className="p-8 bg-slate-50/50 max-h-screen text-slate-700">

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-950 tracking-tight">
          User Management
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Overview and administration of all registered marketplace customers.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

        <StatCard
          icon={
            <Users className="w-5 h-5 text-blue-600" />
          }
          title="TOTAL USERS"
          value={usersData.totalItems.toString()}
          trend="Total"
          trendType="neutral"
          iconBg="bg-blue-50"
        />

        <StatCard
          icon={
            <UserPlus className="w-5 h-5 text-emerald-600" />
          }
          title="ACTIVE USERS"
          value={usersData.items
            .filter(
              (user) =>
                user.status === "ACTIVE"
            )
            .length.toString()}
          trend="Current page"
          trendType="positive"
          iconBg="bg-emerald-50"
        />

        <StatCard
          icon={
            <AlertTriangle className="w-5 h-5 text-rose-600" />
          }
          title="BLOCKED USERS"
          value={usersData.items
            .filter(
              (user) =>
                user.status === "BLOCKED"
            )
            .length.toString()}
          trend="Current page"
          trendType="urgent"
          iconBg="bg-rose-50"
        />

        <StatCard
          icon={
            <Calendar className="w-5 h-5 text-slate-600" />
          }
          title="TOTAL PAGES"
          value={usersData.totalPages.toString()}
          trend="Pagination"
          trendType="neutral"
          iconBg="bg-slate-100"
        />

      </div>

      {/* Content Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

        {/* Search and Filters */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Search */}
          <div className="relative w-full sm:w-96">

            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by name, email, or phone..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />

          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none flex items-center gap-2 pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">Active Users</option>
                <option value="BLOCKED">Blocked Users</option>
              </select>
              <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={verifiedFilter}
                onChange={(e) => setVerifiedFilter(e.target.value)}
                className="appearance-none flex items-center gap-2 pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="">Verifications</option>
                <option value="true">Verified</option>
                <option value="false">Unverified</option>
              </select>
              <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="appearance-none flex items-center gap-2 pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="">Sort by: Default</option>
                <option value="name_asc">Name (A-Z)</option>
                <option value="name_desc">Name (Z-A)</option>
              </select>
              <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

          </div>

        </div>

        {/* Table */}
        <div className="overflow-x-auto">

          <table className="w-full text-left border-collapse">

            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-50/50">

                <th className="py-4 px-6">
                  User Name
                </th>

                <th className="py-4 px-6">
                  Email
                </th>

                <th className="py-4 px-6">
                  Phone
                </th>

                <th className="py-4 px-6">
                  Roles
                </th>

                <th className="py-4 px-6">
                  Account Status
                </th>

                <th className="py-4 px-6 text-right">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-sm">

              {loading ? (

                <tr>
                  <td
                    colSpan={6}
                    className="py-10 text-center text-slate-500"
                  >
                    Loading users...
                  </td>
                </tr>

              ) : usersData.items.length === 0 ? (

                <tr>
                  <td
                    colSpan={6}
                    className="py-10 text-center text-slate-500"
                  >
                    Nothing to show
                  </td>
                </tr>

              ) : (

                usersData.items.map((user) => (

                  <tr
                    key={user.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >

                    {/* User */}
                    <td className="py-4 px-6">

                      <div className="flex items-center gap-3">

                        {user.profilePhotoUrl ? (

                          <img
                            src={user.profilePhotoUrl}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-100"
                          />

                        ) : (

                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                            {user.name
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                        )}

                        <span className="font-semibold text-slate-800">
                          {user.name}
                        </span>

                      </div>

                    </td>

                    {/* Email */}
                    <td className="py-4 px-6 text-slate-500">
                      {user.email}
                    </td>

                    {/* Phone */}
                    <td className="py-4 px-6 text-slate-500">
                      {user.phone || "-"}
                    </td>

                    {/* Roles */}
                    <td className="py-4 px-6">

                      <div className="flex flex-wrap gap-1">

                        {user.role.map((role) => (

                          <span
                            key={role}
                            className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium"
                          >
                            {role}
                          </span>

                        ))}

                      </div>

                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">

                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${user.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-rose-50 text-rose-600"
                          }`}
                      >
                        {user.status}
                      </span>

                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">

                      <div className="flex items-center justify-end gap-2">

                        <button
                          onClick={() => openEdit(user)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setStatusUser(user)}
                          className={`p-2 rounded-lg transition-colors ${user.status === "ACTIVE"
                            ? "text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                            }`}
                          title={
                            user.status === "ACTIVE"
                              ? "Block User"
                              : "Unblock User"
                          }
                        >
                          <Ban className="w-4 h-4" />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50 flex items-center justify-between">

          <p className="text-sm text-gray-500">
            Showing {startItem} to {endItem} of{" "}
            {usersData.totalItems} Users
          </p>

          <div className="flex space-x-1">

            {/* Previous */}
            <button
              onClick={handlePreviousPage}
              disabled={usersData.page <= 1}
              className="px-3 py-1.5 border border-gray-200 rounded-md text-gray-400 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Current Page */}
            <button className="px-3 py-1.5 border border-gray-200 rounded-md text-gray-700 bg-white font-medium text-sm">
              {usersData.page}
            </button>

            {/* Next */}
            <button
              onClick={handleNextPage}
              disabled={
                usersData.page >=
                usersData.totalPages
              }
              className="px-3 py-1.5 border border-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed text-gray-500 bg-white hover:bg-gray-50 cursor-pointer"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

          </div>

        </div>

      </div>

      <Modal isOpen={editingUser !== null} onClose={() => !isSubmitting && setEditingUser(null)} title="Edit User">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">Name
            <input value={editName} onChange={(event) => setEditName(event.target.value)} disabled={isSubmitting} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
          </label>
          <label className="block text-sm font-medium text-slate-700">Phone
            <input value={editPhone} onChange={(event) => setEditPhone(event.target.value)} disabled={isSubmitting} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setEditingUser(null)} disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-slate-600">Cancel</button>
            <button type="button" onClick={saveUser} disabled={isSubmitting} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{isSubmitting ? "Saving..." : "Save changes"}</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={statusUser !== null} onClose={() => !isSubmitting && setStatusUser(null)} title={statusUser?.status === "ACTIVE" ? "Block User" : "Unblock User"}>
        <div className="space-y-5">
          <p className="text-sm text-slate-600">{statusUser?.status === "ACTIVE" ? `Block ${statusUser?.name}? They will no longer be able to access their account.` : `Unblock ${statusUser?.name}? They will regain access to their account.`}</p>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setStatusUser(null)} disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-slate-600">Cancel</button>
            <button type="button" onClick={updateUserStatus} disabled={isSubmitting} className={`rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 ${statusUser?.status === "ACTIVE" ? "bg-rose-600" : "bg-emerald-600"}`}>{isSubmitting ? "Updating..." : statusUser?.status === "ACTIVE" ? "Block user" : "Unblock user"}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

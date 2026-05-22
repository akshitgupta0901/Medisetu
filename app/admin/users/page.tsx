"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/admin/sidebar";
import Topbar from "@/components/admin/topbar";
import { Search, Trash2, ShieldAlert, UserCheck, Loader2 } from "lucide-react";

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/users?search=${search}&role=${roleFilter}`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) fetchUsers();
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  const handleSuspend = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isSuspended: !currentStatus }),
      });
      if (res.ok) fetchUsers();
    } catch (error) {
      console.error("Failed to suspend user:", error);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action is permanent and will delete all related records.")) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      if (res.ok) fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Sidebar />
      <div className="md:ml-[240px]">
        <Topbar />
        <main className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">User Management</h1>
            <div className="flex gap-4">
               <select 
                 value={roleFilter} 
                 onChange={(e) => setRoleFilter(e.target.value)}
                 className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
               >
                 <option value="">All Roles</option>
                 <option value="admin">Admin</option>
                 <option value="doctor">Doctor</option>
                 <option value="patient">Patient</option>
               </select>
            </div>
          </div>

          <form onSubmit={handleSearch} className="relative mb-6">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-teal-500 hover:bg-teal-400 text-slate-950 px-4 py-1.5 rounded-lg text-sm font-semibold transition">
              Search
            </button>
          </form>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            {isLoading ? (
              <div className="p-20 flex justify-center items-center">
                <Loader2 className="w-10 h-10 animate-spin text-teal-400" />
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/50">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">User</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Role</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Joined</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-800/30 transition">
                      <td className="px-6 py-4">
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={user.role}
                          onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                          className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs"
                        >
                          <option value="patient">Patient</option>
                          <option value="doctor">Doctor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        {user.isSuspended ? (
                          <span className="bg-red-500/10 text-red-500 px-2 py-1 rounded-full text-[10px] font-bold uppercase border border-red-500/20">
                            Suspended
                          </span>
                        ) : (
                          <span className="bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full text-[10px] font-bold uppercase border border-emerald-500/20">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleSuspend(user._id, user.isSuspended)}
                            className={`p-2 rounded-lg transition ${
                              user.isSuspended ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" : "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20"
                            }`}
                            title={user.isSuspended ? "Unsuspend" : "Suspend"}
                          >
                            {user.isSuspended ? <UserCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center text-slate-500">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

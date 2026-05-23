"use client";

import { useEffect, useState } from "react";
import AdminPageShell from "@/components/admin/admin-page-shell";
import { authFetch } from "@/lib/fetch-auth";
import { useAuth } from "@/contexts/auth-context";
import type { AdminSystemConfig } from "@/types/admin";

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const [config, setConfig] = useState<AdminSystemConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [profile, setProfile] = useState({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [system, setSystem] = useState<AdminSystemConfig>({
    platformName: "MediSetu AI",
    supportEmail: "support@medisetu.com",
    maxBookingDays: 60,
    maintenanceMode: false,
    allowRegistration: true,
  });

  useEffect(() => {
    if (user) {
      setProfile({ name: user.name, email: user.email });
    }
  }, [user]);

  useEffect(() => {
    authFetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setConfig(data.config);
          setSystem(data.config);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await authFetch("/api/me/settings", {
        method: "PATCH",
        body: JSON.stringify({ name: profile.name, email: profile.email }),
      });
      const data = await res.json();
      setMessage(
        data.success
          ? { type: "success", text: "Profile updated" }
          : { type: "error", text: data.message ?? "Update failed" }
      );
    } catch {
      setMessage({ type: "error", text: "Network error" });
    } finally {
      setSaving(false);
    }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const res = await authFetch("/api/me/settings", {
        method: "PATCH",
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "Password changed" });
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setMessage({ type: "error", text: data.message ?? "Password change failed" });
      }
    } catch {
      setMessage({ type: "error", text: "Network error" });
    } finally {
      setSaving(false);
    }
  }

  async function saveSystem(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await authFetch("/api/admin/settings", {
        method: "PATCH",
        body: JSON.stringify(system),
      });
      const data = await res.json();
      if (data.success) {
        setConfig(data.config);
        setSystem(data.config);
        setMessage({ type: "success", text: data.message ?? "System settings saved" });
      } else {
        setMessage({ type: "error", text: data.message ?? "Save failed" });
      }
    } catch {
      setMessage({ type: "error", text: "Network error" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminPageShell title="Settings" subtitle="Admin profile and system configuration">
      {message && (
        <div
          className={`rounded-xl px-4 py-3 text-sm border ${
            message.type === "success"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-red-500/10 text-red-400 border-red-500/20"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <form
          onSubmit={saveProfile}
          className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4"
        >
          <h2 className="text-lg font-semibold text-white">Admin profile</h2>
          <div>
            <label className="text-xs text-slate-500 uppercase">Name</label>
            <input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              required
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-white text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 uppercase">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              required
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-white text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full py-2 rounded-xl bg-teal-500 text-slate-950 font-semibold text-sm disabled:opacity-50"
          >
            Save profile
          </button>
        </form>

        <form
          onSubmit={savePassword}
          className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4"
        >
          <h2 className="text-lg font-semibold text-white">Change password</h2>
          <input
            type="password"
            placeholder="Current password"
            value={passwordData.currentPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, currentPassword: e.target.value })
            }
            required
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-white text-sm"
          />
          <input
            type="password"
            placeholder="New password"
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, newPassword: e.target.value })
            }
            required
            minLength={6}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-white text-sm"
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={passwordData.confirmPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, confirmPassword: e.target.value })
            }
            required
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-white text-sm"
          />
          <button
            type="submit"
            disabled={saving}
            className="w-full py-2 rounded-xl border border-teal-500/30 text-teal-300 font-semibold text-sm disabled:opacity-50"
          >
            Update password
          </button>
        </form>
      </div>

      <form
        onSubmit={saveSystem}
        className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4"
      >
        <h2 className="text-lg font-semibold text-white">System configuration</h2>
        {loading ? (
          <p className="text-slate-400 text-sm">Loading configuration...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-500 uppercase">Platform name</label>
                <input
                  value={system.platformName}
                  onChange={(e) =>
                    setSystem({ ...system, platformName: e.target.value })
                  }
                  required
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-white text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase">Support email</label>
                <input
                  type="email"
                  value={system.supportEmail}
                  onChange={(e) =>
                    setSystem({ ...system, supportEmail: e.target.value })
                  }
                  required
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-white text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase">Max booking days</label>
                <input
                  type="number"
                  min={1}
                  max={365}
                  value={system.maxBookingDays}
                  onChange={(e) =>
                    setSystem({
                      ...system,
                      maxBookingDays: parseInt(e.target.value, 10) || 60,
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-white text-sm"
                />
              </div>
            </div>
            <label className="flex items-center gap-3 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={system.maintenanceMode}
                onChange={(e) =>
                  setSystem({ ...system, maintenanceMode: e.target.checked })
                }
                className="rounded border-slate-600"
              />
              Maintenance mode
            </label>
            <label className="flex items-center gap-3 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={system.allowRegistration}
                onChange={(e) =>
                  setSystem({ ...system, allowRegistration: e.target.checked })
                }
                className="rounded border-slate-600"
              />
              Allow public registration
            </label>
            {config && (
              <p className="text-xs text-slate-500">
                Last saved configuration is active for new admin sessions.
              </p>
            )}
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-xl bg-teal-500 text-slate-950 font-semibold text-sm disabled:opacity-50"
            >
              Save system settings
            </button>
          </>
        )}
      </form>
    </AdminPageShell>
  );
}

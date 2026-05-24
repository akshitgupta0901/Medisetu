"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/fetch-auth";

type NotificationKey = "email" | "sms" | "browser";

type NotificationPrefs = Record<NotificationKey, boolean>;

const NOTIFICATION_LABELS: Record<
  NotificationKey,
  { label: string; desc: string }
> = {
  email: {
    label: "Email Notifications",
    desc: "Receive appointment, prescription, and account updates by email.",
  },
  sms: {
    label: "SMS Alerts",
    desc: "Get critical care alerts on your mobile phone.",
  },
  browser: {
    label: "Browser Notifications",
    desc: "Show real-time updates while you are using MediSetu.",
  },
};

const DEFAULT_SETTINGS: NotificationPrefs = {
  email: false,
  sms: false,
  browser: false,
};

export default function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationPrefs>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<NotificationKey | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    authFetch("/api/me/settings/notifications")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSettings({ ...DEFAULT_SETTINGS, ...data.settings });
        } else {
          setError(data.message ?? "Failed to load notification settings");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Network error loading notification settings");
        setLoading(false);
      });
  }, []);

  const save = async (key: NotificationKey, value: boolean) => {
    setSavingKey(key);
    setError("");
    setMessage("");
    const newSettings = { ...settings, [key]: value };

    try {
      const res = await authFetch("/api/me/settings/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSettings({ ...DEFAULT_SETTINGS, ...data.settings });
        setMessage("Settings saved");
        setTimeout(() => setMessage(""), 2000);
      } else {
        setError(data.message ?? "Failed to save notification settings");
      }
    } catch {
      setError("Network error saving notification settings");
    }

    setSavingKey(null);
  };

  if (loading) return <div className="text-slate-400">Loading...</div>;

  return (
    <div className="space-y-4">
      {message && <div className="text-emerald-400 text-sm">{message}</div>}
      {error && <div className="text-red-300 text-sm">{error}</div>}
      {(Object.keys(NOTIFICATION_LABELS) as NotificationKey[]).map((key) => {
        const enabled = settings[key];
        const saving = savingKey === key;
        return (
          <div
            key={key}
            className="flex items-center justify-between gap-4 p-4 bg-slate-950 border border-slate-800 rounded-xl"
          >
            <div>
              <p className="font-bold text-white">
                {NOTIFICATION_LABELS[key].label}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {NOTIFICATION_LABELS[key].desc}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={enabled}
              onClick={() => save(key, !enabled)}
              disabled={saving}
              className={`relative h-7 w-14 shrink-0 rounded-full border transition disabled:cursor-not-allowed disabled:opacity-60 ${
                enabled
                  ? "border-teal-300 bg-teal-400"
                  : "border-slate-600 bg-slate-800"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  enabled ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        );
      })}
    </div>
  );
}

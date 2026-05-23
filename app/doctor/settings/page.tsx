"use client";

import { useState } from "react";
import Sidebar from "@/components/doctor/sidebar";
import TopBar from "@/components/doctor/topbar";
import DoctorProfileEditor from "@/components/doctor/doctor-profile-editor";
import { User, Lock, Bell, Shield, Loader2, Save, Trash2, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export default function DoctorSettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("professional");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }
    setIsLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await fetch("/api/me/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "Password changed successfully" });
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to change password" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-slate-950 text-slate-200 min-h-screen">
      <Sidebar />
      <div className="md:ml-60 pb-20 md:pb-0">
        <TopBar />

        <div className="p-4 md:p-6 lg:p-10">
          <div className="max-w-[1000px] mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Clinical Settings</h1>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Navigation Tabs */}
              <div className="w-full lg:w-64 shrink-0 space-y-2">
                <button
                  onClick={() => setActiveTab("professional")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    activeTab === "professional" ? "bg-teal-500/10 text-teal-400 border border-teal-500/20" : "text-slate-400 hover:bg-slate-900"
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>Professional Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    activeTab === "security" ? "bg-teal-500/10 text-teal-400 border border-teal-500/20" : "text-slate-400 hover:bg-slate-900"
                  }`}
                >
                  <Lock className="w-5 h-5" />
                  <span>Security & Password</span>
                </button>
                <button
                  onClick={() => setActiveTab("notifications")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    activeTab === "notifications" ? "bg-teal-500/10 text-teal-400 border border-teal-500/20" : "text-slate-400 hover:bg-slate-900"
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  <span>Notifications</span>
                </button>
              </div>

              {/* Content Area */}
              <div className="flex-1">
                {message.text && (
                  <div className={`mb-6 p-4 rounded-xl text-sm border ${
                    message.type === "success" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                  }`}>
                    {message.text}
                  </div>
                )}

                {activeTab === "professional" && (
                  <DoctorProfileEditor />
                )}

                {activeTab === "security" && (
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
                    <h3 className="text-xl font-bold text-white mb-6">Security Settings</h3>
                    <form onSubmit={handlePasswordChange} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Password</label>
                        <input
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">New Password</label>
                          <input
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Confirm New Password</label>
                          <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                            required
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-4 px-8 py-3 bg-teal-500 text-slate-950 font-bold rounded-xl flex items-center gap-2 hover:bg-teal-400 transition disabled:opacity-50"
                      >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
                        Update Password
                      </button>
                    </form>
                  </div>
                )}

                {activeTab === "notifications" && (
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
                    <h3 className="text-xl font-bold text-white mb-6">Clinical Alerts</h3>
                    <div className="space-y-6">
                      {[
                        { id: "app", label: "New Appointment Requests", desc: "Get notified when a patient books a new slot" },
                        { id: "msg", label: "Patient Messages", desc: "Receive alerts for new secure communications" },
                        { id: "rep", label: "AI Report Updates", desc: "Notification when a critical AI triage is generated" }
                      ].map((pref) => (
                        <div key={pref.id} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                          <div>
                            <p className="font-bold text-white">{pref.label}</p>
                            <p className="text-xs text-slate-500 mt-1">{pref.desc}</p>
                          </div>
                          <div className="w-12 h-6 bg-slate-800 rounded-full relative cursor-pointer border border-teal-500/20">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-teal-400 rounded-full shadow-lg" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import Sidebar from "@/components/patient/sidebar";
import Topbar from "@/components/patient/topbar";
import MobileBottomNav from "@/components/patient/mobilebottomnav";
import GlassCard from "@/components/patient/glasscard";
import { User, Lock, Bell, Shield, Loader2, Save, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export default function PatientSettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await fetch("/api/me/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "Profile updated successfully" });
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update profile" });
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleDeleteAccount = async () => {
    const password = prompt("Please enter your password to confirm account deletion:");
    if (!password) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/me/settings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        window.location.href = "/login";
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Failed to delete account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-[#101415] text-[#e0e3e5] min-h-screen">
      <Sidebar />
      <Topbar />

      <div className="pt-24 pb-20 lg:pb-8 px-4 lg:px-10 lg:ml-72">
        <div className="max-w-[800px] mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-64 shrink-0 space-y-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  activeTab === "profile" ? "bg-[#86db70]/10 text-[#86db70] border border-[#86db70]/20" : "text-[#c5c6cd] hover:bg-[#323537]"
                }`}
              >
                <User className="w-5 h-5" />
                <span>Profile Settings</span>
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  activeTab === "security" ? "bg-[#86db70]/10 text-[#86db70] border border-[#86db70]/20" : "text-[#c5c6cd] hover:bg-[#323537]"
                }`}
              >
                <Lock className="w-5 h-5" />
                <span>Security</span>
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  activeTab === "notifications" ? "bg-[#86db70]/10 text-[#86db70] border border-[#86db70]/20" : "text-[#c5c6cd] hover:bg-[#323537]"
                }`}
              >
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </button>
              <button
                onClick={() => setActiveTab("account")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  activeTab === "account" ? "bg-[#86db70]/10 text-[#86db70] border border-[#86db70]/20" : "text-[#c5c6cd] hover:bg-[#323537]"
                }`}
              >
                <Shield className="w-5 h-5" />
                <span>Account Control</span>
              </button>
            </div>

            <div className="flex-1">
              {message.text && (
                <div className={`mb-6 p-4 rounded-xl text-sm border ${
                  message.type === "success" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                }`}>
                  {message.text}
                </div>
              )}

              {activeTab === "profile" && (
                <GlassCard className="p-6 md:p-8">
                  <h3 className="text-xl font-bold text-white mb-6">Profile Information</h3>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-[#94a3b8] uppercase">Full Name</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="mt-1 w-full bg-[#101415] border border-[#323537] rounded-xl p-3 text-white focus:border-[#86db70] outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#94a3b8] uppercase">Email Address</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="mt-1 w-full bg-[#101415] border border-[#323537] rounded-xl p-3 text-white focus:border-[#86db70] outline-none transition"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="mt-4 px-6 py-3 bg-[#86db70] text-black font-bold rounded-xl flex items-center gap-2 hover:bg-[#76cb60] transition disabled:opacity-50"
                    >
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                      Update Profile
                    </button>
                  </form>
                </GlassCard>
              )}

              {activeTab === "security" && (
                <GlassCard className="p-6 md:p-8">
                  <h3 className="text-xl font-bold text-white mb-6">Change Password</h3>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-[#94a3b8] uppercase">Current Password</label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="mt-1 w-full bg-[#101415] border border-[#323537] rounded-xl p-3 text-white focus:border-[#86db70] outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#94a3b8] uppercase">New Password</label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="mt-1 w-full bg-[#101415] border border-[#323537] rounded-xl p-3 text-white focus:border-[#86db70] outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#94a3b8] uppercase">Confirm New Password</label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="mt-1 w-full bg-[#101415] border border-[#323537] rounded-xl p-3 text-white focus:border-[#86db70] outline-none transition"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="mt-4 px-6 py-3 bg-[#86db70] text-black font-bold rounded-xl flex items-center gap-2 hover:bg-[#76cb60] transition disabled:opacity-50"
                    >
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
                      Update Password
                    </button>
                  </form>
                </GlassCard>
              )}

              {activeTab === "notifications" && (
                <GlassCard className="p-6 md:p-8">
                  <h3 className="text-xl font-bold text-white mb-6">Notification Preferences</h3>
                  <div className="space-y-6">
                    {[
                      { id: "email", label: "Email Notifications", desc: "Receive appointment reminders via email" },
                      { id: "sms", label: "SMS Alerts", desc: "Get critical alerts on your mobile phone" },
                      { id: "browser", label: "Browser Notifications", desc: "Stay updated with real-time push alerts" }
                    ].map((pref) => (
                      <div key={pref.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white">{pref.label}</p>
                          <p className="text-xs text-[#c5c6cd]">{pref.desc}</p>
                        </div>
                        <div className="w-12 h-6 bg-[#323537] rounded-full relative cursor-pointer border border-[#1E5128]">
                          <div className="absolute left-1 top-1 w-4 h-4 bg-[#86db70] rounded-full shadow-lg" />
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}

              {activeTab === "account" && (
                <GlassCard className="p-6 md:p-8 border-red-500/20">
                  <h3 className="text-xl font-bold text-red-500 mb-2">Danger Zone</h3>
                  <p className="text-sm text-[#c5c6cd] mb-6">Once you delete your account, there is no going back. Please be certain.</p>
                  
                  <button
                    onClick={handleDeleteAccount}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition font-bold"
                  >
                    <Trash2 className="w-5 h-5" />
                    Delete My Account
                  </button>
                </GlassCard>
              )}
            </div>
          </div>
        </div>
      </div>

      <MobileBottomNav />
    </main>
  );
}

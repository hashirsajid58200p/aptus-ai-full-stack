"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import baseurl from "@/store/baseurl";
import { ShieldCheck, Lock, Mail, ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_URL = baseurl;

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/admin/login`,
        { email, password },
        { withCredentials: true }
      );

      if (res.data?.success) {
        if (res.data.token) {
          localStorage.setItem("adminToken", res.data.token);
        }
        toast.success("Admin authenticated successfully!");
        router.push("/admin/dashboard");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Admin login failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-[#1a1a1a] min-h-screen flex items-center justify-center bg-[#FDF9F0] py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Top Navbar Back Button */}
      <div className="absolute top-5 left-5">
        <button
          className="flex items-center gap-2 p-2 bg-white border-2 border-[#1a1a1a] shadow-neo-sm hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform cursor-pointer"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="h-6 w-6 text-[#1a1a1a]" />
          <span className="font-extrabold text-sm uppercase">Home</span>
        </button>
      </div>

      <div className="max-w-md w-full space-y-6">
        {/* Title Section */}
        <div className="text-center">
          <h2 className="font-syne text-[22px] font-black text-[#FF4D00] uppercase tracking-wide mb-1.5">
            SIGN IN TO ADMIN
          </h2>
          <img
            src="/aptus-logo.png"
            alt="Aptus Logo"
            className="h-[68px] w-auto mx-auto cursor-pointer object-contain mb-3"
            onClick={() => router.push("/")}
          />
          <p className="text-sm font-semibold text-gray-700">
            Sign in to access the platform control panel & analytics
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border-3 border-[#1a1a1a] p-8 shadow-neo-lg space-y-6">
          <form onSubmit={handleAdminLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-black uppercase text-[#1a1a1a] mb-1">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                  className="w-full border-2 border-[#1a1a1a] py-2 pl-10 pr-3 text-sm font-medium text-[#1a1a1a] bg-white placeholder-gray-400 focus:outline-none focus:bg-[#FDF9F0] focus:shadow-neo-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-[#1a1a1a] mb-1">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full border-2 border-[#1a1a1a] py-2 pl-10 pr-10 text-sm font-medium text-[#1a1a1a] bg-white placeholder-gray-400 focus:outline-none focus:bg-[#FDF9F0] focus:shadow-neo-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                {password && password.length > 0 && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                    {showPassword ? (
                      <EyeOff
                        onClick={() => setShowPassword(false)}
                        className="h-5 w-5 text-gray-500 hover:text-[#1a1a1a]"
                      />
                    ) : (
                      <Eye
                        onClick={() => setShowPassword(true)}
                        className="h-5 w-5 text-gray-500 hover:text-[#1a1a1a]"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-neo-primary py-3 px-4 text-base font-extrabold uppercase tracking-wider text-white shadow-neo hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform cursor-pointer disabled:opacity-60"
            >
              {loading ? "AUTHENTICATING..." : "SIGN IN TO ADMIN PANEL"}
            </button>
          </form>

          <div className="pt-4 border-t-2 border-[#1a1a1a] text-center">
            <p className="text-[11px] font-extrabold text-gray-600 uppercase tracking-wider">
              Protected Admin Route — Unauthorized access attempts logged
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

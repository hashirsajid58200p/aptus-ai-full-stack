"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import baseurl from "@/store/baseurl";
import { ShieldCheck, Lock, Mail, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="min-h-screen bg-[#fdf9f0] text-[#1a1a1a] flex flex-col justify-center items-center px-4 relative">
      {/* Top Navbar Back Button */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2.5 bg-white text-[#1a1a1a] font-extrabold border-3 border-[#1a1a1a] rounded-xl shadow-neo hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="uppercase text-xs tracking-wider font-syne">Back to Home</span>
      </button>

      {/* Main Neo-Brutalist Card */}
      <div className="max-w-md w-full bg-white border-3 border-[#1a1a1a] rounded-2xl p-8 shadow-neo-lg relative overflow-hidden">
        {/* Top Orange Header Banner */}
        <div className="bg-[#FF4D00] border-b-3 border-[#1a1a1a] -mx-8 -mt-8 p-6 text-center text-white mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white text-[#1a1a1a] border-3 border-[#1a1a1a] rounded-2xl shadow-neo mb-3">
            <ShieldCheck className="w-8 h-8 text-[#FF4D00]" />
          </div>
          <h1 className="text-2xl font-extrabold font-syne uppercase tracking-tight text-white">
            APTUS ADMIN <span className="font-playfair italic text-[#FF4D00] bg-white px-2.5 py-0.5 border-2 border-[#1a1a1a] rounded-lg ml-1 normal-case font-bold">Portal</span>
          </h1>
          <p className="text-xs font-extrabold text-white/90 uppercase tracking-wider mt-1.5 font-space">
            Platform Owner Control & Analytics
          </p>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#1a1a1a] mb-2 font-syne">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-[#1a1a1a]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aptus.com"
                required
                className="w-full bg-[#fdf9f0] border-3 border-[#1a1a1a] rounded-xl py-3 pl-11 pr-4 text-sm font-bold text-[#1a1a1a] placeholder-gray-500 focus:outline-none focus:bg-white focus:shadow-neo transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#1a1a1a] mb-2 font-syne">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-5 h-5 text-[#1a1a1a]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-[#fdf9f0] border-3 border-[#1a1a1a] rounded-xl py-3 pl-11 pr-4 text-sm font-bold text-[#1a1a1a] placeholder-gray-500 focus:outline-none focus:bg-white focus:shadow-neo transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 bg-[#FF4D00] hover:bg-[#e04400] text-white font-extrabold font-syne uppercase tracking-wider text-sm rounded-xl border-3 border-[#1a1a1a] shadow-neo hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-4 cursor-pointer"
          >
            {loading ? "AUTHENTICATING..." : "LOG IN TO ADMIN PANEL"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t-3 border-[#1a1a1a] text-center">
          <p className="text-[11px] font-extrabold text-[#1a1a1a] uppercase tracking-wider font-space">
            Protected Admin Route — Unauthorized access attempts logged
          </p>
        </div>
      </div>
    </div>
  );
}

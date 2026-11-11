"use client";
import React, { useState, useEffect } from "react";
import {
  LogOut,
  Briefcase,
  MessageSquare,
  Coins,
  History,
  Menu,
  Palette,
  Cpu,
} from "lucide-react";

import BussinessDetails from "components/userPageComponents/BussinessDetails";
import Token from "components/userPageComponents/Token";
import TestChatbot from "components/userPageComponents/TestChatbot";
import Sessions from "components/userPageComponents/Sessions";
import AnalyticsUsage from "components/userPageComponents/AnalyticsUsage";
import AppearanceTab from "components/userPageComponents/Appearance";
import { useRouter } from "next/navigation";
import { logout, clearState, loadUser } from "@/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Link from "next/link";
import Loader from "components/Loader";

export default function UserDashboard() {
  const dispatch = useDispatch();
  const { isLoggedOut, loading, user, isInitialized } = useSelector((state) => state.user);

  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("business details");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const tabs = [
    { name: "business details", icon: <Briefcase /> },
    { name: "appearance & theme", icon: <Palette /> },
    { name: "ai model & keys", icon: <Cpu /> },
    { name: "test chatbot", icon: <MessageSquare /> },
    { name: "sessions", icon: <History /> },
    { name: "token & security", icon: <Coins /> },
  ];

  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    document.title = "Business Dashboard — Aptus AI";
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    if (isMounted && isInitialized && !loading && !user) {
      router.push("/start");
    }
  }, [isMounted, user, loading, isInitialized, router]);

  useEffect(() => {
    if (isLoggedOut) {
      dispatch(clearState());
      toast.success("Logged out successfully");
      router.push("/");
    }
  }, [isLoggedOut, dispatch, router]);

  const handleLogout = () => {
    dispatch(logout());
  };

  if (!isMounted || !isInitialized || (!user && loading) || !user) {
    return <Loader />;
  }

  return (
    <div className="flex h-screen bg-[#FDF9F0] overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Neo-Brutalist Sidebar Matching Admin */}
      <aside
        className={`${
          isSidebarOpen ? "fixed inset-y-0 left-0 z-50 flex" : "hidden"
        } lg:flex flex-col justify-between w-64 lg:w-72 bg-white p-5 h-screen sticky top-0 left-0 border-r-3 border-[#1a1a1a] shadow-neo z-40 shrink-0`}
      >
        <div>
          {/* Logo & Business Branding */}
          <div className="py-3 border-b-3 border-[#1a1a1a] mb-6 flex flex-col items-start gap-2">
            <span className="bg-[#FF4D00] text-white border-2 border-[#1a1a1a] text-[10px] font-extrabold uppercase px-2.5 py-0.5 shadow-neo-sm font-space tracking-wider">
              BUSINESS
            </span>
            <Link href="/" className="flex items-center">
              <img
                src="/aptus-logo.png"
                alt="Aptus AI"
                className="h-10 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Navigation Tabs */}
          <nav className="space-y-2.5">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.name;
              return (
                <button
                  key={tab.name}
                  onClick={() => {
                    setActiveTab(tab.name);
                    setIsSidebarOpen(false);
                  }}
                  className={`flex items-center w-full text-left py-3 px-4 uppercase text-xs sm:text-sm font-extrabold border-2 border-[#1a1a1a] rounded-none transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "bg-[#FF4D00] text-white shadow-neo-sm"
                      : "bg-white hover:bg-[#BFF000] text-[#1a1a1a]"
                  }`}
                >
                  <span className="mr-3">
                    {React.cloneElement(tab.icon, { className: "w-4 h-4 shrink-0" })}
                  </span>
                  <span className="truncate">{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer - Bottom Left Logout */}
        <div className="mt-auto pt-6 border-t-3 border-[#1a1a1a] flex justify-start">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-extrabold uppercase text-white bg-red-600 border-2 border-[#1a1a1a] shadow-neo-sm hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform cursor-pointer font-space"
          >
            <LogOut className="h-4 w-4" />
            <span>LOGOUT</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Sticky Header */}
        <header className="bg-white border-b-3 border-[#1a1a1a] sticky top-0 z-30 px-4 sm:px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 border-2 border-[#1a1a1a] bg-[#FDF9F0] cursor-pointer"
            >
              <Menu className="w-5 h-5 text-[#1a1a1a]" />
            </button>
            <div>
              <h2 className="text-xl font-extrabold font-syne uppercase tracking-tight text-[#1a1a1a]">
                BUSINESS <span className="text-[#FF4D00]">DASHBOARD</span>
              </h2>
              <p className="text-xs font-bold text-[#1a1a1a]/70 font-space hidden sm:block">
                Manage your AI chatbot, knowledge base, theme, and visitor conversations
              </p>
            </div>
          </div>
        </header>

        {/* Tab Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-6">
          {activeTab === "business details" && <BussinessDetails />}
          {activeTab === "appearance & theme" && (
            <AppearanceTab user={user} onUserUpdate={() => dispatch(loadUser())} />
          )}
          {activeTab === "ai model & keys" && (
            <AnalyticsUsage user={user} onUserUpdate={() => dispatch(loadUser())} />
          )}
          {activeTab === "test chatbot" && <TestChatbot />}
          {activeTab === "sessions" && <Sessions />}
          {activeTab === "token & security" && <Token />}
        </main>
      </div>

      {/* ── Confirmation Modal (Logout) ── */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="bg-white border-3 border-[#1a1a1a] shadow-neo-lg rounded-none p-8 max-w-[340px] w-[90%] flex flex-col items-center text-center gap-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center w-full mb-6">
              <h2 className="font-syne font-black text-2xl md:text-3xl uppercase text-[#1a1a1a] leading-tight mb-4 tracking-wider">
                CONFIRM<br />LOGOUT
              </h2>
              <p className="text-[#1a1a1a] font-bold text-sm">
                Are you sure you want to log out of your account?
              </p>
            </div>
            <div className="w-full flex flex-col gap-3">
              <button
                onClick={() => {
                  handleLogout();
                  setShowLogoutModal(false);
                }}
                className="bg-[#E53935] hover:bg-[#D32F2F] text-white font-black border-2 border-[#1a1a1a] px-4 py-3 text-xs sm:text-sm uppercase w-full shadow-neo-sm rounded-none m-0 transition-colors cursor-pointer"
              >
                YES, LOGOUT
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="bg-[#F5F5F5] hover:bg-[#E0E0E0] text-[#1a1a1a] font-black border-2 border-[#1a1a1a] px-4 py-3 text-xs sm:text-sm uppercase w-full shadow-neo-sm rounded-none m-0 mt-0 transition-colors cursor-pointer"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

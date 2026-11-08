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
  BarChart3,
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
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "components/ui/alert-dialog";

export default function UserDashboard() {
  const dispatch = useDispatch();
  const { isLoggedOut, loading, user, isInitialized } = useSelector((state) => state.user);

  const [activeTab, setActiveTab] = useState("business details");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const tabs = [
    { name: "business details", icon: <Briefcase /> },
    { name: "appearance & theme", icon: <Palette /> },
    { name: "ai model & analytics", icon: <Cpu /> },
    { name: "test chatbot", icon: <MessageSquare /> },
    { name: "sessions", icon: <History /> },
    { name: "token & security", icon: <Coins /> },
  ];

  const router = useRouter();

  useEffect(() => {
    document.title = "Business Dashboard — Aptus AI";
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    if (isInitialized && !loading && !user) {
      router.push("/start");
    }
  }, [user, loading, isInitialized, router]);

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

  if (!isInitialized || (loading && !user)) {
    return <Loader />;
  }

  return (
    <div className="flex h-screen bg-[#FDF9F0] overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-30 w-72 bg-white border-r-3 border-[#1a1a1a] shadow-neo-lg transform transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-0 -translate-x-full"
        } flex flex-col justify-between`}
      >
        <div>
          {/* Logo & Category */}
          <div className="p-6 border-b-3 border-[#1a1a1a]">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#FF4D00] text-white border-2 border-[#1a1a1a] px-2 py-0.5 font-black text-[10px] uppercase tracking-wider">
                BUSINESS
              </span>
            </div>
            <Link href="/" className="font-syne text-2xl font-black text-[#1a1a1a] uppercase tracking-tight hover:text-[#FF4D00] transition-colors">
              APTUS<span className="text-[#FF4D00]">AI</span>
            </Link>
            <p className="text-xs font-bold text-gray-500 uppercase mt-1 truncate">
              {user?.bussinessName || "My Business"}
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 flex flex-col gap-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.name;
              return (
                <button
                  key={tab.name}
                  onClick={() => {
                    setActiveTab(tab.name);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 border-2 border-[#1a1a1a] text-xs font-black uppercase transition-all duration-150 ${
                    isActive
                      ? "bg-[#FF4D00] text-white shadow-neo-sm translate-x-1"
                      : "bg-white text-[#1a1a1a] hover:bg-[#FDF9F0]"
                  }`}
                >
                  {React.cloneElement(tab.icon, { className: "w-4 h-4 shrink-0" })}
                  <span className="truncate">{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info / Agency link */}
        <div className="p-4 border-t-3 border-[#1a1a1a] bg-[#FDF9F0]">
          <div className="text-[10px] font-bold text-gray-500 uppercase">Chatbot Engine Status</div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
            <span className="text-xs font-black text-[#1a1a1a] uppercase">Active & Connected</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-6">
        {/* Top Header */}
        <header className="flex items-center justify-between border-3 border-[#1a1a1a] bg-white p-4 shadow-neo-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 border-2 border-[#1a1a1a] bg-[#FDF9F0]"
            >
              <Menu className="w-5 h-5 text-[#1a1a1a]" />
            </button>
            <h1 className="font-syne text-xl md:text-2xl font-black uppercase text-[#1a1a1a]">
              {activeTab}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-2 bg-[#E53935] hover:bg-[#D32F2F] text-white font-black text-xs uppercase border-2 border-[#1a1a1a] shadow-neo-sm">
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white text-[#1a1a1a] border-3 border-[#1a1a1a] shadow-neo-lg rounded-none p-6 max-w-[340px]">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-syne font-black text-xl uppercase">Confirm Logout</AlertDialogTitle>
                  <AlertDialogDescription className="text-xs font-bold text-gray-600">
                    Are you sure you want to end your current session?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-4 flex flex-col gap-2">
                  <AlertDialogAction
                    onClick={handleLogout}
                    className="w-full bg-[#E53935] hover:bg-[#D32F2F] text-white font-black border-2 border-[#1a1a1a] py-2 text-xs uppercase rounded-none m-0"
                  >
                    Yes, Logout
                  </AlertDialogAction>
                  <AlertDialogCancel className="w-full bg-[#F5F5F5] font-black border-2 border-[#1a1a1a] py-2 text-xs uppercase rounded-none m-0">
                    Cancel
                  </AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </header>

        {/* Tab Content */}
        {activeTab === "business details" && <BussinessDetails />}
        {activeTab === "appearance & theme" && (
          <AppearanceTab user={user} onUserUpdate={() => dispatch(loadUser())} />
        )}
        {activeTab === "ai model & analytics" && (
          <AnalyticsUsage user={user} onUserUpdate={() => dispatch(loadUser())} />
        )}
        {activeTab === "test chatbot" && <TestChatbot />}
        {activeTab === "sessions" && <Sessions />}
        {activeTab === "token & security" && <Token />}
      </main>
    </div>
  );
}

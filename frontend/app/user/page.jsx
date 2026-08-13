"use client";
import React, { useState, useEffect } from "react";
import {
  LogOut,
  Briefcase,
  MessageSquare,
  Coins,
  History,
  Menu,
  Lock,
} from "lucide-react";

import BussinessDetails from "components/userPageComponents/BussinessDetails";
import Token from "components/userPageComponents/Token";
import TestChatbot from "components/userPageComponents/TestChatbot";
import Sessions from "components/userPageComponents/Sessions";
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
    { name: "test chatbot", icon: <MessageSquare /> },
    { name: "sessions", icon: <History /> },
    { name: "token", icon: <Coins /> },
  ];

  const router = useRouter();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    if (isInitialized && !user) {
      router.push("/start");
      clearState();
    }
  }, [isInitialized, user, router]);

  useEffect(() => {
    if (isLoggedOut) {
      toast.success("Logged out successfully");
      dispatch(clearState());
      router.push("/start");
    }
  }, [isLoggedOut, loading, router]);

  useEffect(() => {
    if (user?.bussinessDetails && user.bussinessDetails.length < 5) {
      if (activeTab !== "business details") {
        setActiveTab("business details");
      }
    }
  }, [user?.bussinessDetails?.length, activeTab]);

  const handleLogout = () => {
    dispatch(logout());
  };

  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#FDF9F0]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#FDF9F0] text-[#1a1a1a]">
      {/* Mobile Sidebar Overlay Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "fixed inset-y-0 left-0 z-50 flex flex-col" : "hidden"
        } md:flex md:flex-col w-64 bg-white p-5 h-screen sticky top-0 border-r-3 border-[#1a1a1a] shadow-neo shrink-0`}
      >
        <div className="py-3 border-b-3 border-[#1a1a1a] mb-6 flex flex-col items-start gap-2">
          <span className="bg-[#FF4D00] text-white border-2 border-[#1a1a1a] text-[10px] font-extrabold uppercase px-2.5 py-0.5 shadow-neo-sm font-space tracking-wider">
            BUSINESS
          </span>
          <Link href={"/"} className="flex items-center">
            <img
              src="/aptus-logo.png"
              alt="Aptus"
              className="h-10 w-auto object-contain"
            />
          </Link>
        </div>

        <nav className="space-y-3">
          {tabs.map((tab) => {
            const isLocked =
              tab.name !== "business details" &&
              (!user?.bussinessDetails || user.bussinessDetails.length < 5);
            const isActive = activeTab === tab.name;

            return (
              <button
                key={tab.name}
                className={`flex items-center w-full text-left py-3 px-4 uppercase text-sm font-extrabold border-2 border-[#1a1a1a] transition-all duration-150 ${
                  isActive && !isLocked
                    ? "bg-[#FF4D00] text-white shadow-neo-sm"
                    : "bg-white hover:bg-[#BFF000] text-[#1a1a1a]"
                } ${isLocked ? "opacity-50 cursor-not-allowed bg-gray-100" : ""}`}
                onClick={() => {
                  if (isLocked) {
                    toast.error(
                      `Please add at least 5 business details to unlock this feature. Currently you have ${
                        user?.bussinessDetails?.length || 0
                      }/5.`
                    );
                    return;
                  }
                  setActiveTab(tab.name);
                  setIsSidebarOpen(false);
                }}
              >
                <span className={`mr-3 text-lg ${isActive && !isLocked ? "text-white" : "text-[#1a1a1a]"}`}>
                  {tab.icon}
                </span>
                <span className="flex-1">
                  {tab.name}
                </span>
                {isLocked && <Lock className="w-4 h-4 text-gray-500" strokeWidth={2.5} />}
              </button>
            );
          })}
        </nav>

        {/* Mobile Logout Button inside sidebar */}
        <div className="mt-auto pt-6 border-t-3 border-[#1a1a1a] flex md:hidden justify-start h-full items-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="flex w-full items-center gap-2 px-5 py-2.5 text-sm font-extrabold uppercase text-white bg-red-600 border-2 border-[#1a1a1a] shadow-neo-sm">
                <LogOut className="h-4 w-4" />
                <span>LOGOUT</span>
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white text-[#1a1a1a] border-3 border-[#1a1a1a] shadow-neo-lg rounded-none p-8 max-w-[340px] w-[90%] mx-auto flex flex-col items-center text-center gap-0">
              <div className="flex flex-col items-center text-center w-full mb-6">
                <AlertDialogTitle className="font-syne font-black text-2xl md:text-3xl uppercase text-[#1a1a1a] leading-tight mb-4 tracking-wider">
                  CONFIRM<br />LOGOUT
                </AlertDialogTitle>
                <AlertDialogDescription className="text-[#1a1a1a] font-bold text-sm">
                  Are you sure you want to log out of your account?
                </AlertDialogDescription>
              </div>
              <div className="w-full flex flex-col gap-3">
                <AlertDialogAction
                  onClick={handleLogout}
                  className="bg-[#E53935] hover:bg-[#D32F2F] text-white font-black border-2 border-[#1a1a1a] px-4 py-3 text-xs sm:text-sm uppercase w-full shadow-neo-sm rounded-none m-0"
                >
                  YES, LOGOUT
                </AlertDialogAction>
                <AlertDialogCancel className="bg-[#F5F5F5] hover:bg-[#E0E0E0] text-[#1a1a1a] font-black border-2 border-[#1a1a1a] px-4 py-3 text-xs sm:text-sm uppercase w-full shadow-neo-sm rounded-none m-0 mt-0">
                  CANCEL
                </AlertDialogCancel>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-10 h-screen overflow-y-auto">
        <header className="flex flex-row justify-between items-center gap-2 md:gap-4 border-3 border-[#1a1a1a] mb-4 md:mb-8 bg-white p-4 md:p-6 shadow-neo">
          <h1 className="font-syne text-sm sm:text-lg md:text-3xl font-extrabold text-[#1a1a1a] uppercase flex-1">
            {activeTab === "business details"
              ? `WELCOME, ${user?.name || "USER"}`
              : activeTab}
          </h1>

          <div className="flex items-center gap-2 md:space-x-4 shrink-0">
            <div className="hidden md:block">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-extrabold uppercase text-white bg-red-600 border-2 border-[#1a1a1a] shadow-neo-sm hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform"
                  >
                    <LogOut className="h-4 w-4 shrink-0" />
                    <span>LOGOUT</span>
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white text-[#1a1a1a] border-3 border-[#1a1a1a] shadow-neo-lg rounded-none p-8 max-w-[340px] w-full flex flex-col items-center text-center gap-0">
                  <div className="flex flex-col items-center text-center w-full mb-6">
                    <AlertDialogTitle className="font-syne font-black text-2xl md:text-3xl uppercase text-[#1a1a1a] leading-tight mb-4 tracking-wider">
                      CONFIRM<br />LOGOUT
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-[#1a1a1a] font-bold text-sm">
                      Are you sure you want to log out of your account?
                    </AlertDialogDescription>
                  </div>
                  <div className="w-full flex flex-col gap-3">
                    <AlertDialogAction
                      onClick={handleLogout}
                      className="bg-[#E53935] hover:bg-[#D32F2F] text-white font-black border-2 border-[#1a1a1a] px-4 py-3 text-xs sm:text-sm uppercase w-full shadow-neo-sm rounded-none m-0"
                    >
                      YES, LOGOUT
                    </AlertDialogAction>
                    <AlertDialogCancel className="bg-[#F5F5F5] hover:bg-[#E0E0E0] text-[#1a1a1a] font-black border-2 border-[#1a1a1a] px-4 py-3 text-xs sm:text-sm uppercase w-full shadow-neo-sm rounded-none m-0 mt-0">
                      CANCEL
                    </AlertDialogCancel>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <button
              className="block md:hidden p-2 bg-white border-2 border-[#1a1a1a] rounded-none shadow-neo-sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="w-5 h-5 text-[#1a1a1a]" />
            </button>
          </div>
        </header>

        {/* Render content based on active tab */}
        {activeTab === "business details" && <BussinessDetails />}
        {activeTab === "test chatbot" && <TestChatbot />}
        {activeTab === "sessions" && <Sessions />}
        {activeTab === "token" && <Token />}
      </main>
    </div>
  );
}

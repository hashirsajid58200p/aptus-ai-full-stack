"use client";
import React, { useState, useEffect } from "react";
import {
  LogOut,
  Briefcase,
  MessageSquare,
  Coins,
  History,
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
          isSidebarOpen ? "fixed inset-y-0 left-0 z-50 block" : "hidden"
        } md:block w-64 bg-white p-5 h-screen sticky top-0 border-r-3 border-[#1a1a1a] shadow-neo shrink-0`}
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
                {isLocked && <span className="text-xs">🔒</span>}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-10 h-screen overflow-y-auto">
        <header className="flex justify-between items-center border-3 border-[#1a1a1a] mb-8 bg-white p-6 shadow-neo">
          <h1 className="font-syne text-2xl sm:text-3xl font-extrabold text-[#1a1a1a] uppercase">
            {activeTab === "business details"
              ? `WELCOME, ${user?.name || "USER"}`
              : activeTab}
          </h1>

          <div className="flex items-center space-x-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-extrabold uppercase text-white bg-red-600 border-2 border-[#1a1a1a] shadow-neo-sm hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform"
                >
                  <LogOut className="h-4 w-4" />
                  <span>LOGOUT</span>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white text-[#1a1a1a] border-3 border-[#1a1a1a] shadow-neo-lg rounded-xl p-6">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-syne font-extrabold text-xl uppercase text-[#1a1a1a]">
                    Confirm Logout
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-700 font-bold text-sm">
                    Are you sure you want to log out of your account?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-6 flex flex-row gap-3 justify-end">
                  <AlertDialogCancel className="bg-gray-100 text-[#1a1a1a] font-extrabold border-2 border-[#1a1a1a] px-4 py-2 text-xs uppercase hover:bg-gray-200">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLogout}
                    className="bg-red-600 text-white font-extrabold border-2 border-[#1a1a1a] shadow-neo-sm px-4 py-2 text-xs uppercase hover:bg-red-700"
                  >
                    Yes, Logout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <button
              className="block md:hidden p-2 bg-[#BFF000] border-2 border-[#1a1a1a]"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <svg
                className="w-6 h-6 text-[#1a1a1a]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
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

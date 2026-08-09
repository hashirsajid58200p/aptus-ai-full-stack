"use client";
import React, { useState, useEffect } from "react";
import {
  LogOut,
  Briefcase,
  MessageSquare,
  Coins,
} from "lucide-react";

import BussinessDetails from "components/userPageComponents/BussinessDetails";
import Token from "components/userPageComponents/Token";
import TestChatbot from "components/userPageComponents/TestChatbot";
import { useRouter } from "next/navigation";
import { logout, clearState, loadUser } from "@/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Link from "next/link";
import Loader from "components/Loader";

export default function UserDashboard() {
  const dispatch = useDispatch();
  const { isLoggedOut, loading, user, isInitialized } = useSelector((state) => state.user);

  const [activeTab, setActiveTab] = useState("business details");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For responsive sidebar toggle

  // Define tabs
  const tabs = [
    { name: "business details", icon: <Briefcase /> },
    { name: "test chatbot", icon: <MessageSquare /> },
    { name: "token", icon: <Coins /> },
  ];

  const router = useRouter();
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    // Only check redirect if auth initialization has finished
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
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "block" : "hidden"
        } md:block w-64 bg-white p-4 h-screen fixed top-0 left-0 shadow-lg z-50 md:z-0 md:relative`}
      >
        <div className="flex gap-[3px] items-center py-4">
          <Link href={"/"} className="flex items-center">
            <img src="/file.png" alt="quickstart" className="h-12 w-12" />
            <h2 className="text-3xl font-bold text-[#9e45f1]">Quickstart</h2>
          </Link>
        </div>
        <nav className="space-y-4 mt-3">
          {tabs.map((tab) => {
            const isLocked =
              tab.name !== "business details" &&
              (!user?.bussinessDetails || user.bussinessDetails.length < 5);
            return (
              <button
                key={tab.name}
                className={`text-lg open-sans-headings flex items-center w-full text-left py-3 px-5 rounded transition-all duration-300 ${
                  activeTab === tab.name && !isLocked
                    ? "bg-[#9E45F1] text-white"
                    : "hover:bg-gray-200 text-gray-700"
                } ${isLocked ? "opacity-50 cursor-not-allowed" : ""}`}
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
                  setIsSidebarOpen(false); // Close the sidebar after clicking a tab
                }}
              >
                {/* Update the icon color based on the activeTab */}
                <span
                  className={`mr-3 text-2xl ${
                    activeTab === tab.name && !isLocked
                      ? "text-white"
                      : "text-gray-600"
                  }`}
                >
                  {tab.icon}
                </span>
                <span className="text-lg font-semibold flex-1">
                  {tab.name.charAt(0).toUpperCase() + tab.name.slice(1)}
                </span>
                {isLocked && <span className="text-sm text-gray-400">🔒</span>}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 ml-0  h-screen overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold text-[#661fa8] roboty-headings font-extrabold">
            {activeTab === "business details"
              ? `Welcome, ${user?.name}`
              : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h1>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-full hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
            <button
              className="block md:hidden p-2 rounded-md hover:bg-gray-200 "
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </header>

        {/* Render content based on active tab */}
        {activeTab === "business details" && <BussinessDetails />}
        {activeTab === "test chatbot" && <TestChatbot />}
        {activeTab === "token" && <Token />}
      </main>
    </div>
  );
}

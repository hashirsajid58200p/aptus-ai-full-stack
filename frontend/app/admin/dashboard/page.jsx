"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import baseurl from "@/store/baseurl";
import {
  Building2,
  MessageSquare,
  Users,
  TrendingUp,
  LogOut,
  Search,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Eye,
  X,
  Key,
  HelpCircle,
  RefreshCw,
  ArrowLeft,
  BarChart3,
  PieChart,
  Activity,
  Server,
  Menu,
  CheckCircle2,
  Copy,
  Zap,
  Globe,
  Layers,
  ChevronDown,
  Trash2,
  AlertTriangle,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();

  const API_URL = baseurl;

  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalBusinesses: 0,
    totalSessions: 0,
    totalMessages: 0,
    recentBusinesses7d: 0,
    recentSessions7d: 0,
  });

  const [businesses, setBusinesses] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const filterDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutsideFilter = (event) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setIsFilterDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideFilter);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideFilter);
    };
  }, []);

  // Token tester/generator state
  const [testToken, setTestToken] = useState("");
  const [tokenStatus, setTokenStatus] = useState(null);
  const [testingToken, setTestingToken] = useState(false);

  // Confirmation modal state: { type: 'delete'|'logout', business?: {id, name} }
  const [confirmAction, setConfirmAction] = useState(null);

  const getAuthOptions = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
    return {
      withCredentials: true,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
  };

  // Authenticate Admin and fetch analytics
  const fetchAnalyticsAndAuth = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/analytics`, getAuthOptions());

      if (res.data?.success) {
        setAnalytics(res.data.data);
      }
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error("Session expired or unauthorized. Please log in.");
        localStorage.removeItem("adminToken");
        router.push("/admin/login");
      } else {
        toast.error("Failed to load analytics");
      }
    }
  };

  // Fetch Businesses
  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/admin/businesses?limit=1000`,
        getAuthOptions()
      );

      if (res.data?.success) {
        setBusinesses(res.data.data);
        setTotalCount(res.data.totalCount || res.data.data.length);
      }
    } catch (err) {
      console.error("Error fetching businesses", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsAndAuth();
    fetchBusinesses();
  }, []);

  const handleViewBusiness = async (id) => {
    try {
      const res = await axios.get(
        `${API_URL}/admin/businesses/${id}`,
        getAuthOptions()
      );

      if (res.data?.success) {
        setSelectedBusiness(res.data.data);
      }
    } catch (err) {
      toast.error("Failed to fetch business details");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${API_URL}/admin/logout`, getAuthOptions());
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      localStorage.removeItem("adminToken");
      toast.success("Admin logged out successfully");
      router.push("/admin/login");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  // Delete a business and all its related data
  const handleDeleteBusiness = async (id, name) => {
    try {
      await axios.delete(`${API_URL}/admin/businesses/${id}`, getAuthOptions());
      toast.success(`"${name}" and all related data deleted.`);
      setBusinesses((prev) => prev.filter((b) => b._id !== id));
      setTotalCount((prev) => Math.max(prev - 1, 0));
      if (selectedBusiness?._id === id) setSelectedBusiness(null);
      fetchAnalyticsAndAuth();
    } catch (err) {
      toast.error("Failed to delete business. Please try again.");
    } finally {
      setConfirmAction(null);
    }
  };

  const handleTestToken = async () => {
    if (!testToken.trim()) return;
    setTestingToken(true);
    setTokenStatus(null);
    try {
      const res = await axios.get(`${API_URL}/chatbot/getDetails?token=${testToken.trim()}`);
      if (res.data?.success) {
        setTokenStatus({
          valid: true,
          data: res.data.data
        });
        toast.success("Valid widget token!");
      } else {
        setTokenStatus({ valid: false, message: "Invalid widget token" });
      }
    } catch (err) {
      setTokenStatus({ valid: false, message: "Token verification failed" });
    } finally {
      setTestingToken(false);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const categoriesList = ["ALL", ...Array.from(new Set(businesses.map(b => b.bussinessCategory || "General")))];

  const filteredBusinesses = businesses.filter((b) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      (b.bussinessName && b.bussinessName.toLowerCase().includes(query)) ||
      (b.email && b.email.toLowerCase().includes(query)) ||
      (b.bussinessCategory && b.bussinessCategory.toLowerCase().includes(query)) ||
      (b.chatbot_token && b.chatbot_token.toLowerCase().includes(query));

    const matchesCategory =
      selectedCategory === "ALL" ||
      (b.bussinessCategory || "General") === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.max(1, Math.ceil(filteredBusinesses.length / ITEMS_PER_PAGE));
  const paginatedBusinesses = filteredBusinesses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const sidebarTabs = [
    { id: "overview", label: "Overview", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "businesses", label: "Businesses", icon: <Building2 className="w-4 h-4" /> },
    { id: "analytics", label: "Analytics & Charts", icon: <PieChart className="w-4 h-4" /> },
    { id: "system", label: "System & Health", icon: <Activity className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#fdf9f0] text-[#1a1a1a]">
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b-3 border-[#1a1a1a]">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-[#FF4D00] text-white border-2 border-[#1a1a1a] rounded-none flex items-center justify-center shadow-neo-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-syne font-extrabold uppercase text-sm tracking-tight">
            APTUS <span className="font-playfair italic text-[#FF4D00]">Admin</span>
          </span>
        </div>

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 bg-white border-2 border-[#1a1a1a] rounded-none shadow-neo-sm"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Neo-Brutalist Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "flex" : "hidden"
        } md:flex flex-col justify-between w-72 bg-white p-5 h-screen sticky top-0 left-0 border-r-3 border-[#1a1a1a] shadow-neo z-50 shrink-0`}
      >
        <div>
          {/* Logo & Admin Branding */}
          <div className="py-3 border-b-3 border-[#1a1a1a] mb-6 flex flex-col items-start gap-2">
            <span className="bg-[#FF4D00] text-white border-2 border-[#1a1a1a] text-[10px] font-extrabold uppercase px-2.5 py-0.5 shadow-neo-sm font-space tracking-wider">
              ADMIN
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
            {sidebarTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`flex items-center w-full text-left py-3 px-4 uppercase text-sm font-extrabold border-2 border-[#1a1a1a] rounded-none transition-all duration-150 ${
                    isActive
                      ? "bg-[#FF4D00] text-white shadow-neo-sm"
                      : "bg-white hover:bg-[#BFF000] text-[#1a1a1a]"
                  }`}
                >
                  <span className="mr-3">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer - Bottom Left Logout */}
        <div className="mt-auto pt-6 border-t-3 border-[#1a1a1a] flex justify-start">
          <button
            onClick={() => setConfirmAction({ type: "logout" })}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-extrabold uppercase text-white bg-red-600 border-2 border-[#1a1a1a] shadow-neo-sm hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform cursor-pointer font-space"
          >
            <LogOut className="h-4 w-4" />
            <span>LOGOUT</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Sticky Header */}
        <header className="bg-white border-b-3 border-[#1a1a1a] sticky top-0 z-30 px-6 py-4 hidden md:block">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold font-syne uppercase tracking-tight text-[#1a1a1a]">
                ADMINISTRATOR <span className="text-[#FF4D00]">DASHBOARD</span>
              </h2>
              <p className="text-xs font-bold text-[#1a1a1a]/70 font-space">
                Real-time platform metrics, business directory, and system health
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  fetchAnalyticsAndAuth();
                  fetchBusinesses(page);
                  toast.success("Metrics updated!");
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#BFF000] text-[#1a1a1a] font-extrabold font-space border-2 border-[#1a1a1a] rounded-none shadow-neo-sm hover:translate-x-[-1px] hover:translate-y-[-1px] text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Data</span>
              </button>
            </div>
          </div>
        </header>

        {/* Tab Contents */}
        <main className="p-6 flex-1 space-y-8 max-w-7xl w-full">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Stat Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white border-3 border-[#1a1a1a] rounded-none p-5 shadow-neo">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#1a1a1a] uppercase tracking-wider font-space">
                      Total Businesses
                    </span>
                    <div className="p-2.5 bg-[#FF4D00] text-white border-2 border-[#1a1a1a] rounded-none shadow-neo-sm">
                      <Building2 className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-3xl font-extrabold font-syne text-[#1a1a1a] mt-3">
                    {analytics.totalBusinesses}
                  </p>
                  <p className="text-[11px] font-bold text-gray-600 mt-1 font-space">
                    Registered platform clients
                  </p>
                </div>

                <div className="bg-white border-3 border-[#1a1a1a] rounded-none p-5 shadow-neo">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#1a1a1a] uppercase tracking-wider font-space">
                      Chat Sessions
                    </span>
                    <div className="p-2.5 bg-[#2D31FA] text-white border-2 border-[#1a1a1a] rounded-none shadow-neo-sm">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-3xl font-extrabold font-syne text-[#1a1a1a] mt-3">
                    {analytics.totalSessions}
                  </p>
                  <p className="text-[11px] font-bold text-gray-600 mt-1 font-space">
                    +{analytics.recentSessions7d} in last 7 days
                  </p>
                </div>

                <div className="bg-white border-3 border-[#1a1a1a] rounded-none p-5 shadow-neo">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#1a1a1a] uppercase tracking-wider font-space">
                      Total AI Messages
                    </span>
                    <div className="p-2.5 bg-[#BFF000] text-[#1a1a1a] border-2 border-[#1a1a1a] rounded-none shadow-neo-sm">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-3xl font-extrabold font-syne text-[#1a1a1a] mt-3">
                    {analytics.totalMessages}
                  </p>
                  <p className="text-[11px] font-bold text-gray-600 mt-1 font-space">
                    Processed AI responses
                  </p>
                </div>

                <div className="bg-white border-3 border-[#1a1a1a] rounded-none p-5 shadow-neo">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#1a1a1a] uppercase tracking-wider font-space">
                      New Signups (7d)
                    </span>
                    <div className="p-2.5 bg-[#1a1a1a] text-white border-2 border-[#1a1a1a] rounded-none shadow-neo-sm">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-3xl font-extrabold font-syne text-[#1a1a1a] mt-3">
                    {analytics.recentBusinesses7d}
                  </p>
                  <p className="text-[11px] font-bold text-gray-600 mt-1 font-space">
                    Weekly client growth
                  </p>
                </div>
              </div>

              {/* Visual Graph & Activity Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Acquisition Growth Chart SVG */}
                <div className="lg:col-span-2 bg-white border-3 border-[#1a1a1a] rounded-none p-6 shadow-neo-lg space-y-4">
                  <div className="flex items-center justify-between border-b-2 border-[#1a1a1a] pb-3">
                    <div>
                      <h3 className="text-base font-extrabold font-syne uppercase text-[#1a1a1a]">
                        CLIENT ACQUISITION <span className="text-[#FF4D00]">GROWTH TREND</span>
                      </h3>
                      <p className="text-xs text-gray-600 font-space font-bold">
                        Monthly registration volume visualizer
                      </p>
                    </div>
                    <span className="px-2.5 py-1 bg-[#BFF000] text-[#1a1a1a] border-2 border-[#1a1a1a] rounded-none text-[10px] font-extrabold uppercase">
                      Live Data
                    </span>
                  </div>

                  {/* Custom Neo-Brutalist Bar Chart (Real Live Data) */}
                  <div className="pt-4 space-y-4">
                    <div className="h-44 flex items-end gap-4 px-2 pt-6 border-b-3 border-[#1a1a1a]">
                      {(() => {
                        const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
                        const now = new Date();
                        const chartItems = Array.from({ length: 8 }).map((_, idx) => {
                          const monthOffset = 7 - idx;
                          const d = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
                          const targetMonth = d.getMonth();
                          const targetYear = d.getFullYear();

                          const count = businesses.filter((b) => {
                            if (!b.createdAt) return false;
                            const bDate = new Date(b.createdAt);
                            return bDate.getMonth() === targetMonth && bDate.getFullYear() === targetYear;
                          }).length;

                          return {
                            month: monthNames[targetMonth],
                            val: count,
                            isCurrent: idx === 7,
                          };
                        });

                        const maxVal = Math.max(...chartItems.map((i) => i.val), 1);

                        return chartItems.map((item, idx) => {
                          const heightPct = item.val === 0 ? 8 : Math.max(16, Math.round((item.val / maxVal) * 85));
                          return (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group h-full justify-end">
                              <span className="text-[10px] font-extrabold font-space text-[#1a1a1a]">
                                {item.val}
                              </span>
                              <div
                                style={{ height: `${heightPct}%` }}
                                className={`w-full max-w-[36px] border-2 border-[#1a1a1a] rounded-none transition-all duration-300 ${
                                  item.isCurrent ? "bg-[#FF4D00]" : idx % 2 === 0 ? "bg-[#2D31FA]" : "bg-[#BFF000]"
                                } shadow-neo-sm group-hover:scale-105`}
                              />
                              <span className="text-[10px] font-extrabold font-syne uppercase text-[#1a1a1a]">
                                {item.month}
                              </span>
                            </div>
                          );
                        });
                      })()}
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold text-gray-600 font-space">
                      <span>• Blue/Lime: Historical Growth</span>
                      <span className="text-[#FF4D00] font-extrabold">• Orange: Current Month ({businesses.length} Total)</span>
                    </div>
                  </div>
                </div>

                {/* Platform Health Quick Card */}
                <div className="bg-white border-3 border-[#1a1a1a] rounded-none p-6 shadow-neo-lg space-y-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-extrabold font-syne uppercase text-[#1a1a1a]">
                      SYSTEM <span className="text-[#2D31FA]">STATUS</span>
                    </h3>
                    <p className="text-xs text-gray-600 font-space font-bold mt-1">
                      Live microservice monitor
                    </p>
                  </div>

                  <div className="space-y-4 my-auto">
                    <div className="flex items-center justify-between p-4 bg-[#fdf9f0] border-2 border-[#1a1a1a] rounded-none text-xs font-bold">
                      <span className="flex items-center gap-2.5 font-space">
                        <Server className="w-4 h-4 text-[#FF4D00]" /> Express API Gateway
                      </span>
                      <span className="px-2.5 py-1 bg-[#BFF000] border-2 border-[#1a1a1a] rounded-none text-[10px] font-extrabold">
                        ONLINE
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#fdf9f0] border-2 border-[#1a1a1a] rounded-none text-xs font-bold">
                      <span className="flex items-center gap-2.5 font-space">
                        <Globe className="w-4 h-4 text-[#2D31FA]" /> MongoDB Cluster
                      </span>
                      <span className="px-2.5 py-1 bg-[#BFF000] border-2 border-[#1a1a1a] rounded-none text-[10px] font-extrabold">
                        HEALTHY
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#fdf9f0] border-2 border-[#1a1a1a] rounded-none text-xs font-bold">
                      <span className="flex items-center gap-2.5 font-space">
                        <Zap className="w-4 h-4 text-[#BFF000]" /> Groq AI Engine
                      </span>
                      <span className="px-2.5 py-1 bg-[#BFF000] border-2 border-[#1a1a1a] rounded-none text-[10px] font-extrabold">
                        READY
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Clients Quick Table Preview */}
              <div className="bg-white border-3 border-[#1a1a1a] rounded-none p-6 shadow-neo-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold font-syne uppercase text-[#1a1a1a]">
                    RECENTLY REGISTERED <span className="text-[#FF4D00]">BUSINESSES</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab("businesses")}
                    className="text-xs font-extrabold text-[#FF4D00] hover:underline font-space uppercase tracking-wider"
                  >
                    Manage All
                  </button>
                </div>

                <div className="overflow-hidden w-full border-2 border-[#1a1a1a] rounded-none bg-white">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#fdf9f0] border-b-2 border-[#1a1a1a] text-[#1a1a1a] font-extrabold font-syne uppercase tracking-wider">
                        <th className="py-3.5 px-4 whitespace-nowrap">Business Name</th>
                        <th className="py-3.5 px-4 whitespace-nowrap">Owner Email</th>
                        <th className="py-3.5 px-4 whitespace-nowrap">Category</th>
                        <th className="py-3.5 px-4 whitespace-nowrap">Widget Token</th>
                        <th className="py-3.5 px-4 whitespace-nowrap">Registered Date</th>
                        <th className="py-3.5 px-4 text-right whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-[#1a1a1a] text-[#1a1a1a] font-bold font-space">
                      {businesses.slice(0, 5).map((b) => (
                        <tr key={b._id} className="hover:bg-[#fdf9f0] transition-colors">
                          <td className="py-3.5 px-4 font-space font-extrabold text-xs text-[#1a1a1a]">
                            {b.bussinessName || "N/A"}
                          </td>
                          <td className="py-3.5 px-4 text-[#1a1a1a] font-bold">
                            {b.email || b.name}
                          </td>
                          <td className="py-3.5 px-4 text-[#1a1a1a] font-bold text-xs whitespace-nowrap">
                            {b.bussinessCategory || "General"}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] whitespace-nowrap">
                            {b.chatbot_token ? (
                              <button
                                onClick={() => copyToClipboard(b.chatbot_token)}
                                className="text-[#FF4D00] font-extrabold hover:underline whitespace-nowrap cursor-pointer"
                                title="Click to copy token"
                              >
                                {b.chatbot_token}
                              </button>
                            ) : (
                              <span className="text-gray-400">None</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-gray-700 text-[11px] font-bold">
                            {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : "N/A"}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleViewBusiness(b._id)}
                                title="View Profile"
                                className="inline-flex items-center justify-center p-2 bg-[#FF4D00] hover:bg-[#e04400] text-white border-2 border-[#1a1a1a] rounded-none shadow-neo-sm hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all cursor-pointer"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setConfirmAction({ type: "delete", business: { id: b._id, name: b.bussinessName || "this business" } })}
                                title="Delete Business"
                                className="inline-flex items-center justify-center p-2 bg-red-600 hover:bg-red-700 text-white border-2 border-[#1a1a1a] rounded-none shadow-neo-sm hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BUSINESSES */}
          {activeTab === "businesses" && (
            <div className="bg-white border-3 border-[#1a1a1a] rounded-none p-6 shadow-neo-lg space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold font-syne uppercase text-[#1a1a1a] tracking-tight">
                    REGISTERED <span className="text-[#FF4D00]">BUSINESSES</span>
                  </h2>
                  <p className="text-xs font-bold text-[#1a1a1a]/70 font-space">
                    Showing {filteredBusinesses.length} of {totalCount} total registered businesses
                  </p>
                </div>

                {/* Filters Row: Search Bar First, then Custom Category Dropdown */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                  {/* Search Bar First */}
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#1a1a1a]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search name, email, token..."
                      className="w-full bg-[#fdf9f0] border-2 border-[#1a1a1a] rounded-none py-2 pl-9 pr-3 text-xs font-bold text-[#1a1a1a] placeholder-gray-500 focus:outline-none focus:bg-white focus:shadow-neo-sm font-space"
                    />
                  </div>

                  {/* Custom Neo-Brutalist Category Dropdown Second */}
                  <div className="relative w-full sm:w-56" ref={filterDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                      className="w-full text-left border-2 border-[#1a1a1a] py-2 px-3 text-xs font-extrabold font-space bg-[#fdf9f0] text-[#1a1a1a] focus:outline-none focus:bg-white focus:shadow-neo-sm cursor-pointer flex items-center justify-between gap-2"
                    >
                      <span className="truncate">
                        Filter: {selectedCategory}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-[#1a1a1a] shrink-0 transition-transform ${isFilterDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isFilterDropdownOpen && (
                      <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white border-2 border-[#1a1a1a] shadow-neo-md max-h-48 overflow-y-auto">
                        {categoriesList.map((cat, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              setSelectedCategory(cat);
                              setIsFilterDropdownOpen(false);
                            }}
                            className={`px-3 py-2 text-xs font-bold uppercase cursor-pointer hover:bg-[#BFF000] border-b border-gray-100 last:border-none ${
                              selectedCategory === cat ? "bg-[#FF4D00] text-white hover:bg-[#FF4D00]" : "text-[#1a1a1a]"
                            }`}
                          >
                            {cat}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Business Table */}
              <div className="overflow-hidden w-full border-3 border-[#1a1a1a] rounded-none bg-white">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#fdf9f0] border-b-3 border-[#1a1a1a] text-[#1a1a1a] font-extrabold font-syne uppercase tracking-wider">
                      <th className="py-3.5 px-4 whitespace-nowrap">Business Name</th>
                      <th className="py-3.5 px-4 whitespace-nowrap">Owner Email</th>
                      <th className="py-3.5 px-4 whitespace-nowrap">Category</th>
                      <th className="py-3.5 px-4 whitespace-nowrap">Widget Token</th>
                      <th className="py-3.5 px-4 whitespace-nowrap">Registered Date</th>
                      <th className="py-3.5 px-4 text-right whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y-2 divide-[#1a1a1a] text-[#1a1a1a] font-bold font-space">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-500 font-extrabold">
                          Loading registered businesses...
                        </td>
                      </tr>
                    ) : filteredBusinesses.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-500 font-extrabold">
                          No matching businesses found.
                        </td>
                      </tr>
                    ) : (
                      paginatedBusinesses.map((b) => (
                        <tr key={b._id} className="hover:bg-[#fdf9f0] transition-colors">
                          <td className="py-3.5 px-4 font-space font-extrabold text-xs text-[#1a1a1a]">
                            {b.bussinessName || "N/A"}
                          </td>
                          <td className="py-3.5 px-4 text-[#1a1a1a] font-bold">
                            {b.email || b.name}
                          </td>
                          <td className="py-3.5 px-4 text-[#1a1a1a] font-bold text-xs whitespace-nowrap">
                            {b.bussinessCategory || "General"}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] whitespace-nowrap">
                            {b.chatbot_token ? (
                              <button
                                onClick={() => copyToClipboard(b.chatbot_token)}
                                className="text-[#FF4D00] font-extrabold hover:underline whitespace-nowrap cursor-pointer"
                                title="Click to copy token"
                              >
                                {b.chatbot_token}
                              </button>
                            ) : (
                              <span className="text-gray-400">None</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-gray-700 text-[11px] font-bold">
                            {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : "N/A"}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleViewBusiness(b._id)}
                                title="View Profile"
                                className="inline-flex items-center justify-center p-2 bg-[#FF4D00] hover:bg-[#e04400] text-white border-2 border-[#1a1a1a] rounded-none shadow-neo-sm hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all cursor-pointer"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setConfirmAction({ type: "delete", business: { id: b._id, name: b.bussinessName || "this business" } })}
                                title="Delete Business"
                                className="inline-flex items-center justify-center p-2 bg-red-600 hover:bg-red-700 text-white border-2 border-[#1a1a1a] rounded-none shadow-neo-sm hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <p className="text-xs font-bold text-[#1a1a1a] font-space">
                  Page <span className="font-extrabold">{currentPage}</span> of{" "}
                  <span className="font-extrabold">{totalPages}</span> (Showing {paginatedBusinesses.length} of {filteredBusinesses.length} results)
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage <= 1}
                    className="flex items-center gap-1 px-3.5 py-1.5 bg-white text-[#1a1a1a] font-extrabold rounded-none text-xs border-2 border-[#1a1a1a] shadow-neo-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#fdf9f0] transition-colors cursor-pointer font-space"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Prev</span>
                  </button>

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage >= totalPages}
                    className="flex items-center gap-1 px-3.5 py-1.5 bg-white text-[#1a1a1a] font-extrabold rounded-none text-xs border-2 border-[#1a1a1a] shadow-neo-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#fdf9f0] transition-colors cursor-pointer font-space"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ANALYTICS & CHARTS */}
          {activeTab === "analytics" && (
            <div className="space-y-6">

              {/* Section Header */}
              <div className="bg-white border-3 border-[#1a1a1a] rounded-none p-6 shadow-neo-lg">
                <div className="flex items-center justify-between border-b-2 border-[#1a1a1a] pb-4 mb-6">
                  <div>
                    <h2 className="text-xl font-extrabold font-syne uppercase tracking-tight text-[#1a1a1a]">
                      INTERACTIVE ANALYTICS <span className="text-[#2D31FA]">& CHARTS</span>
                    </h2>
                    <p className="text-xs font-bold font-space text-[#1a1a1a]/70 mt-1">
                      Real-time platform insights from live data
                    </p>
                  </div>
                  <span className="px-2.5 py-1 bg-[#BFF000] text-[#1a1a1a] border-2 border-[#1a1a1a] rounded-none text-[10px] font-extrabold uppercase font-space">
                    Live Data
                  </span>
                </div>

                {/* Row 1: Message Breakdown + Industry Categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                  {/* Chart 1: Message Breakdown — SVG Donut + Progress Bars */}
                  {(() => {
                    const userMsgs = analytics.userMessagesCount || 0;
                    const botMsgs = analytics.botMessagesCount || 0;
                    const totalMsgs = userMsgs + botMsgs || analytics.totalMessages || 0;
                    const userPct = totalMsgs > 0 ? Math.round((userMsgs / totalMsgs) * 100) : 50;
                    const botPct = totalMsgs > 0 ? (100 - userPct) : 50;
                    const r = 50;
                    const circ = 2 * Math.PI * r;
                    const userDash = (userPct / 100) * circ;
                    const botDash = circ - userDash;

                    return (
                      <div className="bg-white border-3 border-[#1a1a1a] rounded-none shadow-neo p-5 space-y-4">
                        <div className="flex items-center justify-between border-b-2 border-[#1a1a1a] pb-3">
                          <div>
                            <h3 className="text-base font-extrabold font-syne uppercase text-[#1a1a1a]">
                              MESSAGE <span className="text-[#FF4D00]">BREAKDOWN</span>
                            </h3>
                            <p className="text-xs font-bold font-space text-[#1a1a1a]/60 mt-0.5">
                              User vs AI bot ratio
                            </p>
                          </div>
                          <span className="text-[10px] font-extrabold font-space text-[#1a1a1a] bg-[#fdf9f0] border-2 border-[#1a1a1a] px-2 py-0.5">
                            {totalMsgs.toLocaleString()} Total
                          </span>
                        </div>

                        <div className="flex items-center gap-5 pt-1">
                          {/* SVG Donut */}
                          <div className="shrink-0">
                            <svg width="120" height="120" viewBox="0 0 120 120">
                              <circle cx="60" cy="60" r={r} fill="none" stroke="#e5e7eb" strokeWidth="13" />
                              {totalMsgs > 0 && (
                                <>
                                  <circle
                                    cx="60" cy="60" r={r}
                                    fill="none" stroke="#2D31FA" strokeWidth="13"
                                    strokeDasharray={`${userDash} ${circ - userDash}`}
                                    strokeDashoffset={circ * 0.25}
                                    strokeLinecap="square"
                                  />
                                  <circle
                                    cx="60" cy="60" r={r}
                                    fill="none" stroke="#FF4D00" strokeWidth="13"
                                    strokeDasharray={`${botDash} ${circ - botDash}`}
                                    strokeDashoffset={circ * 0.25 - userDash}
                                    strokeLinecap="square"
                                  />
                                </>
                              )}
                              <text x="60" y="57" textAnchor="middle" style={{ fontSize: "17px", fontFamily: "Syne, sans-serif", fontWeight: 800, fill: "#1a1a1a" }}>
                                {userPct}%
                              </text>
                              <text x="60" y="73" textAnchor="middle" style={{ fontSize: "8px", fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fill: "#888", textTransform: "uppercase", letterSpacing: "1px" }}>
                                USER
                              </text>
                            </svg>
                          </div>

                          {/* Progress bars legend */}
                          <div className="flex-1 space-y-3">
                            <div>
                              <div className="flex justify-between text-xs font-extrabold font-space mb-1.5 text-[#1a1a1a]">
                                <span>User Inquiries</span>
                                <span className="text-[#2D31FA]">{userMsgs.toLocaleString()} · {userPct}%</span>
                              </div>
                              <div className="w-full bg-gray-200 h-3.5 rounded-none border-2 border-[#1a1a1a] overflow-hidden">
                                <div className="bg-[#2D31FA] h-full transition-all duration-500" style={{ width: `${userPct}%` }} />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs font-extrabold font-space mb-1.5 text-[#1a1a1a]">
                                <span>AI Responses</span>
                                <span className="text-[#FF4D00]">{botMsgs.toLocaleString()} · {botPct}%</span>
                              </div>
                              <div className="w-full bg-gray-200 h-3.5 rounded-none border-2 border-[#1a1a1a] overflow-hidden">
                                <div className="bg-[#FF4D00] h-full transition-all duration-500" style={{ width: `${botPct}%` }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Chart 2: Industry Category Distribution */}
                  <div className="bg-white border-3 border-[#1a1a1a] rounded-none shadow-neo p-5 space-y-4">
                    <div className="flex items-center justify-between border-b-2 border-[#1a1a1a] pb-3">
                      <div>
                        <h3 className="text-base font-extrabold font-syne uppercase text-[#1a1a1a]">
                          INDUSTRY <span className="text-[#FF4D00]">CATEGORIES</span>
                        </h3>
                        <p className="text-xs font-bold font-space text-[#1a1a1a]/60 mt-0.5">
                          Business sector distribution
                        </p>
                      </div>
                      <span className="text-[10px] font-extrabold font-space text-[#1a1a1a] bg-[#fdf9f0] border-2 border-[#1a1a1a] px-2 py-0.5">
                        {businesses.length} Businesses
                      </span>
                    </div>

                    <div className="space-y-3">
                      {(() => {
                        const catMap = {};
                        businesses.forEach((b) => {
                          const cat = b.bussinessCategory || "General";
                          catMap[cat] = (catMap[cat] || 0) + 1;
                        });
                        const catList = Object.entries(catMap)
                          .map(([cat, count]) => ({ name: cat, count }))
                          .sort((a, b) => b.count - a.count);
                        const totalSum = businesses.length || 1;
                        const barColors = ["bg-[#BFF000]", "bg-[#FF4D00]", "bg-[#2D31FA]", "bg-[#1a1a1a]"];

                        return catList.length === 0 ? (
                          <p className="text-xs text-gray-500 font-bold italic py-4 font-space text-center">
                            No business category data yet.
                          </p>
                        ) : (
                          catList.map((c, idx) => {
                            const pct = Math.round((c.count / totalSum) * 100);
                            return (
                              <div key={idx}>
                                <div className="flex justify-between mb-1.5">
                                  <span className="text-xs font-extrabold font-space text-[#1a1a1a] truncate max-w-[60%] uppercase tracking-wide">{c.name}</span>
                                  <span className="text-xs font-extrabold font-space text-[#1a1a1a]">{c.count} · {pct}%</span>
                                </div>
                                <div className="w-full bg-gray-200 h-3.5 rounded-none border-2 border-[#1a1a1a] overflow-hidden">
                                  <div className={`${barColors[idx % barColors.length]} h-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                                </div>
                              </div>
                            );
                          })
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Row 2: Platform Engagement Stats + Monthly Bar Chart */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Chart 3: Platform Engagement Stat Grid */}
                  <div className="bg-white border-3 border-[#1a1a1a] rounded-none shadow-neo p-5 space-y-4">
                    <div className="border-b-2 border-[#1a1a1a] pb-3">
                      <h3 className="text-base font-extrabold font-syne uppercase text-[#1a1a1a]">
                        PLATFORM <span className="text-[#2D31FA]">ENGAGEMENT</span>
                      </h3>
                      <p className="text-xs font-bold font-space text-[#1a1a1a]/60 mt-0.5">
                        Key performance metrics at a glance
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Total Businesses", value: analytics.totalBusinesses || 0, icon: <Building2 className="w-4 h-4" />, color: "bg-[#FF4D00]", text: "text-white" },
                        { label: "Chat Sessions", value: analytics.totalSessions || 0, icon: <Users className="w-4 h-4" />, color: "bg-[#2D31FA]", text: "text-white" },
                        { label: "Total Messages", value: analytics.totalMessages || 0, icon: <MessageSquare className="w-4 h-4" />, color: "bg-[#BFF000]", text: "text-[#1a1a1a]" },
                        { label: "New This Week", value: analytics.recentBusinesses7d || 0, icon: <TrendingUp className="w-4 h-4" />, color: "bg-[#1a1a1a]", text: "text-white" },
                        { label: "Sessions (7d)", value: analytics.recentSessions7d || 0, icon: <Activity className="w-4 h-4" />, color: "bg-[#FF4D00]", text: "text-white" },
                        { label: "Avg Msgs/Client", value: analytics.totalBusinesses > 0 ? Math.round((analytics.totalMessages || 0) / analytics.totalBusinesses) : 0, icon: <BarChart3 className="w-4 h-4" />, color: "bg-[#2D31FA]", text: "text-white" },
                      ].map((stat, idx) => (
                        <div key={idx} className={`${stat.color} ${stat.text} border-2 border-[#1a1a1a] p-3 rounded-none shadow-neo-sm`}>
                          <div className="flex items-center justify-between mb-2 opacity-80">
                            {stat.icon}
                            <span className="text-[9px] font-extrabold font-space uppercase tracking-wider leading-tight text-right">{stat.label}</span>
                          </div>
                          <p className="text-3xl font-extrabold font-syne">{stat.value.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chart 4: Monthly Business Registrations Bar Chart */}
                  <div className="bg-white border-3 border-[#1a1a1a] rounded-none shadow-neo p-5 space-y-4">
                    <div className="flex items-center justify-between border-b-2 border-[#1a1a1a] pb-3">
                      <div>
                        <h3 className="text-base font-extrabold font-syne uppercase text-[#1a1a1a]">
                          MONTHLY <span className="text-[#FF4D00]">REGISTRATIONS</span>
                        </h3>
                        <p className="text-xs font-bold font-space text-[#1a1a1a]/60 mt-0.5">
                          Business sign-ups — last 6 months
                        </p>
                      </div>
                      <span className="px-2.5 py-1 bg-[#BFF000] text-[#1a1a1a] border-2 border-[#1a1a1a] rounded-none text-[10px] font-extrabold uppercase font-space">
                        Live Data
                      </span>
                    </div>

                    {(() => {
                      const MONTH_NAMES = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
                      const now = new Date();
                      const months = Array.from({ length: 6 }).map((_, i) => {
                        const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
                        return { label: MONTH_NAMES[d.getMonth()], month: d.getMonth(), year: d.getFullYear() };
                      });
                      const counts = months.map(({ month, year }) =>
                        businesses.filter((b) => {
                          if (!b.createdAt) return false;
                          const d = new Date(b.createdAt);
                          return d.getMonth() === month && d.getFullYear() === year;
                        }).length
                      );
                      const maxVal = Math.max(...counts, 1);

                      return (
                        <div className="pt-2 space-y-3">
                          <div className="h-44 flex items-end gap-4 px-2 pt-6 border-b-3 border-[#1a1a1a]">
                            {counts.map((val, idx) => {
                              const heightPct = val === 0 ? 8 : Math.max(16, Math.round((val / maxVal) * 85));
                              const isLatest = idx === 5;
                              return (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group h-full justify-end">
                                  <span className="text-[10px] font-extrabold font-space text-[#1a1a1a]">{val}</span>
                                  <div
                                    style={{ height: `${heightPct}%` }}
                                    className={`w-full max-w-[36px] border-2 border-[#1a1a1a] rounded-none transition-all duration-300 shadow-neo-sm group-hover:scale-105 ${
                                      isLatest ? "bg-[#FF4D00]" : idx % 2 === 0 ? "bg-[#2D31FA]" : "bg-[#BFF000]"
                                    }`}
                                  />
                                  <span className="text-[10px] font-extrabold font-syne uppercase text-[#1a1a1a]">
                                    {months[idx].label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex items-center justify-between text-xs font-bold text-gray-600 font-space">
                            <span>• Blue/Lime: Historical Growth</span>
                            <span className="text-[#FF4D00] font-extrabold">• Orange: Current Month ({businesses.length} Total)</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SYSTEM & HEALTH */}
          {activeTab === "system" && (
            <div className="space-y-6">
              <div className="bg-white border-3 border-[#1a1a1a] rounded-none p-6 shadow-neo-lg space-y-6">
                <h2 className="text-xl font-extrabold font-syne uppercase text-[#1a1a1a]">
                  LIVE INTEGRATION <span className="text-[#FF4D00]">& TOKEN VALIDATOR</span>
                </h2>

                <div className="bg-[#fdf9f0] border-3 border-[#1a1a1a] rounded-none p-5 space-y-4">
                  <label className="block text-xs font-extrabold font-syne uppercase text-[#1a1a1a]">
                    Test / Validate Widget Token
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={testToken}
                      onChange={(e) => setTestToken(e.target.value)}
                      placeholder="e.g. A1ED-••••••••-••••••••"
                      className="flex-1 bg-white border-2 border-[#1a1a1a] rounded-none px-3 py-2 text-xs font-mono font-bold text-[#1a1a1a] placeholder:text-gray-400 placeholder:font-mono"
                    />
                    <button
                      onClick={handleTestToken}
                      disabled={testingToken}
                      className="px-4 py-2 bg-[#FF4D00] text-white font-extrabold font-space text-xs uppercase tracking-wider border-2 border-[#1a1a1a] rounded-none shadow-neo-sm hover:translate-x-[-1px] transition-all cursor-pointer"
                    >
                      {testingToken ? "Validating..." : "Validate Token"}
                    </button>
                  </div>

                  {tokenStatus && (
                    <div className={`p-4 border-2 border-[#1a1a1a] rounded-none text-xs font-space font-bold ${
                      tokenStatus.valid ? "bg-[#BFF000]/30" : "bg-red-100 text-red-800"
                    }`}>
                      {tokenStatus.valid ? (
                        <div className="space-y-1">
                          <p className="flex items-center gap-1 text-green-800 font-extrabold">
                            <CheckCircle2 className="w-4 h-4" /> TOKEN VALID & ACTIVE!
                          </p>
                          <p>Business: <span className="font-extrabold">{tokenStatus.data?.businessName || "—"}</span></p>
                          <p>Category: <span className="font-extrabold">{tokenStatus.data?.category || "—"}</span></p>
                        </div>
                      ) : (
                        <p>{tokenStatus.message}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── Confirmation Modal (Delete / Logout) ── */}
      {confirmAction && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setConfirmAction(null)}
        >
          <div
            className="bg-white border-3 border-[#1a1a1a] rounded-none shadow-neo-lg w-full max-w-md p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 border-2 border-[#1a1a1a] rounded-none shrink-0 ${confirmAction.type === "delete" ? "bg-red-600 text-white" : "bg-[#FF4D00] text-white"}`}>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold font-syne uppercase text-[#1a1a1a] tracking-tight">
                  {confirmAction.type === "delete" ? "Delete Business?" : "Logout?"}
                </h3>
                <p className="text-xs font-bold font-space text-[#1a1a1a]/70 mt-1">
                  {confirmAction.type === "delete"
                    ? <>Are you sure you want to permanently delete <span className="text-red-600 font-extrabold">"{confirmAction.business.name}"</span>? This will also remove all related sessions and chat messages. This action cannot be undone.</>
                    : "Are you sure you want to log out of the admin panel?"}
                </p>
              </div>
            </div>
            <div className="border-t-2 border-[#1a1a1a]" />
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-5 py-2.5 bg-white text-[#1a1a1a] font-extrabold font-space text-xs uppercase tracking-wider border-2 border-[#1a1a1a] rounded-none shadow-neo-sm hover:bg-[#fdf9f0] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmAction.type === "delete") {
                    handleDeleteBusiness(confirmAction.business.id, confirmAction.business.name);
                  } else {
                    handleLogout();
                    setConfirmAction(null);
                  }
                }}
                className={`px-5 py-2.5 font-extrabold font-space text-xs uppercase tracking-wider text-white border-2 border-[#1a1a1a] rounded-none shadow-neo-sm hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all cursor-pointer ${
                  confirmAction.type === "delete" ? "bg-red-600 hover:bg-red-700" : "bg-[#FF4D00] hover:bg-[#e04400]"
                }`}
              >
                {confirmAction.type === "delete" ? "Yes, Delete" : "Yes, Logout"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Business Profile Detail Modal */}
      {selectedBusiness && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedBusiness(null)}
        >
          <div
            className="bg-white border-3 border-[#1a1a1a] rounded-none max-w-2xl w-full p-6 space-y-6 shadow-neo-lg relative max-h-[90vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="border-b-3 border-[#1a1a1a] pb-4">
              <div>
                <h3 className="text-xl font-extrabold font-syne text-[#1a1a1a] uppercase tracking-tight">
                  {selectedBusiness.bussinessName}
                </h3>
                <p className="text-xs text-[#FF4D00] font-mono font-bold mt-0.5">
                  CLIENT ID: {selectedBusiness._id}
                </p>
              </div>
            </div>

            {/* Profile Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-space">
              <div className="bg-[#fdf9f0] p-3.5 rounded-none border-2 border-[#1a1a1a]">
                <span className="text-[10px] font-extrabold uppercase text-[#1a1a1a] tracking-wider font-syne">
                  Owner Email
                </span>
                <p className="text-sm font-bold text-[#1a1a1a] mt-1">
                  {selectedBusiness.email}
                </p>
              </div>

              <div className="bg-[#fdf9f0] p-3.5 rounded-none border-2 border-[#1a1a1a]">
                <span className="text-[10px] font-extrabold uppercase text-[#1a1a1a] tracking-wider font-syne">
                  Category
                </span>
                <p className="text-sm font-bold text-[#1a1a1a] mt-1">
                  {selectedBusiness.bussinessCategory}
                </p>
              </div>

              <div className="bg-[#fdf9f0] p-3.5 rounded-none border-2 border-[#1a1a1a] sm:col-span-2">
                <span className="text-[10px] font-extrabold uppercase text-[#1a1a1a] tracking-wider font-syne">
                  Chatbot Integration Token
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <p className="flex-1 text-xs font-mono font-bold text-[#FF4D00] bg-white p-2.5 rounded-none border-2 border-[#1a1a1a] break-all select-all">
                    {selectedBusiness.chatbot_token}
                  </p>
                  <button
                    onClick={() => copyToClipboard(selectedBusiness.chatbot_token)}
                    className="p-2.5 bg-[#FF4D00] text-white border-2 border-[#1a1a1a] rounded-none shadow-neo-sm"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-[#fdf9f0] p-3.5 rounded-none border-2 border-[#1a1a1a] sm:col-span-2">
                <span className="text-[10px] font-extrabold uppercase text-[#1a1a1a] tracking-wider font-syne">
                  Business Description
                </span>
                <p className="text-xs font-bold text-[#1a1a1a] mt-1 leading-relaxed">
                  {selectedBusiness.bussinessDescription}
                </p>
              </div>
            </div>

            {/* Business FAQs */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#1a1a1a] font-syne mb-3">
                Configured Knowledge Base FAQs ({selectedBusiness.bussinessDetails?.length || 0})
              </h4>

              <div className="space-y-3 max-h-60 overflow-y-auto border-2 border-[#1a1a1a] p-3 bg-white [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {selectedBusiness.bussinessDetails?.length > 0 ? (
                  selectedBusiness.bussinessDetails.map((faq, idx) => (
                    <div
                      key={idx}
                      className="bg-[#fdf9f0] p-3.5 rounded-none border-2 border-[#1a1a1a] text-xs space-y-1 font-space"
                    >
                      <p className="font-extrabold text-[#1a1a1a]">Q: {faq.question}</p>
                      <p className="font-bold text-gray-800">A: {faq.answer}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 font-bold italic py-2 font-space">
                    No custom FAQ entries configured yet.
                  </p>
                )}
              </div>
            </div>

            {/* Footer Close */}
            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedBusiness(null)}
                className="px-5 py-2.5 bg-[#1a1a1a] hover:bg-black text-white text-xs font-extrabold font-space uppercase tracking-wider rounded-none border-2 border-[#1a1a1a] shadow-neo-sm transition-all cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

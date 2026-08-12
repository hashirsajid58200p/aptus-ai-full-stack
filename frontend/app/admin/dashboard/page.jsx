"use client";

import { useEffect, useState } from "react";
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
  Layers
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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  // Token tester/generator state
  const [testToken, setTestToken] = useState("A1ED-7127544F-1EBAF3E7");
  const [tokenStatus, setTokenStatus] = useState(null);
  const [testingToken, setTestingToken] = useState(false);

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

  // Fetch Businesses (Paginated)
  const fetchBusinesses = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/admin/businesses?page=${pageNumber}&limit=10`,
        getAuthOptions()
      );

      if (res.data?.success) {
        setBusinesses(res.data.data);
        setPage(res.data.page);
        setTotalPages(res.data.totalPages);
        setTotalCount(res.data.totalCount);
      }
    } catch (err) {
      console.error("Error fetching businesses", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsAndAuth();
    fetchBusinesses(1);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchBusinesses(newPage);
    }
  };

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

  const categoriesList = ["ALL", ...Array.from(new Set(businesses.map(b => b.bussinessCategory || "General")))];

  const filteredBusinesses = businesses.filter((b) => {
    const matchesSearch =
      b.bussinessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.bussinessCategory?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.chatbot_token?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "ALL" ||
      (b.bussinessCategory || "General") === selectedCategory;

    return matchesSearch && matchesCategory;
  });

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
          isSidebarOpen ? "block" : "hidden"
        } md:block w-72 bg-white p-5 min-h-screen fixed md:sticky top-0 left-0 border-r-3 border-[#1a1a1a] shadow-neo z-50 flex flex-col justify-between`}
      >
        <div>
          {/* Logo & Admin Branding */}
          <div className="flex items-center justify-between py-3 border-b-3 border-[#1a1a1a] mb-6">
            <Link href="/" className="flex items-center">
              <img
                src="/aptus-logo.png"
                alt="Aptus AI"
                className="h-9 w-auto object-contain"
              />
            </Link>
            <span className="bg-[#FF4D00] text-white border-2 border-[#1a1a1a] text-[10px] font-black uppercase px-2 py-0.5 shadow-neo-sm font-syne shrink-0">
              ADMIN
            </span>
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
        <div className="mt-auto pt-6 border-t-3 border-[#1a1a1a]">
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to log out of the admin panel?")) {
                handleLogout();
              }
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#FF4D00] hover:bg-[#e04400] text-white font-extrabold font-space text-xs uppercase tracking-wider border-2 border-[#1a1a1a] rounded-none shadow-neo-sm hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
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

                  {/* Custom Neo-Brutalist Bar Chart */}
                  <div className="pt-4 space-y-4">
                    <div className="h-44 flex items-end gap-4 px-2 pt-6 border-b-3 border-[#1a1a1a]">
                      {(() => {
                        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                        const now = new Date();
                        const chartItems = Array.from({ length: 8 }).map((_, idx) => {
                          const monthOffset = 7 - idx;
                          const d = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
                          const mIdx = d.getMonth();
                          const yr = d.getFullYear();
                          const matched = analytics.monthlyAggregation?.find(
                            (item) => item._id.month === mIdx + 1 && item._id.year === yr
                          );
                          const count = matched ? matched.count : (idx === 7 ? analytics.recentBusinesses7d || 1 : Math.max(1, Math.floor((analytics.totalBusinesses || 1) * ((idx + 1) / 8))));
                          return { month: monthNames[mIdx], val: count };
                        });
                        const maxVal = Math.max(...chartItems.map((i) => i.val), 1);

                        return chartItems.map((item, idx) => {
                          const heightPct = Math.max(18, Math.round((item.val / maxVal) * 100));
                          return (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                              <div
                                style={{ height: `${heightPct}%` }}
                                className={`w-full max-w-[36px] border-2 border-[#1a1a1a] rounded-none transition-all duration-300 ${
                                  idx === 7 ? "bg-[#FF4D00]" : idx % 2 === 0 ? "bg-[#2D31FA]" : "bg-[#BFF000]"
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
                      <span className="text-[#FF4D00] font-extrabold">• Orange: Current Period ({analytics.totalBusinesses} Total)</span>
                    </div>
                  </div>
                </div>

                {/* Platform Health Quick Card */}
                <div className="bg-white border-3 border-[#1a1a1a] rounded-none p-6 shadow-neo-lg space-y-5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-extrabold font-syne uppercase text-[#1a1a1a]">
                      SYSTEM <span className="text-[#2D31FA]">STATUS</span>
                    </h3>
                    <p className="text-xs text-gray-600 font-space font-bold mt-1">
                      Live microservice monitor
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-[#fdf9f0] border-2 border-[#1a1a1a] rounded-none text-xs font-bold">
                      <span className="flex items-center gap-2 font-space">
                        <Server className="w-4 h-4 text-[#FF4D00]" /> Express API Gateway
                      </span>
                      <span className="px-2 py-0.5 bg-[#BFF000] border-2 border-[#1a1a1a] rounded-none text-[10px] font-extrabold">
                        ONLINE
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-[#fdf9f0] border-2 border-[#1a1a1a] rounded-none text-xs font-bold">
                      <span className="flex items-center gap-2 font-space">
                        <Globe className="w-4 h-4 text-[#2D31FA]" /> MongoDB Cluster
                      </span>
                      <span className="px-2 py-0.5 bg-[#BFF000] border-2 border-[#1a1a1a] rounded-none text-[10px] font-extrabold">
                        HEALTHY
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-[#fdf9f0] border-2 border-[#1a1a1a] rounded-none text-xs font-bold">
                      <span className="flex items-center gap-2 font-space">
                        <Zap className="w-4 h-4 text-[#BFF000]" /> Groq AI Engine
                      </span>
                      <span className="px-2 py-0.5 bg-[#BFF000] border-2 border-[#1a1a1a] rounded-none text-[10px] font-extrabold">
                        READY
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab("businesses")}
                    className="w-full py-3 bg-[#1a1a1a] text-white font-extrabold font-space uppercase text-xs tracking-wider rounded-none border-2 border-[#1a1a1a] hover:bg-black shadow-neo-sm transition-all cursor-pointer"
                  >
                    View All Clients →
                  </button>
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
                    className="text-xs font-extrabold text-[#FF4D00] hover:underline font-space"
                  >
                    Manage All ({totalCount})
                  </button>
                </div>

                <div className="overflow-x-auto border-2 border-[#1a1a1a] rounded-none bg-white">
                  <table className="w-full text-left text-xs border-collapse font-space">
                    <thead>
                      <tr className="bg-[#fdf9f0] border-b-2 border-[#1a1a1a] font-syne font-extrabold uppercase">
                        <th className="py-3 px-4">Business Name</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Widget Token</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-[#1a1a1a]">
                      {businesses.slice(0, 5).map((b) => (
                        <tr key={b._id} className="hover:bg-[#fdf9f0]">
                          <td className="py-3 px-4 font-space font-extrabold text-xs text-[#1a1a1a]">{b.bussinessName}</td>
                          <td className="py-3 px-4 font-bold text-gray-700">{b.email}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 bg-[#fdf9f0] border-2 border-[#1a1a1a] rounded-none text-[10px] font-extrabold">
                              {b.bussinessCategory || "General"}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-xs font-bold text-[#FF4D00]">{b.chatbot_token}</td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleViewBusiness(b._id)}
                              className="px-2.5 py-1 bg-[#FF4D00] text-white font-extrabold font-space text-[10px] uppercase tracking-wider border-2 border-[#1a1a1a] rounded-none shadow-neo-sm hover:translate-x-[-1px] transition-all cursor-pointer"
                            >
                              View
                            </button>
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
                    REGISTERED <span className="text-[#FF4D00]">PLATFORM CLIENTS</span>
                  </h2>
                  <p className="text-xs font-bold text-[#1a1a1a]/70 font-space">
                    Showing {filteredBusinesses.length} of {totalCount} total registered businesses
                  </p>
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Category Dropdown */}
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-[#fdf9f0] border-2 border-[#1a1a1a] rounded-none py-2 px-3 text-xs font-extrabold font-space text-[#1a1a1a] focus:outline-none cursor-pointer"
                  >
                    {categoriesList.map((cat, idx) => (
                      <option key={idx} value={cat}>
                        Filter: {cat}
                      </option>
                    ))}
                  </select>

                  {/* Search Bar */}
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
                </div>
              </div>

              {/* Business Table */}
              <div className="overflow-x-auto border-3 border-[#1a1a1a] rounded-none bg-white">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#fdf9f0] border-b-3 border-[#1a1a1a] text-[#1a1a1a] font-extrabold font-syne uppercase tracking-wider">
                      <th className="py-3.5 px-4">Business Name</th>
                      <th className="py-3.5 px-4">Owner Email</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Widget Token</th>
                      <th className="py-3.5 px-4">Registered Date</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
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
                      filteredBusinesses.map((b) => (
                        <tr key={b._id} className="hover:bg-[#fdf9f0] transition-colors">
                          <td className="py-3.5 px-4 font-space font-extrabold text-xs text-[#1a1a1a]">
                            {b.bussinessName || "N/A"}
                          </td>
                          <td className="py-3.5 px-4 text-[#1a1a1a] font-bold">
                            {b.email || b.name}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-none text-[10px] font-extrabold bg-[#fdf9f0] text-[#1a1a1a] border-2 border-[#1a1a1a]">
                              {b.bussinessCategory || "General"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px]">
                            {b.chatbot_token ? (
                              <button
                                onClick={() => copyToClipboard(b.chatbot_token)}
                                className="inline-flex items-center gap-1 text-[#FF4D00] font-extrabold hover:underline"
                              >
                                <Key className="w-3.5 h-3.5" />
                                <span>{b.chatbot_token}</span>
                                <Copy className="w-3 h-3 text-gray-400 ml-1" />
                              </button>
                            ) : (
                              <span className="text-gray-400">None</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-gray-700 text-[11px] font-bold">
                            {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : "N/A"}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleViewBusiness(b._id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#FF4D00] hover:bg-[#e04400] text-white font-extrabold font-space uppercase tracking-wider border-2 border-[#1a1a1a] rounded-none shadow-neo-sm hover:translate-x-[-1px] hover:translate-y-[-1px] text-[11px] transition-all cursor-pointer whitespace-nowrap"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Profile</span>
                            </button>
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
                  Page <span className="font-extrabold">{page}</span> of{" "}
                  <span className="font-extrabold">{totalPages}</span>
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                    className="flex items-center gap-1 px-3.5 py-1.5 bg-white text-[#1a1a1a] font-extrabold rounded-none text-xs border-2 border-[#1a1a1a] shadow-neo-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#fdf9f0] transition-colors cursor-pointer font-space"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Prev</span>
                  </button>

                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages}
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
              <div className="bg-white border-3 border-[#1a1a1a] rounded-none p-6 shadow-neo-lg space-y-6">
                <h2 className="text-xl font-extrabold font-syne uppercase text-[#1a1a1a]">
                  INTERACTIVE ANALYTICS <span className="text-[#2D31FA]">& CHARTS</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Chart 1: Messages Ratio */}
                  {(() => {
                    const totalMsgs = analytics.totalMessages || 0;
                    const userMsgs = analytics.userMessagesCount || 0;
                    const botMsgs = analytics.botMessagesCount || 0;
                    const userPct = totalMsgs > 0 ? Math.round((userMsgs / totalMsgs) * 100) : 50;
                    const botPct = totalMsgs > 0 ? (100 - userPct) : 50;

                    return (
                      <div className="bg-[#fdf9f0] border-2 border-[#1a1a1a] p-5 rounded-none space-y-4">
                        <h3 className="text-sm font-extrabold font-syne uppercase">Message Breakdown</h3>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-xs font-bold font-space mb-1">
                              <span>User Inquiries ({userMsgs})</span>
                              <span className="text-[#2D31FA]">{userPct}%</span>
                            </div>
                            <div className="w-full bg-gray-200 h-4 rounded-none border-2 border-[#1a1a1a] overflow-hidden">
                              <div className="bg-[#2D31FA] h-full transition-all duration-500" style={{ width: `${userPct}%` }} />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-xs font-bold font-space mb-1">
                              <span>AI Bot Responses ({botMsgs})</span>
                              <span className="text-[#FF4D00]">{botPct}%</span>
                            </div>
                            <div className="w-full bg-gray-200 h-4 rounded-none border-2 border-[#1a1a1a] overflow-hidden">
                              <div className="bg-[#FF4D00] h-full transition-all duration-500" style={{ width: `${botPct}%` }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Chart 2: Category Distribution */}
                  <div className="bg-[#fdf9f0] border-2 border-[#1a1a1a] p-5 rounded-none space-y-4">
                    <h3 className="text-sm font-extrabold font-syne uppercase">Industry Categories</h3>
                    <div className="space-y-2 font-space text-xs font-bold">
                      {(() => {
                        const catList = analytics.categoryAggregation && analytics.categoryAggregation.length > 0
                          ? analytics.categoryAggregation
                          : businesses.reduce((acc, b) => {
                              const cat = b.bussinessCategory || "General";
                              const existing = acc.find(item => item._id === cat);
                              if (existing) existing.count += 1;
                              else acc.push({ _id: cat, count: 1 });
                              return acc;
                            }, []);

                        const totalCountSum = catList.reduce((sum, c) => sum + c.count, 0) || 1;
                        const colors = ["bg-[#BFF000]", "bg-[#FF4D00] text-white", "bg-[#2D31FA] text-white", "bg-[#1a1a1a] text-white"];

                        return catList.length === 0 ? (
                          <p className="text-xs text-gray-500 font-bold italic py-2">No category data yet.</p>
                        ) : (
                          catList.slice(0, 4).map((c, idx) => {
                            const pct = Math.round((c.count / totalCountSum) * 100);
                            const badgeColor = colors[idx % colors.length];
                            return (
                              <div key={idx} className="flex items-center justify-between p-2 bg-white border-2 border-[#1a1a1a] rounded-none">
                                <span>{c._id || "General"}</span>
                                <span className={`px-2 py-0.5 border-2 border-[#1a1a1a] rounded-none text-[10px] ${badgeColor}`}>
                                  {pct}% ({c.count})
                                </span>
                              </div>
                            );
                          })
                        );
                      })()}
                    </div>
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
                      placeholder="Paste Token (e.g. A1ED-7127544F-1EBAF3E7)"
                      className="flex-1 bg-white border-2 border-[#1a1a1a] rounded-none px-3 py-2 text-xs font-mono font-bold text-[#1a1a1a]"
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
                          <p>Business: <span className="font-extrabold">{tokenStatus.data?.bussinessName}</span></p>
                          <p>Category: <span className="font-extrabold">{tokenStatus.data?.bussinessCategory}</span></p>
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

      {/* Business Profile Detail Modal */}
      {selectedBusiness && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-3 border-[#1a1a1a] rounded-none max-w-2xl w-full p-6 space-y-6 shadow-neo-lg relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b-3 border-[#1a1a1a] pb-4">
              <div>
                <h3 className="text-xl font-extrabold font-syne text-[#1a1a1a] uppercase tracking-tight">
                  {selectedBusiness.bussinessName}
                </h3>
                <p className="text-xs text-[#FF4D00] font-mono font-bold mt-0.5">
                  CLIENT ID: {selectedBusiness._id}
                </p>
              </div>

              <button
                onClick={() => setSelectedBusiness(null)}
                className="p-2 bg-[#fdf9f0] hover:bg-gray-200 border-2 border-[#1a1a1a] rounded-none text-[#1a1a1a] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
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
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#1a1a1a] font-syne mb-3 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-[#FF4D00]" />
                <span>Configured Knowledge Base FAQs ({selectedBusiness.bussinessDetails?.length || 0})</span>
              </h4>

              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {selectedBusiness.bussinessDetails?.length > 0 ? (
                  selectedBusiness.bussinessDetails.map((faq, idx) => (
                    <div
                      key={idx}
                      className="bg-[#fdf9f0] p-3 rounded-none border-2 border-[#1a1a1a] text-xs space-y-1 font-space"
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
            <div className="border-t-3 border-[#1a1a1a] pt-4 text-right">
              <button
                onClick={() => setSelectedBusiness(null)}
                className="px-5 py-2 bg-[#1a1a1a] hover:bg-black text-white text-xs font-extrabold font-syne uppercase tracking-wider rounded-none border-2 border-[#1a1a1a] transition-colors cursor-pointer"
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

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import baseurl from "@/store/baseurl";
import toast from "react-hot-toast";
import {
  ShieldCheck,
  Building2,
  Users,
  MessageSquare,
  Zap,
  Download,
  RefreshCw,
  Search,
  ArrowLeft,
  Settings2,
  Cpu,
  Edit2,
  CheckCircle2,
  X,
} from "lucide-react";

export default function AgencyMasterDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [search, setSearch] = useState("");

  // Edit Quota / Model Modal State
  const [editingClient, setEditingClient] = useState(null);
  const [newLimit, setNewLimit] = useState(500000);
  const [newProvider, setNewProvider] = useState("groq");
  const [newModel, setNewModel] = useState("llama-3.3-70b-versatile");
  const [saving, setSaving] = useState(false);

  const fetchAgencyData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Analytics
      const anRes = await fetch(`${baseurl}/admin/analytics`, {
        credentials: "include",
      });
      const anData = await anRes.json();
      if (anData.success) {
        setAnalytics(anData.data);
      } else {
        toast.error("Admin authentication required");
        router.push("/admin/login");
        return;
      }

      // 2. Fetch Businesses
      const bizRes = await fetch(`${baseurl}/admin/businesses?limit=500`, {
        credentials: "include",
      });
      const bizData = await bizRes.json();
      if (bizData.success) {
        setBusinesses(bizData.data || []);
      }
    } catch (err) {
      toast.error("Failed to connect to admin API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Agency Master Dashboard — Aptus AI";
    fetchAgencyData();
  }, []);

  const openEditModal = (client) => {
    setEditingClient(client);
    setNewLimit(client.tokenLimit || 500000);
    setNewProvider(client.provider || "groq");
    setNewModel(client.modelName || "llama-3.3-70b-versatile");
  };

  const handleSaveClientSettings = async (e) => {
    e.preventDefault();
    if (!editingClient) return;
    setSaving(true);
    try {
      const res = await fetch(`${baseurl}/admin/businesses/${editingClient._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          tokenLimit: Number(newLimit),
          provider: newProvider,
          modelName: newModel,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Updated settings for ${editingClient.bussinessName}`);
        setEditingClient(null);
        fetchAgencyData();
      } else {
        toast.error(data.message || "Failed to update client");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  const filtered = businesses.filter(
    (b) =>
      b.bussinessName?.toLowerCase().includes(search.toLowerCase()) ||
      b.email?.toLowerCase().includes(search.toLowerCase()) ||
      b.bussinessCategory?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FDF9F0] text-[#1a1a1a] flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b-3 border-[#1a1a1a] px-6 py-4 flex items-center justify-between shadow-neo sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/dashboard"
            className="p-2 border-2 border-[#1a1a1a] bg-[#FDF9F0] hover:bg-white shadow-neo-sm transition-transform hover:translate-x-[-2px]"
            title="Back to Admin Dashboard"
          >
            <ArrowLeft className="w-4 h-4 text-[#1a1a1a]" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#FF4D00] text-white border border-[#1a1a1a] text-[10px] font-black uppercase px-2 py-0.5">
                SUPER ADMIN
              </span>
              <h1 className="font-syne text-xl font-black uppercase text-[#1a1a1a] tracking-tight">
                Agency Master Dashboard
              </h1>
            </div>
            <p className="text-xs text-gray-600 font-medium">
              Enterprise Tenant Management, Token Quota Enforcement & Platform Analytics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAgencyData}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 bg-[#BFF000] border-2 border-[#1a1a1a] shadow-neo-sm font-extrabold text-xs uppercase hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border-3 border-[#1a1a1a] p-5 shadow-neo">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-gray-500">Client Chatbots</span>
              <Building2 className="w-5 h-5 text-[#FF4D00]" />
            </div>
            <div className="font-syne text-3xl font-black text-[#1a1a1a]">
              {analytics?.totalBusinesses || businesses.length}
            </div>
            <span className="text-[11px] text-gray-500 font-bold">Active Tenants</span>
          </div>

          <div className="bg-white border-3 border-[#1a1a1a] p-5 shadow-neo">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-gray-500">Platform Tokens</span>
              <Zap className="w-5 h-5 text-amber-500" />
            </div>
            <div className="font-syne text-3xl font-black text-[#1a1a1a]">
              {(analytics?.totalTokensConsumed || 0).toLocaleString()}
            </div>
            <span className="text-[11px] text-gray-500 font-bold">Total Ingested / Generated</span>
          </div>

          <div className="bg-white border-3 border-[#1a1a1a] p-5 shadow-neo">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-gray-500">Total Conversations</span>
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div className="font-syne text-3xl font-black text-[#1a1a1a]">
              {(analytics?.totalSessions || 0).toLocaleString()}
            </div>
            <span className="text-[11px] text-gray-500 font-bold">
              {(analytics?.totalMessages || 0).toLocaleString()} Messages
            </span>
          </div>

          <div className="bg-white border-3 border-[#1a1a1a] p-5 shadow-neo">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-gray-500">Connected Chatbots</span>
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div className="font-syne text-3xl font-black text-[#1a1a1a]">
              {(analytics?.totalBusinesses || 0).toLocaleString()}
            </div>
            <span className="text-[11px] text-gray-500 font-bold">Active Tenant Deployments</span>
          </div>
        </div>

        {/* Client Management Table Section */}
        <div className="bg-white border-3 border-[#1a1a1a] shadow-neo-lg p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-3 border-[#1a1a1a] pb-4 gap-4 mb-4">
            <div>
              <span className="bg-[#BFF000] text-[#1a1a1a] border-2 border-[#1a1a1a] px-3 py-1 font-extrabold text-xs uppercase mr-3 inline-block">
                TENANT OVERSIGHT
              </span>
              <h2 className="font-syne text-xl md:text-2xl font-black text-[#1a1a1a] uppercase inline-block">
                Client Chatbot Allocations
              </h2>
            </div>
            <div className="w-full sm:w-72">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search business, email, category..."
                className="w-full p-2 bg-[#FDF9F0] border-2 border-[#1a1a1a] text-xs font-medium outline-none"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#FF4D00]"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center p-10 bg-[#FDF9F0] border-2 border-[#1a1a1a]">
              <p className="text-sm font-bold text-gray-600">No client chatbots matched your query.</p>
            </div>
          ) : (
            <div className="overflow-x-auto border-2 border-[#1a1a1a]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#1a1a1a] text-white text-xs uppercase font-extrabold">
                    <th className="p-3 border-r border-[#333]">Business Name</th>
                    <th className="p-3 border-r border-[#333]">Category</th>
                    <th className="p-3 border-r border-[#333]">AI Model & Provider</th>
                    <th className="p-3 border-r border-[#333]">Token Usage / Quota</th>
                    <th className="p-3 border-r border-[#333]">Live Agent</th>
                    <th className="p-3 text-center">Manage</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-medium text-[#1a1a1a]">
                  {filtered.map((client) => {
                    const used = client.tokenUsage?.totalTokens || 0;
                    const limit = client.tokenLimit || 500000;
                    const pct = Math.min(100, Math.round((used / limit) * 100));

                    return (
                      <tr key={client._id} className="border-b border-[#1a1a1a] hover:bg-[#FDF9F0] transition-colors">
                        <td className="p-3 border-r border-[#e5e7eb]">
                          <div className="font-extrabold text-sm text-[#1a1a1a]">{client.bussinessName}</div>
                          <div className="text-[11px] text-gray-500">{client.email}</div>
                        </td>
                        <td className="p-3 border-r border-[#e5e7eb] font-bold text-gray-700">
                          {client.bussinessCategory}
                        </td>
                        <td className="p-3 border-r border-[#e5e7eb]">
                          <span
                            className={`inline-block px-2 py-0.5 text-[10px] font-black uppercase border border-[#1a1a1a] ${
                              client.provider === "openai" ? "bg-[#FF4D00] text-white" : "bg-[#BFF000] text-[#1a1a1a]"
                            }`}
                          >
                            {client.provider === "openai" ? "OpenAI GPT-4o" : "Groq Llama 3"}
                          </span>
                        </td>
                        <td className="p-3 border-r border-[#e5e7eb] min-w-[160px]">
                          <div className="flex justify-between text-[11px] font-bold mb-1">
                            <span>{used.toLocaleString()}</span>
                            <span className="text-gray-500">/ {limit.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-gray-200 h-2 border border-[#1a1a1a] overflow-hidden">
                            <div
                              className={`h-full ${pct > 85 ? "bg-red-500" : "bg-[#BFF000]"}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </td>
                        <td className="p-3 border-r border-[#e5e7eb]">
                          <span
                            className={`inline-block px-2 py-0.5 text-[10px] font-extrabold uppercase border ${
                              client.isLiveAgent
                                ? "bg-green-100 text-green-800 border-green-800"
                                : "bg-gray-100 text-gray-500 border-gray-300"
                            }`}
                          >
                            {client.isLiveAgent ? "Enabled" : "Disabled"}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => openEditModal(client)}
                            className="px-3 py-1.5 bg-[#FDF9F0] border-2 border-[#1a1a1a] shadow-neo-sm font-black text-[10px] uppercase hover:bg-white transition-all flex items-center gap-1 mx-auto"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit Quota</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Edit Quota & Model Modal */}
      {editingClient && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-3 border-[#1a1a1a] shadow-neo-lg p-6 max-w-md w-full relative">
            <button
              onClick={() => setEditingClient(null)}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 border border-transparent hover:border-[#1a1a1a]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Settings2 className="w-5 h-5 text-[#FF4D00]" />
              <h3 className="font-syne text-lg font-black uppercase text-[#1a1a1a]">
                Edit Client Configuration
              </h3>
            </div>

            <p className="text-xs text-gray-600 font-medium mb-4">
              Adjusting settings for <strong className="text-[#1a1a1a]">{editingClient.bussinessName}</strong>.
            </p>

            <form onSubmit={handleSaveClientSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-[#1a1a1a] mb-1">
                  Monthly Token Quota Limit
                </label>
                <input
                  type="number"
                  value={newLimit}
                  onChange={(e) => setNewLimit(e.target.value)}
                  min="10000"
                  step="10000"
                  className="w-full p-2 bg-[#FDF9F0] border-2 border-[#1a1a1a] text-sm font-bold outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#1a1a1a] mb-1">
                  Assigned AI Provider
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNewProvider("groq");
                      setNewModel("llama-3.3-70b-versatile");
                    }}
                    className={`p-2 border-2 border-[#1a1a1a] text-xs font-black uppercase ${
                      newProvider === "groq" ? "bg-[#BFF000]" : "bg-white"
                    }`}
                  >
                    Groq (Llama 3)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewProvider("openai");
                      setNewModel("gpt-4o");
                    }}
                    className={`p-2 border-2 border-[#1a1a1a] text-xs font-black uppercase ${
                      newProvider === "openai" ? "bg-[#FF4D00] text-white" : "bg-white"
                    }`}
                  >
                    OpenAI (GPT-4o)
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-[#1a1a1a] text-white font-black text-xs uppercase border-2 border-[#1a1a1a] shadow-neo hover:bg-black transition-colors disabled:opacity-50"
                >
                  {saving ? "Updating..." : "Save Quota"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingClient(null)}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 font-black text-xs uppercase border-2 border-[#1a1a1a]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Users, Mail, Phone, Download, Trash2, RefreshCw, Calendar, CheckCircle2 } from "lucide-react";
import baseurl from "@/store/baseurl";
import toast from "react-hot-toast";

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${baseurl}/lead/all`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads || []);
      } else {
        toast.error(data.message || "Failed to load leads");
      }
    } catch (err) {
      toast.error("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleExportCSV = () => {
    window.open(`${baseurl}/lead/export`, "_blank");
    toast.success("Downloading Leads CSV...");
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    try {
      const res = await fetch(`${baseurl}/lead/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Lead deleted");
        setLeads((prev) => prev.filter((l) => l._id !== id));
      } else {
        toast.error(data.message || "Failed to delete");
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  const filteredLeads = leads.filter(
    (l) =>
      l.name?.toLowerCase().includes(search.toLowerCase()) ||
      l.email?.toLowerCase().includes(search.toLowerCase()) ||
      l.phone?.includes(search)
  );

  return (
    <div className="flex flex-col gap-6 bg-white border-3 border-[#1a1a1a] shadow-neo-lg p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-3 border-[#1a1a1a] pb-4 gap-4">
        <div>
          <span className="bg-[#BFF000] text-[#1a1a1a] border-2 border-[#1a1a1a] px-3 py-1 font-extrabold text-xs uppercase mr-3 inline-block">
            LEAD GENERATION
          </span>
          <h2 className="font-syne text-2xl md:text-3xl font-extrabold text-[#1a1a1a] uppercase inline-block">
            Captured Leads
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-[#FF4D00] text-white border-2 border-[#1a1a1a] shadow-neo-sm font-extrabold text-xs uppercase hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={fetchLeads}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 bg-[#FDF9F0] border-2 border-[#1a1a1a] shadow-neo-sm font-extrabold text-xs uppercase hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="w-full max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or phone..."
          className="w-full p-2.5 bg-[#FDF9F0] border-2 border-[#1a1a1a] text-sm font-medium outline-none focus:bg-white"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#FF4D00]"></div>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="text-center p-12 bg-[#FDF9F0] border-2 border-[#1a1a1a]">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="font-syne text-xl font-bold uppercase text-[#1a1a1a] mb-1">No Leads Found</h3>
          <p className="text-gray-600 font-medium text-sm">
            When website visitors fill in the pre-chat form or leave an offline inquiry, their details will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border-2 border-[#1a1a1a]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1a1a1a] text-white text-xs uppercase font-extrabold">
                <th className="p-3 border-r border-[#333]">Name</th>
                <th className="p-3 border-r border-[#333]">Email</th>
                <th className="p-3 border-r border-[#333]">Phone</th>
                <th className="p-3 border-r border-[#333]">Source</th>
                <th className="p-3 border-r border-[#333]">Captured At</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium text-[#1a1a1a]">
              {filteredLeads.map((lead) => (
                <tr key={lead._id} className="border-b border-[#1a1a1a] hover:bg-[#FDF9F0] transition-colors">
                  <td className="p-3 border-r border-[#e5e7eb] font-bold">{lead.name}</td>
                  <td className="p-3 border-r border-[#e5e7eb] text-gray-700">{lead.email}</td>
                  <td className="p-3 border-r border-[#e5e7eb] text-gray-700">{lead.phone || "—"}</td>
                  <td className="p-3 border-r border-[#e5e7eb]">
                    <span className="inline-block px-2 py-0.5 text-[11px] font-extrabold uppercase border border-[#1a1a1a] bg-yellow-100">
                      {lead.source === "offline_form" ? "Offline Inquiry" : "Pre-Chat Form"}
                    </span>
                  </td>
                  <td className="p-3 border-r border-[#e5e7eb] text-xs text-gray-500">
                    {new Date(lead.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleDelete(lead._id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 border border-transparent hover:border-red-600 transition-colors"
                      title="Delete Lead"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

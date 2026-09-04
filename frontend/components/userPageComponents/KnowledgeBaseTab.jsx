import React, { useState, useEffect } from "react";
import { BookOpen, FileText, Globe, Upload, Trash2, RefreshCw, CheckCircle, Database } from "lucide-react";
import baseurl from "@/store/baseurl";
import toast from "react-hot-toast";

export default function KnowledgeBaseTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Ingestion Mode: 'text' | 'url' | 'pdf'
  const [mode, setMode] = useState("text");

  // Form states
  const [title, setTitle] = useState("");
  const [textContent, setTextContent] = useState("");
  const [url, setUrl] = useState("");
  const [pdfFile, setPdfFile] = useState(null);

  const fetchKnowledge = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${baseurl}/chatbot/knowledge`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setItems(data.data || []);
      }
    } catch (err) {
      toast.error("Failed to load knowledge base");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKnowledge();
  }, []);

  const handleIngest = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "text") {
        if (!title || !textContent) {
          toast.error("Please provide a title and text content");
          setSubmitting(false);
          return;
        }
        const res = await fetch(`${baseurl}/chatbot/knowledge/text`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ title, text: textContent }),
        });
        const data = await res.json();
        if (data.success) {
          toast.success(data.message);
          setTitle("");
          setTextContent("");
          fetchKnowledge();
        } else {
          toast.error(data.message || "Failed to ingest text");
        }
      } else if (mode === "url") {
        if (!url) {
          toast.error("Please provide a valid URL");
          setSubmitting(false);
          return;
        }
        const res = await fetch(`${baseurl}/chatbot/knowledge/url`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ url, title: title || url }),
        });
        const data = await res.json();
        if (data.success) {
          toast.success(data.message);
          setUrl("");
          setTitle("");
          fetchKnowledge();
        } else {
          toast.error(data.message || "Failed to scrape URL");
        }
      } else if (mode === "pdf") {
        if (!pdfFile) {
          toast.error("Please select a PDF file");
          setSubmitting(false);
          return;
        }
        const reader = new FileReader();
        reader.onload = async () => {
          const base64 = reader.result.split(",")[1];
          const res = await fetch(`${baseurl}/chatbot/knowledge/pdf`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ title: title || pdfFile.name, pdfBase64: base64 }),
          });
          const data = await res.json();
          if (data.success) {
            toast.success(data.message);
            setTitle("");
            setPdfFile(null);
            fetchKnowledge();
          } else {
            toast.error(data.message || "Failed to parse PDF");
          }
          setSubmitting(false);
        };
        reader.readAsDataURL(pdfFile);
        return;
      }
    } catch (err) {
      toast.error("Network error during ingestion");
    } finally {
      if (mode !== "pdf") setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this document and all its chunks from knowledge base?")) return;
    try {
      const res = await fetch(`${baseurl}/chatbot/knowledge/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        fetchKnowledge();
      } else {
        toast.error(data.message || "Failed to delete");
      }
    } catch (err) {
      toast.error("Failed to delete document");
    }
  };

  return (
    <div className="flex flex-col gap-6 bg-white border-3 border-[#1a1a1a] shadow-neo-lg p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-3 border-[#1a1a1a] pb-4 gap-4">
        <div>
          <span className="bg-[#BFF000] text-[#1a1a1a] border-2 border-[#1a1a1a] px-3 py-1 font-extrabold text-xs uppercase mr-3 inline-block">
            VECTOR RAG
          </span>
          <h2 className="font-syne text-2xl md:text-3xl font-extrabold text-[#1a1a1a] uppercase inline-block">
            Knowledge Base
          </h2>
        </div>
        <button
          onClick={fetchKnowledge}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 bg-[#FDF9F0] border-2 border-[#1a1a1a] shadow-neo-sm font-extrabold text-xs uppercase hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Ingestion Type Tabs */}
      <div className="border-2 border-[#1a1a1a] p-5 bg-[#FDF9F0]">
        <h3 className="font-syne text-base font-extrabold uppercase text-[#1a1a1a] mb-3 flex items-center gap-2">
          <Database className="w-4 h-4 text-[#FF4D00]" />
          Add Training Data to RAG Knowledge Base
        </h3>

        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setMode("text")}
            className={`px-4 py-1.5 border-2 border-[#1a1a1a] text-xs font-black uppercase transition-all ${
              mode === "text" ? "bg-[#FF4D00] text-white shadow-neo-sm" : "bg-white hover:bg-gray-100"
            }`}
          >
            Raw Text / FAQ
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-4 py-1.5 border-2 border-[#1a1a1a] text-xs font-black uppercase transition-all ${
              mode === "url" ? "bg-[#FF4D00] text-white shadow-neo-sm" : "bg-white hover:bg-gray-100"
            }`}
          >
            Webpage URL
          </button>
          <button
            type="button"
            onClick={() => setMode("pdf")}
            className={`px-4 py-1.5 border-2 border-[#1a1a1a] text-xs font-black uppercase transition-all ${
              mode === "pdf" ? "bg-[#FF4D00] text-white shadow-neo-sm" : "bg-white hover:bg-gray-100"
            }`}
          >
            PDF Document
          </button>
        </div>

        <form onSubmit={handleIngest} className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-extrabold uppercase text-[#1a1a1a] mb-1">Document Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Return Policy, Pricing Guide, Company Handbook"
              className="w-full p-2.5 bg-white border-2 border-[#1a1a1a] text-sm font-medium outline-none"
              required={mode !== "pdf"}
            />
          </div>

          {mode === "text" && (
            <div>
              <label className="block text-xs font-extrabold uppercase text-[#1a1a1a] mb-1">Text Content</label>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Paste articles, policy documents, product catalogs, or full instructions here..."
                rows={5}
                className="w-full p-2.5 bg-white border-2 border-[#1a1a1a] text-sm font-medium outline-none resize-y"
                required
              />
            </div>
          )}

          {mode === "url" && (
            <div>
              <label className="block text-xs font-extrabold uppercase text-[#1a1a1a] mb-1">Webpage URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://yourwebsite.com/docs"
                className="w-full p-2.5 bg-white border-2 border-[#1a1a1a] text-sm font-medium outline-none"
                required
              />
            </div>
          )}

          {mode === "pdf" && (
            <div>
              <label className="block text-xs font-extrabold uppercase text-[#1a1a1a] mb-1">Select PDF File</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setPdfFile(e.target.files[0])}
                className="w-full p-2 bg-white border-2 border-[#1a1a1a] text-sm font-medium outline-none"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="self-start px-5 py-2.5 bg-[#1a1a1a] text-white font-extrabold text-xs uppercase border-2 border-[#1a1a1a] shadow-neo hover:bg-black transition-transform hover:translate-x-[-1px] hover:translate-y-[-1px] disabled:opacity-50"
          >
            {submitting ? "Processing & Embedding..." : "Ingest into Knowledge Base"}
          </button>
        </form>
      </div>

      {/* Uploaded Documents List */}
      <div>
        <h3 className="font-syne text-lg font-extrabold uppercase text-[#1a1a1a] mb-3">
          Indexed Documents ({items.length} Chunks)
        </h3>

        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF4D00]"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center p-8 bg-[#FDF9F0] border-2 border-[#1a1a1a]">
            <BookOpen className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 font-medium text-xs">No documents uploaded yet. Add text, URLs, or PDFs above.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-3 border-2 border-[#1a1a1a] bg-white hover:bg-gray-50 transition-colors text-xs font-medium"
              >
                <div className="flex items-center gap-3">
                  <span className="p-1.5 bg-[#FDF9F0] border border-[#1a1a1a]">
                    {item.sourceType === "url" ? <Globe className="w-4 h-4 text-blue-600" /> : <FileText className="w-4 h-4 text-green-600" />}
                  </span>
                  <div>
                    <div className="font-bold text-sm text-[#1a1a1a]">{item.title}</div>
                    <div className="text-gray-500 text-[11px]">
                      Source: <span className="uppercase font-bold">{item.sourceType}</span> • Chunk #{item.chunkIndex + 1} • {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-1.5 text-red-600 hover:bg-red-50 border border-transparent hover:border-red-600"
                  title="Delete document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

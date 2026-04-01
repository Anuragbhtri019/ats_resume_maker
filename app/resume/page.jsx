"use client";

import { useState, useRef, useCallback } from "react";
import { ResumeProvider } from "@/app/lib/ResumeContext";
import LeftForm from "@/app/components/LeftForm";
import ResumePreview from "@/app/components/ResumePreview";
import ExportModal from "@/app/components/ExportModal";
import { Download, Edit3, FileText, FileJson } from "lucide-react";

function ResumeBuilder() {
  const [exportOpen, setExportOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("form"); // 'form' | 'preview'
  const previewRef = useRef(null);
  const openExport = useCallback(() => setExportOpen(true), []);
  const closeExport = useCallback(() => setExportOpen(false), []);

  return (
    <div className="flex flex-col h-dvh w-screen overflow-hidden bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50">
      {/* Header */}
      <div className="flex-shrink-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50 shadow-lg">
        <div className="max-w-full px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg">
              <FileJson size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">ATS Resume</h1>
              <p className="text-xs text-slate-400 hidden sm:block">Professional Resume Builder</p>
            </div>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-xs text-slate-400">Create ATS-friendly resumes</p>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Tab Bar — hidden on lg+ */}
      <div className="lg:hidden flex-shrink-0 flex bg-white border-b border-slate-200 shadow-sm">
        <button
          onClick={() => setActiveTab("form")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-all ${
            activeTab === "form"
              ? "text-teal-600 border-b-2 border-teal-500 bg-teal-50/30"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Edit3 size={18} />
          Edit
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-all ${
            activeTab === "preview"
              ? "text-teal-600 border-b-2 border-teal-500 bg-teal-50/30"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <FileText size={18} />
          Preview
        </button>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 min-h-0 gap-0">
        {/* Left Panel — Form */}
        <div
          className={`${
            activeTab === "form" ? "flex" : "hidden"
          } lg:flex w-full lg:w-[38%] flex-shrink-0 flex-col overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 shadow-xl`}
        >
          <LeftForm />
        </div>

        {/* Right Panel — Preview */}
        <div
          className={`${
            activeTab === "preview" ? "flex" : "hidden"
          } lg:flex w-full lg:w-[62%] flex-col bg-white shadow-lg`}
        >
          <div className="flex-1 overflow-auto p-3 sm:p-6 lg:p-10 bg-gradient-to-br from-slate-50 to-blue-50">
            <ResumePreview ref={previewRef} />
          </div>

          {/* Export button bar */}
          <div className="flex-shrink-0 p-4 lg:p-6 border-t border-slate-200 bg-white/95 backdrop-blur-sm flex justify-center shadow-lg">
            <button onClick={openExport} className="btn-export">
              <Download size={20} />
              Export Resume
            </button>
          </div>
        </div>
      </div>

      <ExportModal
        open={exportOpen}
        onClose={closeExport}
        previewRef={previewRef}
      />
    </div>
  );
}

export default function ResumePage() {
  return (
    <ResumeProvider>
      <ResumeBuilder />
    </ResumeProvider>
  );
}

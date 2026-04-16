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
    <div className="flex h-dvh w-screen flex-col gap-3 overflow-hidden bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50 p-3 sm:gap-4 sm:p-4 lg:p-6">
      {/* Header */}
      <div className="flex-shrink-0 relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 shadow-lg">
        <div className="max-w-full px-4 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg flex-shrink-0">
              <FileJson size={22} className="text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-white tracking-tight leading-tight">
                ATS Resume
              </h1>
              <p className="text-xs text-slate-300 hidden sm:block leading-tight">
                Professional Resume Builder
              </p>
            </div>
          </div>

          <p className="hidden md:block text-right text-xs text-slate-300 leading-tight max-w-[220px]">
            Create ATS-friendly resumes
          </p>
        </div>

        <p className="absolute right-4 bottom-1 text-[11px] leading-none text-slate-200/85">
          © Anurag Bhattarai
        </p>
      </div>

      {/* Mobile / Tablet Tab Bar — hidden on lg+ */}
      <div className="lg:hidden flex-shrink-0 overflow-hidden rounded-2xl flex bg-white border border-slate-200 shadow-sm">
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

      <div className="flex flex-1 min-h-0 gap-3 sm:gap-4">
        {/* Left Panel — Form */}
        <div
          className={`$
            activeTab === "form" ? "flex" : "hidden"
          } lg:flex w-full lg:w-[42%] xl:w-[40%] min-w-[420px] flex-shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-700/40 bg-gradient-to-b from-slate-900 to-slate-800 shadow-2xl`}
        >
          <LeftForm />
        </div>

        {/* Right Panel — Preview */}
        <div
          className={`$
            activeTab === "preview" ? "flex" : "hidden"
          } lg:flex w-full lg:w-[58%] xl:w-[60%] min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl`}
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

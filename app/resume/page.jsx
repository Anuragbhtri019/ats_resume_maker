"use client";

import { useState, useRef, useCallback } from "react";
import { ResumeProvider } from "@/app/lib/ResumeContext";
import LeftForm from "@/app/components/LeftForm";
import ResumePreview from "@/app/components/ResumePreview";
import ExportModal from "@/app/components/ExportModal";
import { Download, Edit3, FileText } from "lucide-react";

function ResumeBuilder() {
  const [exportOpen, setExportOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("form"); // 'form' | 'preview'
  const previewRef = useRef(null);
  const openExport = useCallback(() => setExportOpen(true), []);
  const closeExport = useCallback(() => setExportOpen(false), []);

  return (
    <div className="flex flex-col h-dvh w-screen overflow-hidden">
      {/* Mobile / Tablet Tab Bar — hidden on lg+ */}
      <div className="lg:hidden flex-shrink-0 flex bg-slate-900 border-b border-slate-700/60">
        <button
          onClick={() => setActiveTab("form")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors ${
            activeTab === "form"
              ? "text-slate-100 border-b-2 border-teal-500"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Edit3 size={15} />
          Edit
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors ${
            activeTab === "preview"
              ? "text-slate-100 border-b-2 border-teal-500"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <FileText size={15} />
          Preview
        </button>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 min-h-0">
        {/* Left Panel — Form */}
        <div
          className={`${
            activeTab === "form" ? "flex" : "hidden"
          } lg:flex w-full lg:w-[35%] xl:w-[30%] flex-shrink-0 flex-col overflow-hidden`}
        >
          <LeftForm />
        </div>

        {/* Right Panel — Preview */}
        <div
          className={`${
            activeTab === "preview" ? "flex" : "hidden"
          } lg:flex w-full lg:w-[65%] xl:w-[70%] flex-col bg-gray-50`}
        >
          <div className="flex-1 overflow-auto p-3 sm:p-4 lg:p-8 xl:p-10">
            <ResumePreview ref={previewRef} />
          </div>

          {/* Export button bar */}
          <div className="flex-shrink-0 p-3 lg:p-4 border-t border-gray-200 bg-white/90 backdrop-blur-sm flex justify-center">
            <button onClick={openExport} className="btn-export">
              <Download size={18} />
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

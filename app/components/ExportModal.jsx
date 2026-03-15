"use client";

import { useResume } from "@/app/lib/ResumeContext";
import { toast } from "sonner";
import { FileText, FileSpreadsheet, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

export default function ExportModal({ open, onClose, previewRef }) {
  const { data } = useResume();
  const [exporting, setExporting] = useState(false);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === "Escape" && !exporting) onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose, exporting]);

  const handleExportPdf = useCallback(async () => {
    if (!previewRef?.current) {
      toast.error("Preview not ready");
      return;
    }
    setExporting(true);
    try {
      const { exportToPdf } = await import("@/app/lib/exportPdf");
      await exportToPdf(previewRef.current, data.personal.name);
      toast.success("PDF downloaded!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to export PDF");
    } finally {
      setExporting(false);
    }
  }, [previewRef, data.personal.name, onClose]);

  const handleExportDocx = useCallback(async () => {
    if (!previewRef?.current) {
      toast.error("Preview not ready");
      return;
    }
    setExporting(true);
    try {
      const { exportToDocx } = await import("@/app/lib/exportDocx");
      await exportToDocx(previewRef.current, data.personal.name);
      toast.success("DOCX downloaded!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to export DOCX");
    } finally {
      setExporting(false);
    }
  }, [previewRef, data.personal.name, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm modal-backdrop"
      onClick={exporting ? undefined : onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-5 sm:p-8 max-w-md w-full mx-4 relative modal-content max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          disabled={exporting}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-2">Export Resume</h2>
        <p className="text-sm text-gray-500 mb-6">
          Choose your preferred format. A timestamp will be added at the bottom
          of the exported file.
        </p>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleExportPdf}
            disabled={exporting}
            className="export-card"
          >
            <FileText size={32} style={{ color: "#ef4444" }} />
            <span className="font-semibold text-gray-900">PDF</span>
            <span className="text-xs text-gray-500">Pixel-perfect output</span>
          </button>

          <button
            onClick={handleExportDocx}
            disabled={exporting}
            className="export-card"
          >
            <FileSpreadsheet size={32} style={{ color: "#3b82f6" }} />
            <span className="font-semibold text-gray-900">.doc</span>
            <span className="text-xs text-gray-500">Editable document</span>
          </button>
        </div>

        {exporting && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-purple-600">
            <span className="export-spinner" />
            Generating file...
          </div>
        )}
      </div>
    </div>
  );
}

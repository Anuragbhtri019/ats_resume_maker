'use client';

import { useResume } from '@/app/lib/ResumeContext';
import { toast } from 'sonner';
import { FileText, FileSpreadsheet, X } from 'lucide-react';
import { useState } from 'react';

export default function ExportModal({ open, onClose, previewRef }) {
  const { data } = useResume();
  const [exporting, setExporting] = useState(false);

  if (!open) return null;

  const handleExportPdf = async () => {
    if (!previewRef?.current) {
      toast.error('Preview not ready');
      return;
    }
    setExporting(true);
    try {
      const { exportToPdf } = await import('@/app/lib/exportPdf');
      await exportToPdf(previewRef.current, data.personal.name);
      toast.success('PDF downloaded!');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to export PDF');
    } finally {
      setExporting(false);
    }
  };

  const handleExportDocx = async () => {
    if (!previewRef?.current) {
      toast.error('Preview not ready');
      return;
    }
    setExporting(true);
    try {
      const { exportToDocx } = await import('@/app/lib/exportDocx');
      await exportToDocx(previewRef.current, data.personal.name);
      toast.success('DOCX downloaded!');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to export DOCX');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-2">Export Resume</h2>
        <p className="text-sm text-gray-500 mb-6">
          Choose your preferred format. A timestamp will be added at the bottom of the exported file.
        </p>

        <div className="flex gap-4">
          <button
            onClick={handleExportPdf}
            disabled={exporting}
            className="flex-1 flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileText size={32} className="text-red-500" />
            <span className="font-semibold text-gray-900">PDF</span>
            <span className="text-xs text-gray-500">Pixel-perfect output</span>
          </button>

          <button
            onClick={handleExportDocx}
            disabled={exporting}
            className="flex-1 flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileSpreadsheet size={32} className="text-blue-500" />
            <span className="font-semibold text-gray-900">.doc</span>
            <span className="text-xs text-gray-500">Editable document</span>
          </button>
        </div>

        {exporting && (
          <div className="mt-4 text-center text-sm text-purple-600 animate-pulse">
            Generating file...
          </div>
        )}
      </div>
    </div>
  );
}

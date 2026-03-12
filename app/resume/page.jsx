'use client';

import { useState, useRef, useCallback } from 'react';
import { ResumeProvider } from '@/app/lib/ResumeContext';
import LeftForm from '@/app/components/LeftForm';
import ResumePreview from '@/app/components/ResumePreview';
import ExportModal from '@/app/components/ExportModal';
import { Download } from 'lucide-react';

function ResumeBuilder() {
  const [exportOpen, setExportOpen] = useState(false);
  const previewRef = useRef(null);
  const openExport = useCallback(() => setExportOpen(true), []);
  const closeExport = useCallback(() => setExportOpen(false), []);

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen overflow-hidden">
      {/* Left Panel — 35% */}
      <div className="w-full lg:w-[35%] xl:w-[30%] h-[45vh] lg:h-full overflow-hidden flex-shrink-0">
        <LeftForm />
      </div>

      {/* Right Panel — 65% */}
      <div className="w-full lg:w-[65%] xl:w-[70%] h-[55vh] lg:h-full flex flex-col bg-gray-50">
        {/* Preview area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 xl:p-10">
          <ResumePreview ref={previewRef} />
        </div>

        {/* Export button bar */}
        <div className="p-3 lg:p-4 border-t border-gray-200 bg-white/90 backdrop-blur-sm flex justify-center">
          <button onClick={openExport} className="btn-export">
            <Download size={18} />
            Export Resume
          </button>
        </div>

        {/* Export modal */}
        <ExportModal
          open={exportOpen}
          onClose={closeExport}
          previewRef={previewRef}
        />
      </div>
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

'use client';

import { TEMPLATES } from '@/app/lib/templates';
import { useResume } from '@/app/lib/ResumeContext';
import { FileText } from 'lucide-react';

export default function TemplateSelector() {
  const { data, setTemplateType } = useResume();

  return (
    <div className="mb-4">
      <label className="flex items-center gap-2 text-white text-sm font-semibold mb-2">
        <FileText size={16} />
        Resume Type
      </label>
      <select
        value={data.templateType}
        onChange={(e) => setTemplateType(e.target.value)}
        className="form-input font-semibold cursor-pointer"
      >
        {Object.entries(TEMPLATES).map(([key, tmpl]) => (
          <option key={key} value={key}>
            {tmpl.label}
          </option>
        ))}
      </select>
      {TEMPLATES[data.templateType]?.description && (
        <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px', paddingLeft: '2px' }}>
          {TEMPLATES[data.templateType].description}
        </p>
      )}
    </div>
  );
}

'use client';

import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { DUMMY_DATA } from './dummyData';

const ResumeContext = createContext(null);

export function ResumeProvider({ children }) {
  const [data, setData] = useState(() => JSON.parse(JSON.stringify(DUMMY_DATA)));
  // Track which field is being edited on preview (to avoid cursor jumping)
  const activePreviewField = useRef(null);

  // Generic field updater using dot-path: "personal.name", "experience.0.company"
  const updateField = useCallback((path, value) => {
    setData((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) {
        const k = isNaN(keys[i]) ? keys[i] : Number(keys[i]);
        obj = obj[k];
      }
      const lastKey = isNaN(keys[keys.length - 1]) ? keys[keys.length - 1] : Number(keys[keys.length - 1]);
      obj[lastKey] = value;
      return next;
    });
  }, []);

  // Add item to an array section
  const addItem = useCallback((section, template) => {
    setData((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      if (Array.isArray(next[section])) {
        next[section].push(template);
      }
      return next;
    });
  }, []);

  // Remove item from an array section
  const removeItem = useCallback((section, index) => {
    setData((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      if (Array.isArray(next[section])) {
        next[section].splice(index, 1);
      }
      return next;
    });
  }, []);

  // Add bullet to experience/project
  const addBullet = useCallback((section, index) => {
    setData((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      if (next[section]?.[index]?.bullets) {
        next[section][index].bullets.push('');
      }
      return next;
    });
  }, []);

  // Remove bullet
  const removeBullet = useCallback((section, itemIndex, bulletIndex) => {
    setData((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      if (next[section]?.[itemIndex]?.bullets) {
        next[section][itemIndex].bullets.splice(bulletIndex, 1);
      }
      return next;
    });
  }, []);

  // Add social media row
  const addSocial = useCallback(() => {
    setData((prev) => ({
      ...prev,
      socialMedia: [...prev.socialMedia, { platform: '', url: '' }],
    }));
  }, []);

  // Remove social media row
  const removeSocial = useCallback((index) => {
    setData((prev) => {
      const next = { ...prev, socialMedia: [...prev.socialMedia] };
      next.socialMedia.splice(index, 1);
      return next;
    });
  }, []);

  // Set template type
  const setTemplateType = useCallback((type) => {
    setData((prev) => ({ ...prev, templateType: type }));
  }, []);

  // Load data from JSON
  const loadData = useCallback((json) => {
    try {
      const parsed = typeof json === 'string' ? JSON.parse(json) : json;
      setData(parsed);
      return true;
    } catch {
      return false;
    }
  }, []);

  // Reset to dummy data
  const resetToDummy = useCallback(() => {
    setData(JSON.parse(JSON.stringify(DUMMY_DATA)));
  }, []);

  // Update skills array (comma-separated string → array)
  const updateSkills = useCallback((field, value) => {
    setData((prev) => ({
      ...prev,
      [field]: typeof value === 'string' ? value.split(',').map((s) => s.trim()).filter(Boolean) : value,
    }));
  }, []);

  const value = {
    data,
    setData,
    updateField,
    addItem,
    removeItem,
    addBullet,
    removeBullet,
    addSocial,
    removeSocial,
    setTemplateType,
    loadData,
    resetToDummy,
    updateSkills,
    activePreviewField,
  };

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
}

export function useResume() {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error('useResume must be used within ResumeProvider');
  return ctx;
}

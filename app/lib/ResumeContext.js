'use client';

import { createContext, useContext, useState, useCallback, useRef, useMemo } from 'react';
import { DUMMY_DATA } from './dummyData';

const ResumeContext = createContext(null);

// Immutable update helper — performs structural sharing instead of deep clone
function setNestedValue(obj, keys, value) {
  if (keys.length === 0) return value;
  const [head, ...rest] = keys;
  const key = isNaN(head) ? head : Number(head);
  const child = obj[key];
  const updated = setNestedValue(child, rest, value);
  if (Array.isArray(obj)) {
    const copy = [...obj];
    copy[key] = updated;
    return copy;
  }
  return { ...obj, [key]: updated };
}

export function ResumeProvider({ children }) {
  const [data, setData] = useState(() => structuredClone(DUMMY_DATA));
  const activePreviewField = useRef(null);

  // Generic field updater using dot-path: "personal.name", "experience.0.company"
  const updateField = useCallback((path, value) => {
    const keys = path.split('.');
    setData((prev) => setNestedValue(prev, keys, value));
  }, []);

  // Add item to an array section
  const addItem = useCallback((section, template) => {
    setData((prev) => {
      if (!Array.isArray(prev[section])) return prev;
      return { ...prev, [section]: [...prev[section], typeof template === 'object' ? { ...template } : template] };
    });
  }, []);

  // Remove item from an array section
  const removeItem = useCallback((section, index) => {
    setData((prev) => {
      if (!Array.isArray(prev[section])) return prev;
      return { ...prev, [section]: prev[section].filter((_, i) => i !== index) };
    });
  }, []);

  // Add bullet to experience/project
  const addBullet = useCallback((section, index) => {
    setData((prev) => {
      const item = prev[section]?.[index];
      if (!item?.bullets) return prev;
      const newItems = [...prev[section]];
      newItems[index] = { ...item, bullets: [...item.bullets, ''] };
      return { ...prev, [section]: newItems };
    });
  }, []);

  // Remove bullet
  const removeBullet = useCallback((section, itemIndex, bulletIndex) => {
    setData((prev) => {
      const item = prev[section]?.[itemIndex];
      if (!item?.bullets) return prev;
      const newItems = [...prev[section]];
      newItems[itemIndex] = { ...item, bullets: item.bullets.filter((_, i) => i !== bulletIndex) };
      return { ...prev, [section]: newItems };
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

  // Load data from JSON with validation
  const loadData = useCallback((json) => {
    try {
      const parsed = typeof json === 'string' ? JSON.parse(json) : json;
      if (!parsed || typeof parsed !== 'object' || !parsed.personal) return false;
      setData(parsed);
      return true;
    } catch {
      return false;
    }
  }, []);

  // Reset to dummy data
  const resetToDummy = useCallback(() => {
    setData(structuredClone(DUMMY_DATA));
  }, []);

  // Update skills array (comma-separated string → array)
  const updateSkills = useCallback((field, value) => {
    setData((prev) => ({
      ...prev,
      [field]: typeof value === 'string' ? value.split(',').map((s) => s.trim()).filter(Boolean) : value,
    }));
  }, []);

  const value = useMemo(() => ({
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
  }), [data, setData, updateField, addItem, removeItem, addBullet, removeBullet, addSocial, removeSocial, setTemplateType, loadData, resetToDummy, updateSkills]);

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
}

export function useResume() {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error('useResume must be used within ResumeProvider');
  return ctx;
}

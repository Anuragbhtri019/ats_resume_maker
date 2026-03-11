"use client";

import { useState, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline,
  Type,
  Palette,
  List,
  RemoveFormatting,
} from "lucide-react";

export default function RichTextToolbar({
  targetRect,
  visible,
  cancelBlur,
  activeElementRef,
}) {
  const [fontSize, setFontSize] = useState("3");
  const [textColor, setTextColor] = useState("#000000");

  // Position the toolbar above the target element
  const style = targetRect
    ? {
        position: "fixed",
        top: Math.max(targetRect.top - 44, 4),
        left: Math.max(targetRect.left, 4),
        zIndex: 9999,
      }
    : { display: "none" };

  const refocusTarget = useCallback(() => {
    if (activeElementRef?.current) {
      activeElementRef.current.focus();
    }
  }, [activeElementRef]);

  const exec = useCallback(
    (command, value = null) => {
      refocusTarget();
      document.execCommand(command, false, value);
    },
    [refocusTarget],
  );

  const handleFontSize = (e) => {
    const val = e.target.value;
    setFontSize(val);
    refocusTarget();
    document.execCommand("fontSize", false, val);
  };

  const handleColor = (e) => {
    const val = e.target.value;
    setTextColor(val);
    refocusTarget();
    document.execCommand("foreColor", false, val);
  };

  const handleToolbarMouseDown = (e) => {
    e.preventDefault();
    if (cancelBlur) cancelBlur();
  };

  const handleToolbarMouseEnter = () => {
    if (cancelBlur) cancelBlur();
  };

  if (!visible) return null;

  return (
    <div
      data-toolbar="true"
      style={style}
      className="flex items-center gap-1 bg-gray-900 text-white rounded-lg px-2 py-1.5 shadow-xl border border-gray-700"
      onMouseDown={handleToolbarMouseDown}
      onMouseEnter={handleToolbarMouseEnter}
    >
      <button
        onClick={() => exec("bold")}
        className="p-1 hover:bg-gray-700 rounded transition-colors"
        title="Bold"
      >
        <Bold size={15} />
      </button>
      <button
        onClick={() => exec("italic")}
        className="p-1 hover:bg-gray-700 rounded transition-colors"
        title="Italic"
      >
        <Italic size={15} />
      </button>
      <button
        onClick={() => exec("underline")}
        className="p-1 hover:bg-gray-700 rounded transition-colors"
        title="Underline"
      >
        <Underline size={15} />
      </button>

      <div className="w-px h-5 bg-gray-600 mx-1" />

      <div className="flex items-center gap-1">
        <Type size={13} className="text-gray-400" />
        <select
          value={fontSize}
          onChange={handleFontSize}
          className="bg-gray-800 text-white text-xs rounded px-1 py-0.5 outline-none cursor-pointer"
          onMouseDown={(e) => {
            e.stopPropagation();
            if (cancelBlur) cancelBlur();
          }}
          onFocus={() => {
            if (cancelBlur) cancelBlur();
          }}
          onBlur={() => refocusTarget()}
        >
          {[1, 2, 3, 4, 5, 6, 7].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1">
        <Palette size={13} className="text-gray-400" />
        <input
          type="color"
          value={textColor}
          onChange={handleColor}
          className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
          onMouseDown={(e) => {
            e.stopPropagation();
            if (cancelBlur) cancelBlur();
          }}
          onFocus={() => {
            if (cancelBlur) cancelBlur();
          }}
          onBlur={() => refocusTarget()}
          title="Text Color"
        />
      </div>

      <div className="w-px h-5 bg-gray-600 mx-1" />

      <button
        onClick={() => exec("insertUnorderedList")}
        className="p-1 hover:bg-gray-700 rounded transition-colors"
        title="Bullet List"
      >
        <List size={15} />
      </button>
      <button
        onClick={() => exec("removeFormat")}
        className="p-1 hover:bg-gray-700 rounded transition-colors"
        title="Clear Formatting"
      >
        <RemoveFormatting size={15} />
      </button>
    </div>
  );
}

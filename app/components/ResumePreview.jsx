"use client";

import { useResume } from "@/app/lib/ResumeContext";
import { TEMPLATES } from "@/app/lib/templates";
import RichTextToolbar from "./RichTextToolbar";
import {
  useState,
  useRef,
  useCallback,
  forwardRef,
  useEffect,
  useMemo,
} from "react";
import { Phone, Mail, MapPin, Github, Linkedin, Globe } from "lucide-react";

const SOCIAL_ICONS = { github: Github, linkedin: Linkedin, website: Globe };

function getSocialIcon(platform) {
  const key = (platform || "").toLowerCase();
  for (const [k, Icon] of Object.entries(SOCIAL_ICONS)) {
    if (key.includes(k)) return Icon;
  }
  return Globe;
}

const ResumePreview = forwardRef(function ResumePreview(props, ref) {
  const { data, updateField, updateSkills } = useResume();
  const [toolbarVisible, setToolbarVisible] = useState(false);
  const [toolbarRect, setToolbarRect] = useState(null);
  const [activeField, setActiveField] = useState(null);
  const blurTimeout = useRef(null);
  const innerRef = useRef(null);

  const setRef = useCallback(
    (node) => {
      innerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const activeElementRef = useRef(null);

  const cancelBlur = useCallback(() => {
    clearTimeout(blurTimeout.current);
  }, []);

  const handleFieldFocus = useCallback((field, element) => {
    clearTimeout(blurTimeout.current);
    setActiveField(field);
    activeElementRef.current = element;
    const rect = element.getBoundingClientRect();
    setToolbarRect(rect);
    setToolbarVisible(true);
  }, []);

  const handleFieldBlur = useCallback(
    (field, value) => {
      const parts = field.split(".");
      if (
        [
          "technicalSkills",
          "softSkills",
          "additionalSkills",
          "languages",
        ].includes(parts[0]) &&
        parts.length === 1
      ) {
        updateSkills(parts[0], value);
        return;
      }
      updateField(field, value);
    },
    [updateField, updateSkills],
  );

  const handleBlurDelay = useCallback(() => {
    blurTimeout.current = setTimeout(() => {
      setToolbarVisible(false);
      setActiveField(null);
      activeElementRef.current = null;
    }, 300);
  }, []);

  // Sync content from state → DOM (skip actively edited field)
  useEffect(() => {
    if (!innerRef.current) return;
    const editables = innerRef.current.querySelectorAll("[data-field]");
    editables.forEach((el) => {
      const field = el.getAttribute("data-field");
      if (field === activeField) return;
      const parts = field.split(".");
      let val = data;
      for (const p of parts) {
        if (val == null) break;
        val = isNaN(p) ? val[p] : val[Number(p)];
      }
      if (Array.isArray(val)) val = val.join(", ");
      if (el.innerText !== (val || "")) el.innerText = val || "";
    });
  }, [data, activeField]);

  const leftSections = useMemo(
    () => [
      "education",
      "technicalSkills",
      "softSkills",
      "additionalSkills",
      "languages",
      "certifications",
      "publications",
      "portfolioLinks",
    ],
    [],
  );
  const rightSections = useMemo(
    () => ["experience", "projects", "campaigns", "achievements"],
    [],
  );

  const activeSections = useMemo(
    () => TEMPLATES[data.templateType]?.sections || [],
    [data.templateType],
  );
  const leftActive = useMemo(
    () => activeSections.filter((s) => leftSections.includes(s)),
    [activeSections, leftSections],
  );
  const rightActive = useMemo(
    () => activeSections.filter((s) => rightSections.includes(s)),
    [activeSections, rightSections],
  );

  // Shared contentEditable props helper
  const editProps = (field) => ({
    contentEditable: true,
    suppressContentEditableWarning: true,
    "data-field": field,
    onFocus: (e) => handleFieldFocus(field, e.target),
    onBlur: (e) => {
      handleFieldBlur(field, e.target.innerText);
      handleBlurDelay();
    },
    onInput: (e) => handleFieldBlur(field, e.target.innerText),
  });

  // Reusable inline styles (so html2canvas reads them correctly — no oklch)
  // Memoized to avoid recreating on every render
  const heading = useMemo(
    () => ({
      fontSize: "10.5pt",
      color: "#111827",
      borderBottom: "2px solid #1f2937",
      paddingBottom: "4px",
      marginBottom: "8px",
      textTransform: "uppercase",
      letterSpacing: "1.5px",
      fontWeight: "bold",
    }),
    [],
  );
  const bodyText = useMemo(
    () => ({ fontSize: "9.5pt", color: "#374151", lineHeight: "1.55" }),
    [],
  );
  const subLabel = useMemo(() => ({ fontSize: "8.5pt", color: "#6b7280" }), []);

  return (
    <>
      <RichTextToolbar
        targetRect={toolbarRect}
        visible={toolbarVisible}
        cancelBlur={cancelBlur}
        activeElementRef={activeElementRef}
      />

      {/* A4 page — inline styles for pixel-perfect export */}
      <div
        ref={setRef}
        className="resume-page"
        style={{
          background: "#ffffff",
          width: "210mm",
          minHeight: "297mm",
          margin: "0 auto",
          padding: "0",
          fontFamily: '"Segoe UI", Arial, Helvetica, sans-serif',
          fontSize: "10pt",
          lineHeight: "1.45",
          color: "#111827",
          boxShadow: "0 4px 30px rgba(0,0,0,0.10)",
        }}
      >
        {/* Watermark */}
        <div
          style={{
            textAlign: "center",
            paddingTop: "12px",
            paddingBottom: "0",
          }}
        >
          <span
            style={{ fontSize: "7pt", color: "#d1d5db", letterSpacing: "3px" }}
          >
            ats-resume-maker-delta.vercel.app
          </span>
        </div>

        {/* Header */}
        <div style={{ textAlign: "center", padding: "10px 50px 16px" }}>
          <div
            {...editProps("personal.name")}
            style={{
              fontSize: "24pt",
              fontWeight: "bold",
              letterSpacing: "2px",
              color: "#111827",
            }}
          />
          <div
            {...editProps("personal.title")}
            style={{ fontSize: "12pt", color: "#4b5563", marginTop: "2px" }}
          />

          {/* Contact row */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "22px",
              marginTop: "12px",
              fontSize: "9.5pt",
              color: "#374151",
              flexWrap: "wrap",
            }}
          >
            {data.personal.phone && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <Phone size={13} color="#374151" /> {data.personal.phone}
              </span>
            )}
            {data.personal.email && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <Mail size={13} color="#374151" /> {data.personal.email}
              </span>
            )}
            {data.personal.location && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <MapPin size={13} color="#374151" /> {data.personal.location}
              </span>
            )}
          </div>

          {/* Social */}
          {data.socialMedia.length > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "18px",
                marginTop: "6px",
                fontSize: "9pt",
                color: "#6b7280",
                flexWrap: "wrap",
              }}
            >
              {data.socialMedia.map((social, i) => {
                const Icon = getSocialIcon(social.platform);
                return (
                  <span
                    key={i}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Icon size={12} color="#6b7280" /> {social.url}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid #e5e7eb", margin: "0 35px 4px" }} />

        {/* Body two-column */}
        <div
          style={{ display: "flex", padding: "12px 35px 35px", gap: "28px" }}
        >
          {/* LEFT COLUMN — 36% */}
          <div
            style={{
              width: "36%",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {/* Summary */}
            <div>
              <h3 style={heading}>Summary</h3>
              <div {...editProps("summary")} style={bodyText} />
            </div>

            {leftActive.map((key) => {
              switch (key) {
                case "education":
                  return (
                    <div key={key}>
                      <h3 style={heading}>Education</h3>
                      {data.education.map((edu, i) => (
                        <div key={i} style={{ marginBottom: "10px" }}>
                          <div
                            {...editProps(`education.${i}.school`)}
                            style={{
                              fontWeight: "bold",
                              fontSize: "9.5pt",
                              color: "#111827",
                            }}
                          />
                          <div
                            {...editProps(`education.${i}.degree`)}
                            style={{ fontSize: "9pt", color: "#374151" }}
                          />
                          <div style={subLabel}>
                            {edu.startDate} — {edu.endDate}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                case "technicalSkills":
                  return (
                    <div key={key}>
                      <h3 style={heading}>Technical Skills</h3>
                      <div {...editProps("technicalSkills")} style={bodyText} />
                    </div>
                  );
                case "softSkills":
                  return (
                    <div key={key}>
                      <h3 style={heading}>Soft Skills</h3>
                      <div {...editProps("softSkills")} style={bodyText} />
                    </div>
                  );
                case "additionalSkills":
                  return (
                    <div key={key}>
                      <h3 style={heading}>Additional Skills</h3>
                      <div
                        {...editProps("additionalSkills")}
                        style={bodyText}
                      />
                    </div>
                  );
                case "languages":
                  return (
                    <div key={key}>
                      <h3 style={heading}>Languages</h3>
                      <div {...editProps("languages")} style={bodyText} />
                    </div>
                  );
                case "certifications":
                  return (
                    <div key={key}>
                      <h3 style={heading}>Certifications</h3>
                      <ul
                        style={{
                          listStyleType: "none",
                          paddingLeft: "4px",
                          ...bodyText,
                        }}
                      >
                        {(data.certifications || []).map((c, i) => (
                          <li key={i} style={{ marginBottom: "3px" }}>
                            <span style={{ marginRight: "6px" }}>
                              {"\u2022"}
                            </span>
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                case "publications":
                  return (
                    <div key={key}>
                      <h3 style={heading}>Publications</h3>
                      {(data.publications || []).map((pub, i) => (
                        <div key={i} style={{ marginBottom: "6px" }}>
                          <div
                            style={{
                              fontWeight: "600",
                              fontSize: "9.5pt",
                              color: "#111827",
                            }}
                          >
                            {pub.title}
                          </div>
                          <div style={subLabel}>
                            {pub.journal} — {pub.date}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                case "portfolioLinks":
                  return (
                    <div key={key}>
                      <h3 style={heading}>Portfolio Links</h3>
                      {(data.portfolioLinks || []).map((pl, i) => (
                        <div key={i} style={bodyText}>
                          <span style={{ fontWeight: "600" }}>{pl.label}:</span>{" "}
                          {pl.url}
                        </div>
                      ))}
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </div>

          {/* RIGHT COLUMN — 64% */}
          <div
            style={{
              width: "64%",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {rightActive.map((key) => {
              switch (key) {
                case "experience":
                  return (
                    <div key={key}>
                      <h3 style={heading}>Work Experience</h3>
                      {data.experience.map((exp, i) => (
                        <div key={i} style={{ marginBottom: "16px" }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "baseline",
                            }}
                          >
                            <div
                              {...editProps(`experience.${i}.company`)}
                              style={{
                                fontWeight: "bold",
                                fontSize: "10.5pt",
                                color: "#111827",
                              }}
                            />
                            <span
                              style={{
                                fontSize: "8.5pt",
                                color: "#6b7280",
                                whiteSpace: "nowrap",
                                marginLeft: "10px",
                              }}
                            >
                              {exp.startDate} — {exp.endDate}
                            </span>
                          </div>
                          <div
                            {...editProps(`experience.${i}.role`)}
                            style={{
                              fontSize: "9.5pt",
                              color: "#374151",
                              fontStyle: "italic",
                            }}
                          />
                          {exp.description && (
                            <div
                              {...editProps(`experience.${i}.description`)}
                              style={{ ...bodyText, marginTop: "4px" }}
                            />
                          )}
                          {exp.bullets.length > 0 && (
                            <ul
                              style={{
                                listStyleType: "none",
                                paddingLeft: "4px",
                                marginTop: "6px",
                              }}
                            >
                              {exp.bullets.map((b, bi) => (
                                <li
                                  key={bi}
                                  style={{
                                    fontSize: "9pt",
                                    color: "#374151",
                                    lineHeight: "1.55",
                                    marginBottom: "3px",
                                  }}
                                >
                                  <span style={{ marginRight: "6px" }}>
                                    {"\u2022"}
                                  </span>
                                  <span
                                    {...editProps(
                                      `experience.${i}.bullets.${bi}`,
                                    )}
                                  />
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                case "projects":
                  return (
                    <div key={key}>
                      <h3 style={heading}>Projects</h3>
                      {(data.projects || []).map((proj, i) => (
                        <div key={i} style={{ marginBottom: "12px" }}>
                          <div
                            {...editProps(`projects.${i}.name`)}
                            style={{
                              fontWeight: "bold",
                              fontSize: "10.5pt",
                              color: "#111827",
                            }}
                          />
                          <div
                            {...editProps(`projects.${i}.description`)}
                            style={bodyText}
                          />
                          <div style={{ ...subLabel, marginTop: "2px" }}>
                            {proj.technologies} {proj.link && `• ${proj.link}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                case "campaigns":
                  return (
                    <div key={key}>
                      <h3 style={heading}>Campaigns</h3>
                      {(data.campaigns || []).map((camp, i) => (
                        <div key={i} style={{ marginBottom: "12px" }}>
                          <div
                            style={{
                              fontWeight: "bold",
                              fontSize: "10.5pt",
                              color: "#111827",
                            }}
                          >
                            {camp.name}
                          </div>
                          <div style={bodyText}>{camp.description}</div>
                          <div
                            style={{
                              ...subLabel,
                              fontStyle: "italic",
                              marginTop: "2px",
                            }}
                          >
                            {camp.metrics}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                case "achievements":
                  return (
                    <div key={key}>
                      <h3 style={heading}>Achievements</h3>
                      <ul style={{ listStyleType: "none", paddingLeft: "4px" }}>
                        {(data.achievements || []).map((a, i) => (
                          <li
                            key={i}
                            style={{ ...bodyText, marginBottom: "4px" }}
                          >
                            <span style={{ marginRight: "6px" }}>
                              {"\u2022"}
                            </span>
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </div>
        </div>
      </div>
    </>
  );
});

export default ResumePreview;

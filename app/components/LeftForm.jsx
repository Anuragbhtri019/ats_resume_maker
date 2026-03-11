"use client";

import { useResume } from "@/app/lib/ResumeContext";
import { TEMPLATES, SECTION_LABELS } from "@/app/lib/templates";
import TemplateSelector from "./TemplateSelector";
import { toast } from "sonner";
import { generateDataFileName } from "@/app/lib/utils";
import {
  Upload,
  Download,
  RotateCcw,
  Trash2,
  Plus,
  ChevronDown,
  ChevronUp,
  User,
  Briefcase,
  GraduationCap,
  Code,
  Heart,
  Star,
  Globe,
  Award,
  FolderOpen,
  Megaphone,
  Link,
  BookOpen,
  Trophy,
  Languages,
} from "lucide-react";
import { useState, useRef } from "react";
import { saveAs } from "file-saver";

// Section icon mapping
const SECTION_ICONS = {
  experience: Briefcase,
  education: GraduationCap,
  technicalSkills: Code,
  softSkills: Heart,
  additionalSkills: Star,
  languages: Languages,
  certifications: Award,
  projects: FolderOpen,
  campaigns: Megaphone,
  portfolioLinks: Link,
  publications: BookOpen,
  achievements: Trophy,
};

// Collapsible section wrapper
function Section({ title, icon: Icon, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "#e0e7ff",
          fontWeight: 600,
          fontSize: "13px",
          padding: "10px 14px",
          borderRadius: "10px",
          background: "rgba(99, 102, 241, 0.18)",
          border: "1px solid rgba(129, 140, 248, 0.15)",
          cursor: "pointer",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(99, 102, 241, 0.28)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "rgba(99, 102, 241, 0.18)")
        }
      >
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {Icon && <Icon size={15} />}
          {title}
        </span>
        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>
      {open && <div className="mt-3 space-y-3 px-1">{children}</div>}
    </div>
  );
}

export default function LeftForm() {
  const {
    data,
    updateField,
    addItem,
    removeItem,
    addBullet,
    removeBullet,
    addSocial,
    removeSocial,
    loadData,
    resetToDummy,
    updateSkills,
  } = useResume();
  const fileInputRef = useRef(null);

  // Save data as JSON
  const handleSave = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    saveAs(blob, generateDataFileName(data.personal.name));
    toast.success("Data saved successfully!");
  };

  // Load data from JSON file
  const handleLoad = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const success = loadData(evt.target.result);
      if (success) {
        toast.success("Data loaded successfully!");
      } else {
        toast.error("Failed to load data. Invalid JSON.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // Reset to dummy
  const handleReset = () => {
    resetToDummy();
    toast.info("Reset to default data");
  };

  const activeSections = TEMPLATES[data.templateType]?.sections || [];

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #1e1b4b 0%, #0f172a 100%)",
        color: "#e2e8f0",
      }}
    >
      {/* Top action bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          padding: "16px",
          borderBottom: "1px solid rgba(129, 140, 248, 0.15)",
        }}
      >
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(99, 102, 241, 0.25)",
            color: "#c7d2fe",
            padding: "8px 16px",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: 500,
            border: "1px solid rgba(129, 140, 248, 0.2)",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(99, 102, 241, 0.4)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(99, 102, 241, 0.25)")
          }
        >
          <Upload size={16} />
          Load Data
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleLoad}
          className="hidden"
        />
        <button
          onClick={handleSave}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(99, 102, 241, 0.25)",
            color: "#c7d2fe",
            padding: "8px 16px",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: 500,
            border: "1px solid rgba(129, 140, 248, 0.2)",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(99, 102, 241, 0.4)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(99, 102, 241, 0.25)")
          }
        >
          <Download size={16} />
          Save Data
        </button>
        <button
          onClick={handleReset}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(99, 102, 241, 0.25)",
            color: "#c7d2fe",
            padding: "8px 12px",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: 500,
            border: "1px solid rgba(129, 140, 248, 0.2)",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(99, 102, 241, 0.4)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(99, 102, 241, 0.25)")
          }
          title="Reset to Dummy Data"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Scrollable form area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Template selector */}
        <TemplateSelector />

        {/* Personal Information */}
        <Section title="Personal Information" icon={User}>
          <div className="grid grid-cols-2 gap-3">
            <input
              className="form-input"
              placeholder="Full Name"
              value={data.personal.name}
              onChange={(e) => updateField("personal.name", e.target.value)}
            />
            <input
              className="form-input"
              placeholder="Professional Title"
              value={data.personal.title}
              onChange={(e) => updateField("personal.title", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              className="form-input"
              placeholder="Phone"
              value={data.personal.phone}
              onChange={(e) => updateField("personal.phone", e.target.value)}
            />
            <input
              className="form-input"
              placeholder="Email"
              value={data.personal.email}
              onChange={(e) => updateField("personal.email", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              className="form-input"
              placeholder="Location"
              value={data.personal.location}
              onChange={(e) => updateField("personal.location", e.target.value)}
            />
            <label className="flex items-center gap-2 text-xs text-white/70 cursor-pointer">
              <span
                style={{
                  background: "rgba(99, 102, 241, 0.2)",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  border: "1px solid rgba(129, 140, 248, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  cursor: "pointer",
                }}
              >
                Choose File
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) =>
                      updateField("personal.photo", ev.target.result);
                    reader.readAsDataURL(file);
                  }
                }}
              />
              {data.personal.photo ? "Photo uploaded" : "No file chosen"}
            </label>
          </div>
        </Section>

        {/* Social Media */}
        <Section title="Social Media" icon={Globe}>
          {data.socialMedia.map((social, i) => (
            <div key={i} className="space-y-2">
              <div className="flex gap-2">
                <input
                  className="form-input flex-1"
                  placeholder="Platform (e.g. GitHub)"
                  value={social.platform}
                  onChange={(e) =>
                    updateField(`socialMedia.${i}.platform`, e.target.value)
                  }
                />
                <button
                  onClick={() => removeSocial(i)}
                  className="p-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <input
                className="form-input"
                placeholder="URL"
                value={social.url}
                onChange={(e) =>
                  updateField(`socialMedia.${i}.url`, e.target.value)
                }
              />
            </div>
          ))}
          <button onClick={addSocial} className="btn-add">
            <Plus size={14} />
            Add Social
          </button>
        </Section>

        {/* Summary */}
        <Section title="Summary" icon={User}>
          <textarea
            className="form-textarea"
            placeholder="Professional summary..."
            value={data.summary}
            onChange={(e) => updateField("summary", e.target.value)}
            rows={4}
          />
        </Section>

        {/* Dynamic sections based on template type */}
        {activeSections.map((sectionKey) => {
          const Icon = SECTION_ICONS[sectionKey] || Star;
          const label = SECTION_LABELS[sectionKey] || sectionKey;

          switch (sectionKey) {
            case "experience":
              return (
                <Section key={sectionKey} title={label} icon={Icon}>
                  {data.experience.map((exp, i) => (
                    <div
                      key={i}
                      style={{
                        background: "rgba(99, 102, 241, 0.08)",
                        border: "1px solid rgba(129, 140, 248, 0.1)",
                        borderRadius: "10px",
                        padding: "12px",
                      }}
                      className="space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-xs text-white/50">
                          Experience {i + 1}
                        </span>
                        <button
                          onClick={() => removeItem("experience", i)}
                          className="p-1 bg-red-500/80 hover:bg-red-600 rounded transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          className="form-input text-sm"
                          placeholder="Company"
                          value={exp.company}
                          onChange={(e) =>
                            updateField(
                              `experience.${i}.company`,
                              e.target.value,
                            )
                          }
                        />
                        <input
                          className="form-input text-sm"
                          placeholder="Role"
                          value={exp.role}
                          onChange={(e) =>
                            updateField(`experience.${i}.role`, e.target.value)
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          className="form-input text-sm"
                          placeholder="Start Date"
                          value={exp.startDate}
                          onChange={(e) =>
                            updateField(
                              `experience.${i}.startDate`,
                              e.target.value,
                            )
                          }
                        />
                        <input
                          className="form-input text-sm"
                          placeholder="End Date"
                          value={exp.endDate}
                          onChange={(e) =>
                            updateField(
                              `experience.${i}.endDate`,
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <textarea
                        className="form-textarea text-sm"
                        placeholder="Description"
                        value={exp.description}
                        onChange={(e) =>
                          updateField(
                            `experience.${i}.description`,
                            e.target.value,
                          )
                        }
                        rows={2}
                      />
                      <div className="space-y-1">
                        <span className="text-xs text-white/60">
                          Bullet Points
                        </span>
                        {exp.bullets.map((bullet, bi) => (
                          <div key={bi} className="flex gap-1">
                            <input
                              className="form-input text-sm flex-1"
                              placeholder="Achievement..."
                              value={bullet}
                              onChange={(e) =>
                                updateField(
                                  `experience.${i}.bullets.${bi}`,
                                  e.target.value,
                                )
                              }
                            />
                            <button
                              onClick={() => removeBullet("experience", i, bi)}
                              className="p-1 text-red-300 hover:text-red-400 transition-colors"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => addBullet("experience", i)}
                          className="btn-add-sm"
                        >
                          <Plus size={12} /> Add bullet
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      addItem("experience", {
                        company: "",
                        role: "",
                        startDate: "",
                        endDate: "",
                        description: "",
                        bullets: [],
                      })
                    }
                    className="btn-add"
                  >
                    <Plus size={14} /> Add Experience
                  </button>
                </Section>
              );

            case "education":
              return (
                <Section key={sectionKey} title={label} icon={Icon}>
                  {data.education.map((edu, i) => (
                    <div
                      key={i}
                      style={{
                        background: "rgba(99, 102, 241, 0.08)",
                        border: "1px solid rgba(129, 140, 248, 0.1)",
                        borderRadius: "10px",
                        padding: "12px",
                      }}
                      className="space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-xs text-white/50">
                          Education {i + 1}
                        </span>
                        <button
                          onClick={() => removeItem("education", i)}
                          className="p-1 bg-red-500/80 hover:bg-red-600 rounded transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <input
                        className="form-input text-sm"
                        placeholder="School / University"
                        value={edu.school}
                        onChange={(e) =>
                          updateField(`education.${i}.school`, e.target.value)
                        }
                      />
                      <input
                        className="form-input text-sm"
                        placeholder="Degree"
                        value={edu.degree}
                        onChange={(e) =>
                          updateField(`education.${i}.degree`, e.target.value)
                        }
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          className="form-input text-sm"
                          placeholder="Start Date"
                          value={edu.startDate}
                          onChange={(e) =>
                            updateField(
                              `education.${i}.startDate`,
                              e.target.value,
                            )
                          }
                        />
                        <input
                          className="form-input text-sm"
                          placeholder="End Date"
                          value={edu.endDate}
                          onChange={(e) =>
                            updateField(
                              `education.${i}.endDate`,
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      addItem("education", {
                        school: "",
                        degree: "",
                        startDate: "",
                        endDate: "",
                      })
                    }
                    className="btn-add"
                  >
                    <Plus size={14} /> Add Education
                  </button>
                </Section>
              );

            case "technicalSkills":
              return (
                <Section key={sectionKey} title={label} icon={Icon}>
                  <input
                    className="form-input text-sm"
                    placeholder="Skills separated by commas..."
                    value={(data.technicalSkills || []).join(", ")}
                    onChange={(e) =>
                      updateSkills("technicalSkills", e.target.value)
                    }
                  />
                </Section>
              );

            case "softSkills":
              return (
                <Section key={sectionKey} title={label} icon={Icon}>
                  <input
                    className="form-input text-sm"
                    placeholder="Skills separated by commas..."
                    value={(data.softSkills || []).join(", ")}
                    onChange={(e) => updateSkills("softSkills", e.target.value)}
                  />
                </Section>
              );

            case "additionalSkills":
              return (
                <Section key={sectionKey} title={label} icon={Icon}>
                  <input
                    className="form-input text-sm"
                    placeholder="Skills separated by commas..."
                    value={(data.additionalSkills || []).join(", ")}
                    onChange={(e) =>
                      updateSkills("additionalSkills", e.target.value)
                    }
                  />
                </Section>
              );

            case "languages":
              return (
                <Section key={sectionKey} title={label} icon={Icon}>
                  <input
                    className="form-input text-sm"
                    placeholder="Languages separated by commas..."
                    value={(data.languages || []).join(", ")}
                    onChange={(e) => updateSkills("languages", e.target.value)}
                  />
                </Section>
              );

            case "certifications":
              return (
                <Section key={sectionKey} title={label} icon={Icon}>
                  {(data.certifications || []).map((cert, i) => (
                    <div key={i} className="flex gap-1">
                      <input
                        className="form-input text-sm flex-1"
                        placeholder="Certification name"
                        value={cert}
                        onChange={(e) =>
                          updateField(`certifications.${i}`, e.target.value)
                        }
                      />
                      <button
                        onClick={() => removeItem("certifications", i)}
                        className="p-1 text-red-300 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addItem("certifications", "")}
                    className="btn-add-sm"
                  >
                    <Plus size={12} /> Add Certification
                  </button>
                </Section>
              );

            case "projects":
              return (
                <Section key={sectionKey} title={label} icon={Icon}>
                  {(data.projects || []).map((proj, i) => (
                    <div
                      key={i}
                      style={{
                        background: "rgba(99, 102, 241, 0.08)",
                        border: "1px solid rgba(129, 140, 248, 0.1)",
                        borderRadius: "10px",
                        padding: "12px",
                      }}
                      className="space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-xs text-white/50">
                          Project {i + 1}
                        </span>
                        <button
                          onClick={() => removeItem("projects", i)}
                          className="p-1 bg-red-500/80 hover:bg-red-600 rounded transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <input
                        className="form-input text-sm"
                        placeholder="Project Name"
                        value={proj.name}
                        onChange={(e) =>
                          updateField(`projects.${i}.name`, e.target.value)
                        }
                      />
                      <textarea
                        className="form-textarea text-sm"
                        placeholder="Description"
                        value={proj.description}
                        onChange={(e) =>
                          updateField(
                            `projects.${i}.description`,
                            e.target.value,
                          )
                        }
                        rows={2}
                      />
                      <input
                        className="form-input text-sm"
                        placeholder="Technologies"
                        value={proj.technologies}
                        onChange={(e) =>
                          updateField(
                            `projects.${i}.technologies`,
                            e.target.value,
                          )
                        }
                      />
                      <input
                        className="form-input text-sm"
                        placeholder="Link"
                        value={proj.link}
                        onChange={(e) =>
                          updateField(`projects.${i}.link`, e.target.value)
                        }
                      />
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      addItem("projects", {
                        name: "",
                        description: "",
                        technologies: "",
                        link: "",
                      })
                    }
                    className="btn-add"
                  >
                    <Plus size={14} /> Add Project
                  </button>
                </Section>
              );

            case "campaigns":
              return (
                <Section key={sectionKey} title={label} icon={Icon}>
                  {(data.campaigns || []).map((camp, i) => (
                    <div
                      key={i}
                      style={{
                        background: "rgba(99, 102, 241, 0.08)",
                        border: "1px solid rgba(129, 140, 248, 0.1)",
                        borderRadius: "10px",
                        padding: "12px",
                      }}
                      className="space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-xs text-white/50">
                          Campaign {i + 1}
                        </span>
                        <button
                          onClick={() => removeItem("campaigns", i)}
                          className="p-1 bg-red-500/80 hover:bg-red-600 rounded transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <input
                        className="form-input text-sm"
                        placeholder="Campaign Name"
                        value={camp.name}
                        onChange={(e) =>
                          updateField(`campaigns.${i}.name`, e.target.value)
                        }
                      />
                      <textarea
                        className="form-textarea text-sm"
                        placeholder="Description"
                        value={camp.description}
                        onChange={(e) =>
                          updateField(
                            `campaigns.${i}.description`,
                            e.target.value,
                          )
                        }
                        rows={2}
                      />
                      <input
                        className="form-input text-sm"
                        placeholder="Metrics / Results"
                        value={camp.metrics}
                        onChange={(e) =>
                          updateField(`campaigns.${i}.metrics`, e.target.value)
                        }
                      />
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      addItem("campaigns", {
                        name: "",
                        description: "",
                        metrics: "",
                      })
                    }
                    className="btn-add"
                  >
                    <Plus size={14} /> Add Campaign
                  </button>
                </Section>
              );

            case "portfolioLinks":
              return (
                <Section key={sectionKey} title={label} icon={Icon}>
                  {(data.portfolioLinks || []).map((pl, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        className="form-input text-sm flex-1"
                        placeholder="Label"
                        value={pl.label}
                        onChange={(e) =>
                          updateField(
                            `portfolioLinks.${i}.label`,
                            e.target.value,
                          )
                        }
                      />
                      <input
                        className="form-input text-sm flex-1"
                        placeholder="URL"
                        value={pl.url}
                        onChange={(e) =>
                          updateField(`portfolioLinks.${i}.url`, e.target.value)
                        }
                      />
                      <button
                        onClick={() => removeItem("portfolioLinks", i)}
                        className="p-1 text-red-300 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      addItem("portfolioLinks", { label: "", url: "" })
                    }
                    className="btn-add-sm"
                  >
                    <Plus size={12} /> Add Link
                  </button>
                </Section>
              );

            case "publications":
              return (
                <Section key={sectionKey} title={label} icon={Icon}>
                  {(data.publications || []).map((pub, i) => (
                    <div
                      key={i}
                      style={{
                        background: "rgba(99, 102, 241, 0.08)",
                        border: "1px solid rgba(129, 140, 248, 0.1)",
                        borderRadius: "10px",
                        padding: "12px",
                      }}
                      className="space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-xs text-white/50">
                          Publication {i + 1}
                        </span>
                        <button
                          onClick={() => removeItem("publications", i)}
                          className="p-1 bg-red-500/80 hover:bg-red-600 rounded transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <input
                        className="form-input text-sm"
                        placeholder="Title"
                        value={pub.title}
                        onChange={(e) =>
                          updateField(`publications.${i}.title`, e.target.value)
                        }
                      />
                      <input
                        className="form-input text-sm"
                        placeholder="Journal / Conference"
                        value={pub.journal}
                        onChange={(e) =>
                          updateField(
                            `publications.${i}.journal`,
                            e.target.value,
                          )
                        }
                      />
                      <input
                        className="form-input text-sm"
                        placeholder="Date"
                        value={pub.date}
                        onChange={(e) =>
                          updateField(`publications.${i}.date`, e.target.value)
                        }
                      />
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      addItem("publications", {
                        title: "",
                        journal: "",
                        date: "",
                      })
                    }
                    className="btn-add"
                  >
                    <Plus size={14} /> Add Publication
                  </button>
                </Section>
              );

            case "achievements":
              return (
                <Section key={sectionKey} title={label} icon={Icon}>
                  {(data.achievements || []).map((ach, i) => (
                    <div key={i} className="flex gap-1">
                      <input
                        className="form-input text-sm flex-1"
                        placeholder="Achievement"
                        value={ach}
                        onChange={(e) =>
                          updateField(`achievements.${i}`, e.target.value)
                        }
                      />
                      <button
                        onClick={() => removeItem("achievements", i)}
                        className="p-1 text-red-300 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addItem("achievements", "")}
                    className="btn-add-sm"
                  >
                    <Plus size={12} /> Add Achievement
                  </button>
                </Section>
              );

            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}

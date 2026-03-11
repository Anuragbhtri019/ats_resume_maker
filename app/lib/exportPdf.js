// PDF export using html2pdf.js — captures the live preview DOM pixel-perfectly

export async function exportToPdf(previewElement, name) {
  if (!previewElement) throw new Error("Preview element not found");

  const html2pdf = (await import("html2pdf.js")).default;

  // Add a temporary timestamp footer to the live element
  const timestamp = document.createElement("div");
  timestamp.setAttribute("data-export-timestamp", "true");
  timestamp.style.cssText =
    "text-align: center; font-size: 10px; color: #9ca3af; padding: 16px 0 8px; border-top: 1px solid #e5e7eb; margin-top: 16px;";
  timestamp.textContent = `Built on ${new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })}`;
  previewElement.appendChild(timestamp);

  const sanitized = (name || "Resume").replace(/[^a-zA-Z0-9\s]/g, "").trim();
  const filename = `${sanitized}_Resume.pdf`;

  const options = {
    margin: [0, 0, 0, 0],
    filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      // Inline all colors so html2canvas doesn't choke on oklch()
      onclone: (doc, el) => {
        const all = [el, ...el.querySelectorAll("*")];
        all.forEach((node) => {
          const cs = window.getComputedStyle(node);
          node.style.color = cs.color;
          node.style.backgroundColor = cs.backgroundColor;
          node.style.borderColor = cs.borderColor;
        });
        // Strip contentEditable outlines
        el.querySelectorAll("[contenteditable]").forEach((node) => {
          node.removeAttribute("contenteditable");
          node.style.outline = "none";
        });
      },
    },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  try {
    await html2pdf().set(options).from(previewElement).save();
  } finally {
    // Remove the timestamp we added
    timestamp.remove();
  }
}

// PDF export — captures the live preview DOM pixel-perfectly as a single-page A4

export async function exportToPdf(previewElement, name) {
  if (!previewElement) throw new Error("Preview element not found");

  const html2canvas = (await import("html2canvas")).default;
  const { jsPDF } = await import("jspdf");

  const sanitized = (name || "Resume").replace(/[^a-zA-Z0-9\s]/g, "").trim();
  const filename = `${sanitized}_Resume.pdf`;

  // Capture the preview element to a canvas
  const canvas = await html2canvas(previewElement, {
    scale: 2,
    useCORS: true,
    letterRendering: true,
    onclone: (doc, el) => {
      // Remove minHeight so canvas matches actual content height
      el.style.minHeight = "unset";
      el.style.height = "auto";

      // Add timestamp footer inside the clone only
      const ts = doc.createElement("div");
      ts.style.cssText =
        "text-align:center;font-size:10px;color:#9ca3af;padding:8px 0 4px;border-top:1px solid #e5e7eb;margin-top:8px;";
      ts.textContent = `Built on ${new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}`;
      el.appendChild(ts);

      // Inline all colors so html2canvas doesn't choke on oklch()
      const all = [el, ...el.querySelectorAll("*")];
      all.forEach((node) => {
        const cs = doc.defaultView.getComputedStyle(node);
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
  });

  // Build a single-page A4 PDF — scale image to fit if needed
  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageWidth = 210;
  const pageHeight = 297;
  const imgHeight = (canvas.height * pageWidth) / canvas.width;

  // If content exceeds A4 height, scale it down to fit one page
  const scale = imgHeight > pageHeight ? pageHeight / imgHeight : 1;
  const finalWidth = pageWidth * scale;
  const finalHeight = imgHeight * scale;

  const imgData = canvas.toDataURL("image/jpeg", 0.98);
  pdf.addImage(imgData, "JPEG", 0, 0, finalWidth, finalHeight);
  pdf.save(filename);
}

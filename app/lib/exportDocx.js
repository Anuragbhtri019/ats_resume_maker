// DOCX export — builds Word-compatible HTML with tables (no flexbox)

export async function exportToDocx(previewElement, name) {
  if (!previewElement) throw new Error("Preview element not found");

  const fileSaver = await import("file-saver");
  const saveAs =
    fileSaver.saveAs || fileSaver.default?.saveAs || fileSaver.default;

  const ts = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Extract text from the live preview DOM — this reads what the user sees
  const q = (sel) => previewElement.querySelector(sel);
  const qAll = (sel) => [...previewElement.querySelectorAll(sel)];

  // The resume preview has a known structure:
  // - Header: name, title, contact, social (centered)
  // - Divider
  // - Two-column body: left (36%) and right (64%)
  // We reconstruct this as Word-compatible table HTML

  // Grab the main container children
  const children = [...previewElement.children];
  // children[0] = watermark, [1] = header, [2] = divider, [3] = body (flex)

  const headerEl = children[1]; // center block with name, title, contact, social
  const bodyEl = children[3]; // flex container with 2 columns

  // Extract header info
  const nameText = headerEl?.children?.[0]?.innerText || "";
  const titleText = headerEl?.children?.[1]?.innerText || "";

  // Contact items — each is a <span> with icon + text
  const contactDiv = headerEl?.children?.[2];
  const contactItems = contactDiv
    ? [...contactDiv.children]
        .map((span) => span.innerText.trim())
        .filter(Boolean)
    : [];

  // Social items
  const socialDiv = headerEl?.children?.[3];
  const socialItems = socialDiv
    ? [...socialDiv.children]
        .map((span) => span.innerText.trim())
        .filter(Boolean)
    : [];

  // Left and right columns
  const leftCol = bodyEl?.children?.[0];
  const rightCol = bodyEl?.children?.[1];

  // Convert a column's sections to Word-compatible HTML
  function columnToHtml(colEl) {
    if (!colEl) return "";
    let html = "";
    [...colEl.children].forEach((section) => {
      const h3 = section.querySelector("h3");
      const heading = h3 ? h3.innerText : "";

      if (heading) {
        html += `<h3 style="font-size:10.5pt; color:#111827; border-bottom:2px solid #1f2937; padding-bottom:4px; margin:12px 0 6px 0; text-transform:uppercase; letter-spacing:1.5px; font-weight:bold;">${esc(heading)}</h3>`;
      }

      // Get all non-h3 content
      [...section.children].forEach((child) => {
        if (child.tagName === "H3") return;
        html += elementToHtml(child);
      });
    });
    return html;
  }

  // Convert an element to Word-friendly HTML
  function elementToHtml(el) {
    if (!el) return "";
    const tag = el.tagName;

    // Lists
    if (tag === "UL") {
      let items = "";
      [...el.children].forEach((li) => {
        items += `<li style="font-size:9pt; color:#374151; line-height:1.55; margin-bottom:3px;">${esc(li.innerText)}</li>`;
      });
      return `<ul style="margin:4px 0 4px 18px; padding:0;">${items}</ul>`;
    }

    // Divs with content — check for experience-style blocks
    const text = el.innerText.trim();
    if (!text) return "";

    // Check for sub-elements (compound blocks like experience entries)
    if (
      el.children.length > 1 ||
      (el.children.length === 1 && el.children[0].children.length > 0)
    ) {
      let blockHtml = "";
      [...el.children].forEach((child) => {
        // Row with company + date (flex row)
        const cs = child.style;
        if (cs.display === "flex" && cs.justifyContent === "space-between") {
          // Table row for company | date
          const parts = [...child.children];
          const left = parts[0]?.innerText || "";
          const right = parts[1]?.innerText || "";
          blockHtml += `<table width="100%" style="border:none; border-collapse:collapse; margin:0; padding:0;"><tr>`;
          blockHtml += `<td style="border:none; padding:0; font-weight:bold; font-size:10.5pt; color:#111827;">${esc(left)}</td>`;
          blockHtml += `<td style="border:none; padding:0; text-align:right; font-size:8.5pt; color:#6b7280; white-space:nowrap;">${esc(right)}</td>`;
          blockHtml += `</tr></table>`;
        } else if (child.tagName === "UL") {
          blockHtml += elementToHtml(child);
        } else {
          const childText = child.innerText.trim();
          if (!childText) return;
          const fw = child.style.fontWeight;
          const fi = child.style.fontStyle;
          const fs = child.style.fontSize || "9.5pt";
          const cl = child.style.color || "#374151";
          let styled = esc(childText);
          if (fw === "bold" || fw === "700" || parseInt(fw) >= 600)
            styled = `<b>${styled}</b>`;
          if (fi === "italic") styled = `<i>${styled}</i>`;
          blockHtml += `<p style="font-size:${fs}; color:${cl}; line-height:1.55; margin:2px 0;">${styled}</p>`;
        }
      });
      return `<div style="margin-bottom:12px;">${blockHtml}</div>`;
    }

    // Simple text block
    const fw = el.style.fontWeight;
    const fi = el.style.fontStyle;
    const fs = el.style.fontSize || "9.5pt";
    const cl = el.style.color || "#374151";
    let content = esc(text);
    if (fw === "bold" || fw === "700" || parseInt(fw) >= 600)
      content = `<b>${content}</b>`;
    if (fi === "italic") content = `<i>${content}</i>`;
    return `<p style="font-size:${fs}; color:${cl}; line-height:1.55; margin:2px 0;">${content}</p>`;
  }

  function esc(str) {
    return (str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  const leftHtml = columnToHtml(leftCol);
  const rightHtml = columnToHtml(rightCol);

  const contactLine = contactItems.join(
    "&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;",
  );
  const socialLine = socialItems.join("&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;");

  const htmlContent = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View></w:WordDocument></xml><![endif]-->
<style>
  @page { size: A4; margin: 20mm 18mm 20mm 18mm; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 10pt; color: #111827; line-height: 1.45; }
  table { border-collapse: collapse; }
  td { vertical-align: top; }
  h3 { font-size: 10.5pt; color: #111827; border-bottom: 2px solid #1f2937; padding-bottom: 4px; margin: 12px 0 6px 0; text-transform: uppercase; letter-spacing: 1.5px; }
  ul { margin: 4px 0 4px 18px; padding: 0; }
  li { font-size: 9pt; color: #374151; line-height: 1.55; margin-bottom: 2px; }
  p { margin: 2px 0; }
</style>
</head>
<body>
  <!-- Header -->
  <div style="text-align:center; margin-bottom:6px;">
    <p style="font-size:24pt; font-weight:bold; letter-spacing:2px; color:#111827; margin:0;">${esc(nameText)}</p>
    <p style="font-size:12pt; color:#4b5563; margin:2px 0 8px 0;">${esc(titleText)}</p>
    ${contactLine ? `<p style="font-size:9.5pt; color:#374151; margin:4px 0;">${contactLine}</p>` : ""}
    ${socialLine ? `<p style="font-size:9pt; color:#6b7280; margin:4px 0;">${socialLine}</p>` : ""}
  </div>

  <hr style="border:none; border-top:1px solid #e5e7eb; margin:4px 0 10px 0;">

  <!-- Two-column body via table -->
  <table width="100%" style="border:none; border-collapse:collapse;">
    <tr>
      <td width="36%" style="border:none; padding:0 14px 0 0;">
        ${leftHtml}
      </td>
      <td width="64%" style="border:none; padding:0 0 0 14px;">
        ${rightHtml}
      </td>
    </tr>
  </table>

  <div style="text-align:center; font-size:10px; color:#9ca3af; padding:16px 0 8px; border-top:1px solid #e5e7eb; margin-top:16px;">
    Built on ${ts}
  </div>
</body>
</html>`;

  const sanitized = (name || "Resume").replace(/[^a-zA-Z0-9\s]/g, "").trim();
  const filename = `${sanitized}_Resume.doc`;

  const blob = new Blob(["\ufeff", htmlContent], {
    type: "application/msword",
  });

  saveAs(blob, filename);
}

# ATS Resume Maker

A modern, ATS-friendly resume builder built with **Next.js 16** and **React 19**. Create professional resumes with live preview, inline editing, rich text formatting, and export to PDF or Word — all from your browser.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

---

## Features

- **5 Resume Templates** — General (ATS Classic), Software Developer, Marketing, Data Science, Product Manager
- **Live A4 Preview** — Real-time preview that matches your final export pixel-for-pixel
- **Inline Editing** — Click any text on the preview to edit directly with a floating rich text toolbar (Bold, Italic, Underline, Font Size, Color, Bullet Lists)
- **Left Panel Form** — Structured form with collapsible sections for all resume data
- **Export to PDF** — Pixel-perfect PDF using html2canvas + jsPDF
- **Export to .doc** — Word-compatible document with proper table-based layout
- **Save / Load Data** — Export your resume data as JSON and import it later
- **Dynamic Sections** — Each template shows only the relevant sections (experience, projects, campaigns, publications, achievements, etc.)
- **Photo Upload** — Add a profile photo (base64 encoded)
- **Dark Themed UI** — Clean dark indigo gradient interface with purple accents
- **Fully Client-Side** — No server or database required; everything runs in the browser

---

## Tech Stack

| Category      | Technology                                              |
| ------------- | ------------------------------------------------------- |
| Framework     | [Next.js 16](https://nextjs.org/) (App Router)          |
| UI Library    | [React 19](https://react.dev/)                          |
| Styling       | [Tailwind CSS 4](https://tailwindcss.com/) + Custom CSS |
| Icons         | [Lucide React](https://lucide.dev/)                     |
| Notifications | [Sonner](https://sonner.emilkowal.dev/)                 |
| PDF Export    | [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) |
| DOCX Export   | [FileSaver.js](https://github.com/nicercode/file-saver) |
| Linting       | ESLint 9 + eslint-config-next (core-web-vitals)         |
| Build Tool    | Webpack (via Next.js)                                   |

---

## Folder Structure

```
ats_resume_maker/
├── app/
│   ├── globals.css              # Global styles, Tailwind imports, print styles
│   ├── layout.js                # Root layout with metadata and Toaster
│   ├── page.js                  # Landing page (redirects to /resume)
│   ├── components/
│   │   ├── ExportModal.jsx      # PDF / .doc export modal dialog
│   │   ├── LeftForm.jsx         # Left panel form for editing resume data
│   │   ├── ResumePreview.jsx    # Live A4 resume preview with inline editing
│   │   ├── RichTextToolbar.jsx  # Floating rich text formatting toolbar
│   │   └── TemplateSelector.jsx # Resume template type dropdown
│   ├── lib/
│   │   ├── dummyData.js         # Default sample resume data
│   │   ├── exportDocx.js        # Word (.doc) export logic
│   │   ├── exportPdf.js         # PDF export logic (html2pdf.js)
│   │   ├── ResumeContext.js     # React Context for state management
│   │   ├── templates.js         # Template definitions and section configs
│   │   └── utils.js             # Utility functions (formatDate, cn, etc.)
│   └── resume/
│       └── page.jsx             # Main resume builder page
├── public/                      # Static assets
├── eslint.config.mjs            # ESLint 9 flat config
├── jsconfig.json                # Path alias (@/* → project root)
├── next.config.mjs              # Next.js config with webpack fallbacks
├── package.json                 # Dependencies and scripts
├── postcss.config.mjs           # PostCSS config for Tailwind v4
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm**, **yarn**, **pnpm**, or **bun**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/ats_resume_maker.git
   cd ats_resume_maker
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Open the app**

   Navigate to [http://localhost:3000](http://localhost:3000) in your browser. You'll be redirected to the resume builder.

### Build for Production

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

---

## How to Use

1. **Choose a Template** — Select from 5 role-specific templates using the dropdown at the top of the form panel.
2. **Fill the Form** — Expand collapsible sections on the left panel to enter personal info, social links, summary, experience (with bullet points), education, skills, certifications, projects, and more.
3. **Edit Inline** — Click directly on any text in the A4 preview to edit it. A floating toolbar appears with formatting options (bold, italic, underline, font size, text color, bullet lists).
4. **Save Your Work** — Click "Save Data" to export your resume as a JSON file. Use "Load Data" to import it back anytime.
5. **Export** — Click "Export Resume" and choose **PDF** (pixel-perfect screenshot) or **.doc** (editable Word document). The file downloads automatically.

---

## Available Templates

| Template           | Sections Included                                                                                  |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| General (ATS)      | Experience, Education, Technical Skills, Soft Skills, Additional Skills, Languages, Certifications |
| Software Developer | Experience, Projects, Technical Skills, Soft Skills, Education, Certifications                     |
| Marketing          | Experience, Campaigns, Technical Skills, Soft Skills, Portfolio Links, Education                   |
| Data Science       | Experience, Projects, Technical Skills, Publications, Education, Certifications                    |
| Product Manager    | Experience, Achievements, Technical Skills, Soft Skills, Education, Certifications                 |

---

## Learning Outcomes

Building this project teaches:

- **Next.js App Router** — File-based routing, layouts, metadata API, and client/server component patterns
- **React Context API** — Global state management with deeply nested data using dot-path updaters
- **`contentEditable` Inline Editing** — Two-way sync between React state and DOM, cursor-jumping prevention, and focus/blur management
- **Rich Text Toolbar** — Using `document.execCommand` for formatting, managing focus conflicts between toolbar controls and editable elements
- **PDF Generation** — Client-side PDF export with html2canvas, handling CSS color space issues (oklch → hex), and pixel-perfect rendering
- **Word Document Export** — Converting flex/grid layouts to Word-compatible HTML tables with Microsoft Office XML namespaces
- **Dynamic Component Rendering** — Conditionally rendering form sections and preview blocks based on template configuration
- **Tailwind CSS v4** — PostCSS-based setup, custom theme configuration, and dark-themed UI design
- **Code Splitting** — Dynamic imports for heavy export libraries to reduce initial bundle size
- **File I/O in the Browser** — JSON import/export, base64 image encoding, and FileSaver.js for downloads

---

## Deploy

Deploy instantly on [Vercel](https://vercel.com/new):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/ats_resume_maker)

Or any platform that supports Next.js (Netlify, Railway, Docker, etc.).

---

## License

This project is open source and available under the [MIT License](LICENSE).

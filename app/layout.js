import "./globals.css";
import { Toaster } from "sonner";

export const metadata = {
  title: "ATS Resume Maker",
  description:
    "Build ATS-friendly resumes with live preview and export to PDF/DOCX",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}

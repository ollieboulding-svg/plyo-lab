"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

interface PdfExportButtonProps {
  targetId: string;
  variant?: "default" | "compact";
  athleteName?: string;
}

function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

function safeFileName(name: string) {
  return (name || "Athlete")
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "_")
    .slice(0, 50);
}

/**
 * Fallback: open a print window containing only the report area.
 * Parents can "Save as PDF" (desktop) or "Share/Print to PDF" (mobile).
 * This bypasses html-to-image/html2canvas edge cases entirely.
 */
function printFallback(el: HTMLElement, title: string) {
  const w = window.open("", "_blank", "noopener,noreferrer");
  if (!w) {
    alert("Popup blocked. Please allow popups to export PDF.");
    return;
  }

  // Copy stylesheets to new window so it looks the same
  const styles = Array.from(document.querySelectorAll("link[rel='stylesheet'], style"))
    .map((node) => node.outerHTML)
    .join("\n");

  w.document.open();
  w.document.write(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${title}</title>
        ${styles}
        <style>
          /* Print optimizations */
          @page { size: A4; margin: 10mm; }
          body { background: white !important; }
          /* Force the report to be full width in print */
          #__print_root { width: 100% !important; }
          /* Avoid cut-off of charts/cards */
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        </style>
      </head>
      <body>
        <div id="__print_root">${el.outerHTML}</div>
        <script>
          window.onload = () => {
            setTimeout(() => {
              window.print();
            }, 300);
          };
        </script>
      </body>
    </html>
  `);
  w.document.close();
}

export function PdfExportButton({
  targetId,
  variant = "default",
  athleteName,
}: PdfExportButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);

    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const el = document.getElementById(targetId);
      if (!el) {
        alert("PDF content not found. Please run an assessment first.");
        return;
      }

      // Wait for fonts
      // @ts-ignore
      if (document.fonts?.ready) {
        // @ts-ignore
        await document.fonts.ready;
      }

      // Let charts/layout settle
      await new Promise((r) => setTimeout(r, 200));

      const canvas = await html2canvas(el, {
        scale: 2,
        backgroundColor: "#ffffff", // safer for print/PDF
        useCORS: true,
        allowTaint: false,
        logging: false,
        scrollY: -window.scrollY,
        windowWidth: 1200,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 6;

      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let remaining = imgHeight;

      pdf.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight);
      remaining -= pageHeight - margin * 2;

      while (remaining > 0) {
        pdf.addPage();
        const offsetY = margin - (imgHeight - remaining);
        pdf.addImage(imgData, "PNG", margin, offsetY, imgWidth, imgHeight);
        remaining -= pageHeight - margin * 2;
      }

      const dateStr = new Date().toISOString().slice(0, 10);
      const fileName = `PlyoLab_${safeFileName(athleteName)}_${dateStr}.pdf`;

      // iOS: open in new tab
      if (isIOS()) {
        const blob = pdf.output("blob");
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
        setTimeout(() => URL.revokeObjectURL(url), 30000);
      } else {
        pdf.save(fileName);
      }
    } catch (err: any) {
      console.error("PDF export error:", err);

      // If we still see 'lab' errors, it means something in the pipeline is still parsing colors.
      // Fall back to browser-native print -> Save as PDF.
      const el = document.getElementById(targetId);
      if (el) {
        const dateStr = new Date().toISOString().slice(0, 10);
        const title = `PlyoLab_${safeFileName(athleteName)}_${dateStr}`;
        alert(
          "Direct PDF export failed on this device/browser. Opening Print view instead (Save as PDF / Share as PDF)."
        );
        printFallback(el as HTMLElement, title);
      } else {
        alert("PDF export failed. Please run an assessment first.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={loading}
      className={
        variant === "compact"
          ? "flex items-center gap-2 rounded-xl bg-muted border border-border px-3 py-2 text-xs font-medium text-card-foreground hover:bg-muted/80 transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-ring/50"
          : "flex items-center gap-2 rounded-xl bg-muted border border-border px-4 py-3 text-sm font-semibold text-card-foreground hover:bg-muted/80 hover:border-border/80 transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-ring/50"
      }
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      Export PDF
    </button>
  );
}

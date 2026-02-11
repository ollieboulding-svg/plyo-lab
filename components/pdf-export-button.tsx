"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

interface PdfExportButtonProps {
  targetId: string;
  variant?: "default" | "compact";
  athleteName?: string;
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
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const el = document.getElementById(targetId);
      if (!el) {
        console.log("[v0] PDF target element not found:", targetId);
        setLoading(false);
        return;
      }

      const prevStyle = el.style.cssText;
      el.style.backgroundColor = "#09090b";
      el.style.color = "#fafafa";
      el.style.padding = "24px";

      const canvas = await html2canvas(el, {
        scale: 2,
        backgroundColor: "#09090b",
        useCORS: true,
        allowTaint: true,
        logging: false,
        windowWidth: 1200,
        onclone: (clonedDoc) => {
          const svgs = clonedDoc.querySelectorAll("svg");
          svgs.forEach((svg) => {
            svg.setAttribute(
              "width",
              svg.getBoundingClientRect().width.toString()
            );
            svg.setAttribute(
              "height",
              svg.getBoundingClientRect().height.toString()
            );
          });
        },
      });

      el.style.cssText = prevStyle;

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 5;
      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = margin;

      pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - margin * 2;

      while (heightLeft > 0) {
        position -= pageHeight - margin;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
        heightLeft -= pageHeight - margin * 2;
      }

      const name = athleteName || "Athlete";
      const dateStr = new Date().toISOString().slice(0, 10);
      pdf.save(`PlyoLab_${name.replace(/\s+/g, "_")}_${dateStr}.pdf`);
    } catch (err) {
      console.log("[v0] PDF export error:", err);
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

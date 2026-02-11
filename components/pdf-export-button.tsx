"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

interface PdfExportButtonProps {
  targetId: string;
}

export function PdfExportButton({ targetId }: PdfExportButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const el = document.getElementById(targetId);
      if (!el) return;

      // Temporarily make the background opaque for the capture
      el.style.backgroundColor = "#0a0a0f";

      const canvas = await html2canvas(el, {
        scale: 2,
        backgroundColor: "#0a0a0f",
        useCORS: true,
      });

      el.style.backgroundColor = "";

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = 210;
      const pageHeight = 297;
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("PlyoLab_Report.pdf");
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-2 rounded-lg bg-muted border border-border px-4 py-2.5 text-sm font-medium text-card-foreground hover:bg-muted/80 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-ring/50"
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

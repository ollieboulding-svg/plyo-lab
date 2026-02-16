"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

interface PdfExportButtonProps {
  targetId: string;
  variant?: "default" | "compact";
  athleteName?: string;
}

"use client";

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

export async function exportPDF() {
  const el = document.getElementById("pdfContent");
  if (!el) {
    alert("PDF content not found (#pdfContent).");
    return;
  }

  try {
    // Dynamic imports are more reliable in Next/v0 deployments
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import("html2canvas"),
      import("jspdf")
    ]);

    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false
    });

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

    // iOS Safari often blocks direct downloads
    if (isIOS()) {
      const blob = pdf.output("blob");
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 30000);
      return;
    }
    "use client";
    pdf.save("PlyoLab_Report.pdf");
  } catch (err) {
    console.error(err);
    alert(
      "PDF export failed. Common cause: an image/logo/font inside the PDF area is blocking capture (CORS)."
    );
  }
}


// Collect computed SVG dimensions BEFORE cloning (getBoundingClientRect returns 0 in cloned DOM)
const originalSvgs = el.querySelectorAll("svg");
const svgSizes: { width: number; height: number }[] = [];
originalSvgs.forEach((svg) => {
  const rect = svg.getBoundingClientRect();
  svgSizes.push({ width: rect.width || 200, height: rect.height || 200 });
});

const canvas = await html2canvas(el, {
  scale: 2,
  backgroundColor: "#09090b",
  useCORS: true,
  allowTaint: true,
  logging: false,
  windowWidth: 1200,
  onclone: (_clonedDoc, clonedEl) => {
    clonedEl.style.backgroundColor = "#09090b";
    clonedEl.style.color = "#fafafa";
    clonedEl.style.padding = "24px";
    clonedEl.style.width = "1200px";

    // Forward CSS custom properties into the clone
    const computedBody = getComputedStyle(document.body);
    const cssVars = [
      "--color-background", "--color-foreground", "--color-card",
      "--color-card-foreground", "--color-muted", "--color-muted-foreground",
      "--color-border", "--color-input", "--color-primary",
      "--color-primary-foreground", "--color-accent", "--color-accent-foreground",
      "--color-destructive", "--color-ring", "--color-score-green",
      "--color-score-amber", "--color-score-red", "--color-surface",
    ];
    cssVars.forEach((v) => {
      const val = computedBody.getPropertyValue(v);
      if (val) clonedEl.style.setProperty(v, val);
    });

    // Apply pre-collected SVG sizes to the cloned elements
    const clonedSvgs = clonedEl.querySelectorAll("svg");
    clonedSvgs.forEach((svg, i) => {
      if (svgSizes[i]) {
        svg.setAttribute("width", String(svgSizes[i].width));
        svg.setAttribute("height", String(svgSizes[i].height));
        svg.style.width = svgSizes[i].width + "px";
        svg.style.height = svgSizes[i].height + "px";
        svg.style.overflow = "visible";
      }
    });

    // Fix Recharts responsive containers
    const containers = clonedEl.querySelectorAll(".recharts-responsive-container");
    containers.forEach((c) => {
      const htmlEl = c as HTMLElement;
      htmlEl.style.width = "1100px";
      htmlEl.style.height = "320px";
    });
  },
});

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

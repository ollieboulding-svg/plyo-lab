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
        setLoading(false);
        return;
      }

      // Clone and prepare for rendering
      const clone = el.cloneNode(true) as HTMLElement;
      clone.style.position = "absolute";
      clone.style.left = "-9999px";
      clone.style.top = "0";
      clone.style.width = "1100px";
      clone.style.backgroundColor = "#0a0a0b";
      clone.style.color = "#fafafa";
      clone.style.padding = "32px";
      clone.style.zIndex = "-1";

      // Resolve all CSS custom properties to computed values in the clone
      document.body.appendChild(clone);

      resolveComputedStyles(clone);

      const canvas = await html2canvas(clone, {
        scale: 2,
        backgroundColor: "#0a0a0b",
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: 1100,
      });

      document.body.removeChild(clone);

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
      console.error("PDF export error:", err);
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

/**
 * Recursively resolve CSS custom properties on all elements so html2canvas
 * can read actual color / size values instead of var(--token).
 */
function resolveComputedStyles(root: HTMLElement) {
  const allElements = root.querySelectorAll("*");
  const resolveProps = [
    "color",
    "backgroundColor",
    "borderColor",
    "borderTopColor",
    "borderRightColor",
    "borderBottomColor",
    "borderLeftColor",
    "outlineColor",
    "fill",
    "stroke",
  ];

  [root, ...Array.from(allElements)].forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    const computed = window.getComputedStyle(node);
    for (const prop of resolveProps) {
      const val = computed.getPropertyValue(prop);
      if (val && val !== "transparent" && val !== "rgba(0, 0, 0, 0)") {
        node.style.setProperty(prop, val);
      }
    }
    // Also resolve font properties
    node.style.fontFamily = computed.fontFamily;
    node.style.fontSize = computed.fontSize;
    node.style.fontWeight = computed.fontWeight;
  });

  // Fix SVGs: set explicit width/height attributes
  root.querySelectorAll("svg").forEach((svg) => {
    const rect = svg.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      svg.setAttribute("width", String(rect.width));
      svg.setAttribute("height", String(rect.height));
    }
  });
}

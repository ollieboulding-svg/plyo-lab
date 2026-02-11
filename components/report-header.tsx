"use client";

import type { AthleteMeta } from "./athlete-form";
import { FileText } from "lucide-react";

interface ReportHeaderProps {
  meta: AthleteMeta;
}

export function ReportHeader({ meta }: ReportHeaderProps) {
  const dateStr = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="rounded-xl bg-card p-6 border border-border">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-card-foreground">
              Plyo Lab -- Performance Report
            </h2>
          </div>
          <p className="text-sm text-card-foreground">
            <span className="font-semibold">{meta.name}</span>
            <span className="text-muted-foreground">
              {" "}
              -- {meta.gender.charAt(0).toUpperCase() + meta.gender.slice(1)} -- Age{" "}
              {meta.ageGroup} -- {meta.sport}
            </span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {meta.isRetest ? "Retest Report" : "Baseline Report"} -- {dateStr}
          </p>
        </div>
        <div className="text-right text-xs text-muted-foreground max-w-[260px] hidden sm:block">
          <p>Field-based benchmarks for development tracking.</p>
          <p>Retest after training to measure progress.</p>
        </div>
      </div>
    </div>
  );
}

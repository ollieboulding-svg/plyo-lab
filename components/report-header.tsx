"use client";

import type { AthleteMeta } from "./athlete-form";
import { Zap, Calendar } from "lucide-react";

interface ReportHeaderProps {
  meta: AthleteMeta;
}

export function ReportHeader({ meta }: ReportHeaderProps) {
  const dateStr = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="rounded-2xl bg-card p-6 border border-border">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-base font-bold text-card-foreground">
              Plyo Lab Report
            </h2>
            <p className="text-sm text-muted-foreground">
              <span className="text-card-foreground font-semibold">{meta.name}</span>
              {" -- "}
              {meta.gender.charAt(0).toUpperCase() + meta.gender.slice(1)} -- Age{" "}
              {meta.ageGroup} -- {meta.sport}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground rounded-lg bg-muted/50 px-3 py-2">
          <Calendar className="w-3.5 h-3.5" />
          <span>{meta.isRetest ? "Retest" : "Baseline"} -- {dateStr}</span>
        </div>
      </div>
    </div>
  );
}

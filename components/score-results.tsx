"use client";

import { statusLabel, approxPercentile, testLabels } from "@/lib/scoring";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Info } from "lucide-react";

interface ScoreResultsProps {
  scores: (1 | 2 | 3)[];
}

const dotColors: Record<string, string> = {
  green: "bg-score-green",
  amber: "bg-score-amber",
  red: "bg-score-red",
};

const badgeColors: Record<string, string> = {
  green: "bg-score-green/15 text-score-green border-score-green/30",
  amber: "bg-score-amber/15 text-score-amber border-score-amber/30",
  red: "bg-score-red/15 text-score-red border-score-red/30",
};

const rowBg: Record<string, string> = {
  green: "bg-score-green/5 hover:bg-score-green/10",
  amber: "bg-score-amber/5 hover:bg-score-amber/10",
  red: "bg-score-red/5 hover:bg-score-red/10",
};

export function ScoreResults({ scores }: ScoreResultsProps) {
  const greens = scores.filter((x) => x === 3).length;
  const ambers = scores.filter((x) => x === 2).length;
  const reds = scores.filter((x) => x === 1).length;

  return (
    <div className="rounded-2xl bg-card p-6 border border-border">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-card-foreground">
          Results
        </h3>
        <div className="flex items-center gap-3">
          <SummaryBadge count={greens} color="green" />
          <SummaryBadge count={ambers} color="amber" />
          <SummaryBadge count={reds} color="red" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {scores.map((s, i) => {
          const status = statusLabel(s);
          return (
            <div
              key={testLabels[i]}
              className={cn(
                "flex items-center justify-between rounded-xl px-4 py-3.5 transition-colors duration-200",
                rowBg[status]
              )}
            >
              <div className="flex items-center gap-3">
                <span className={cn("score-dot", dotColors[status])} />
                <span className="text-sm font-semibold text-card-foreground">
                  {testLabels[i]}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
                    badgeColors[status]
                  )}
                >
                  {status}
                </span>
                <PercentileTooltip value={approxPercentile(s)} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PercentileTooltip({ value }: { value: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="text-xs text-muted-foreground font-mono hover:text-foreground transition-colors flex items-center gap-1"
      >
        {value}
        <Info className="w-3 h-3" />
      </button>
      {show && (
        <span className="absolute bottom-full right-0 mb-2 w-48 rounded-lg bg-foreground px-3 py-2 text-xs text-background font-normal shadow-lg z-50">
          Percentile estimate based on age group benchmarks
          <span className="absolute top-full right-4 border-4 border-transparent border-t-foreground" />
        </span>
      )}
    </span>
  );
}

function SummaryBadge({ count, color }: { count: number; color: string }) {
  return (
    <span className="flex items-center gap-1.5 text-sm">
      <span className={cn("score-dot !w-2.5 !h-2.5", dotColors[color])} />
      <span className="text-card-foreground font-bold font-mono text-xs">
        {count}
      </span>
    </span>
  );
}

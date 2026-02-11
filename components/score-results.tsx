"use client";

import { statusLabel, approxPercentile, testLabels } from "@/lib/scoring";
import { cn } from "@/lib/utils";

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

export function ScoreResults({ scores }: ScoreResultsProps) {
  const greens = scores.filter((x) => x === 3).length;
  const ambers = scores.filter((x) => x === 2).length;
  const reds = scores.filter((x) => x === 1).length;

  return (
    <div className="rounded-xl bg-card p-6 border border-border">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">Results</h3>

      <div className="flex flex-col gap-3">
        {scores.map((s, i) => {
          const status = statusLabel(s);
          return (
            <div
              key={testLabels[i]}
              className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className={cn("score-dot", dotColors[status])} />
                <span className="text-sm font-medium text-card-foreground">
                  {testLabels[i]}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold uppercase",
                    badgeColors[status]
                  )}
                >
                  {status}
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  {approxPercentile(s)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-4 rounded-lg bg-muted/30 px-4 py-3">
        <span className="text-sm font-medium text-muted-foreground">Summary:</span>
        <div className="flex items-center gap-3">
          <SummaryBadge count={greens} color="green" label="Green" />
          <SummaryBadge count={ambers} color="amber" label="Amber" />
          <SummaryBadge count={reds} color="red" label="Red" />
        </div>
      </div>
    </div>
  );
}

function SummaryBadge({ count, color, label }: { count: number; color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-sm">
      <span className={cn("score-dot", dotColors[color])} />
      <span className="text-card-foreground font-semibold">{count}</span>
      <span className="text-muted-foreground">{label}</span>
    </span>
  );
}

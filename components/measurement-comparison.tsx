"use client";

import { useState } from "react";
import {
  benchmarks,
  formatMinutesToMMSS,
  type Gender,
  type AgeGroup,
  type RawInputs,
} from "@/lib/scoring";
import { cn } from "@/lib/utils";
import { Info, ArrowUp, ArrowDown, Minus } from "lucide-react";

interface MeasurementComparisonProps {
  raw: RawInputs;
  gender: Gender;
  ageGroup: AgeGroup;
}

export function MeasurementComparison({
  raw,
  gender,
  ageGroup,
}: MeasurementComparisonProps) {
  const data = benchmarks[gender][ageGroup];
  const [showTooltip, setShowTooltip] = useState(false);

  const rows = [
    {
      label: "20m Sprint",
      unit: "s",
      athlete: raw.sprintVal,
      standard: data.sprint[0],
      better: "lower" as const,
      format: "number" as const,
    },
    {
      label: "Vertical Jump",
      unit: "cm",
      athlete: raw.verticalVal,
      standard: data.vertical[0],
      better: "higher" as const,
      format: "number" as const,
    },
    {
      label: "Broad Jump",
      unit: "cm",
      athlete: raw.broadVal,
      standard: data.broad[0],
      better: "higher" as const,
      format: "number" as const,
    },
    {
      label: "Push-Ups",
      unit: "reps",
      athlete: raw.strengthVal,
      standard: data.strength[0],
      better: "higher" as const,
      format: "number" as const,
    },
    {
      label: "1km Run",
      unit: "mm:ss",
      athlete: raw.enduranceVal,
      standard: data.endurance[0],
      better: "lower" as const,
      format: "time" as const,
    },
  ];

  return (
    <div className="rounded-2xl bg-card p-6 border border-border">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-card-foreground">
          Measurement vs Age Standard
        </h3>
        <span className="relative inline-flex">
          <button
            type="button"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="What is Age Standard?"
          >
            <Info className="w-4 h-4" />
          </button>
          {showTooltip && (
            <span className="absolute bottom-full right-0 mb-2 w-56 rounded-xl bg-foreground px-3 py-2 text-xs text-background font-normal shadow-lg z-50">
              Age Standard is the benchmark for your age group. Meeting this means you perform at an average competitive level.
              <span className="absolute top-full right-3 border-4 border-transparent border-t-foreground" />
            </span>
          )}
        </span>
      </div>

      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 pr-2 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                Test
              </th>
              <th className="text-right py-3 px-2 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                You
              </th>
              <th className="text-right py-3 px-2 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                Standard
              </th>
              <th className="text-right py-3 pl-2 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                Diff
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const diff =
                r.better === "higher"
                  ? r.athlete - r.standard
                  : r.standard - r.athlete;
              const isPositive = diff > 0;
              const isNeutral = diff === 0;

              const athleteText =
                r.format === "time"
                  ? formatMinutesToMMSS(r.athlete)
                  : r.unit === "s"
                    ? r.athlete.toFixed(2)
                    : Math.round(r.athlete).toString();

              const standardText =
                r.format === "time"
                  ? formatMinutesToMMSS(r.standard)
                  : r.unit === "s"
                    ? r.standard.toFixed(2)
                    : Math.round(r.standard).toString();

              const diffText =
                r.format === "time"
                  ? `${isPositive ? "+" : isNeutral ? "" : "-"}${formatMinutesToMMSS(Math.abs(diff))}`
                  : `${isPositive ? "+" : isNeutral ? "" : "-"}${Math.abs(diff).toFixed(r.unit === "s" ? 2 : 0)}`;

              return (
                <tr
                  key={r.label}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <td className="py-3.5 pr-2 text-card-foreground font-semibold">
                    {r.label}
                  </td>
                  <td className="py-3.5 px-2 text-right font-mono text-card-foreground font-semibold">
                    {athleteText}
                  </td>
                  <td className="py-3.5 px-2 text-right font-mono text-muted-foreground">
                    {standardText}
                  </td>
                  <td className="py-3.5 pl-2 text-right">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 font-mono text-xs font-bold rounded-lg px-2 py-1",
                        isPositive
                          ? "text-score-green bg-score-green/10"
                          : isNeutral
                            ? "text-muted-foreground bg-muted/50"
                            : "text-score-red bg-score-red/10"
                      )}
                    >
                      {isPositive ? (
                        <ArrowUp className="w-3 h-3" />
                      ) : isNeutral ? (
                        <Minus className="w-3 h-3" />
                      ) : (
                        <ArrowDown className="w-3 h-3" />
                      )}
                      {diffText}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

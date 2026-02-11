"use client";

import {
  benchmarks,
  formatMinutesToMMSS,
  type Gender,
  type AgeGroup,
  type RawInputs,
} from "@/lib/scoring";
import { cn } from "@/lib/utils";

interface MeasurementComparisonProps {
  raw: RawInputs;
  gender: Gender;
  ageGroup: AgeGroup;
}

export function MeasurementComparison({ raw, gender, ageGroup }: MeasurementComparisonProps) {
  const data = benchmarks[gender][ageGroup];

  const rows = [
    { label: "20m Sprint", unit: "s", athlete: raw.sprintVal, standard: data.sprint[0], better: "lower" as const, format: "number" as const },
    { label: "Vertical Jump", unit: "cm", athlete: raw.verticalVal, standard: data.vertical[0], better: "higher" as const, format: "number" as const },
    { label: "Broad Jump", unit: "cm", athlete: raw.broadVal, standard: data.broad[0], better: "higher" as const, format: "number" as const },
    { label: "Push-Ups", unit: "reps", athlete: raw.strengthVal, standard: data.strength[0], better: "higher" as const, format: "number" as const },
    { label: "1km Run", unit: "mm:ss", athlete: raw.enduranceVal, standard: data.endurance[0], better: "lower" as const, format: "time" as const },
  ];

  return (
    <div className="rounded-xl bg-card p-6 border border-border">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">
        Measurement vs Age Standard
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 font-medium text-muted-foreground">Test</th>
              <th className="text-right py-3 px-2 font-medium text-muted-foreground">You</th>
              <th className="text-right py-3 px-2 font-medium text-muted-foreground">Standard</th>
              <th className="text-right py-3 px-2 font-medium text-muted-foreground">Diff</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const diff = r.better === "higher" ? r.athlete - r.standard : r.standard - r.athlete;
              const isPositive = diff >= 0;

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
                  ? `${isPositive ? "+" : "-"}${formatMinutesToMMSS(Math.abs(diff))}`
                  : `${isPositive ? "+" : "-"}${Math.abs(diff).toFixed(r.unit === "s" ? 2 : 0)} ${r.unit}`;

              return (
                <tr key={r.label} className="border-b border-border/50">
                  <td className="py-3 px-2 text-card-foreground font-medium">{r.label}</td>
                  <td className="py-3 px-2 text-right font-mono text-card-foreground">
                    {athleteText}
                  </td>
                  <td className="py-3 px-2 text-right font-mono text-muted-foreground">
                    {standardText}
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 font-mono text-xs font-semibold",
                        isPositive ? "text-score-green" : "text-score-red"
                      )}
                    >
                      <span
                        className={cn(
                          "score-dot !w-2 !h-2",
                          isPositive ? "bg-score-green" : "bg-score-red"
                        )}
                      />
                      {diffText}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Difference shows how far above/below the age standard you are for each test.
      </p>
    </div>
  );
}

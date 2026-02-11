"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from "recharts";
import { chartLabels } from "@/lib/scoring";

interface PerformanceChartProps {
  scores: (1 | 2 | 3)[];
  baselineScores?: (1 | 2 | 3)[] | null;
  isRetest: boolean;
}

const scoreColors = ["", "#ef4444", "#eab308", "#22c55e"];
const levelLabels = ["", "Developing", "Age Standard", "High Perf."];

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-card border border-border px-4 py-3 shadow-xl">
      <p className="text-sm font-bold text-card-foreground mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-xs text-muted-foreground">
          <span style={{ color: entry.color }} className="font-semibold">
            {entry.name}:
          </span>{" "}
          {levelLabels[entry.value] || entry.value}
        </p>
      ))}
    </div>
  );
}

export function PerformanceChart({
  scores,
  baselineScores,
  isRetest,
}: PerformanceChartProps) {
  const data = chartLabels.map((label, i) => ({
    name: label,
    current: scores[i],
    standard: 2,
    ...(isRetest && baselineScores ? { baseline: baselineScores[i] } : {}),
  }));

  return (
    <div className="rounded-2xl bg-card p-6 border border-border">
      <h3 className="text-base font-bold text-card-foreground mb-5">
        Performance Overview
      </h3>
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="20%">
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#27272a"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={{ fill: "#71717a", fontSize: 12, fontWeight: 500 }}
              axisLine={{ stroke: "#27272a" }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 3]}
              ticks={[0, 1, 2, 3]}
              tickFormatter={(v: number) => levelLabels[v] || ""}
              tick={{ fill: "#71717a", fontSize: 11 }}
              axisLine={{ stroke: "#27272a" }}
              tickLine={false}
              width={90}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
            />
            <Legend
              wrapperStyle={{ paddingTop: 16, fontSize: 12 }}
              formatter={(value: string) => (
                <span style={{ color: "#71717a" }}>{value}</span>
              )}
            />
            <Bar
              dataKey="current"
              name={isRetest ? "Retest" : "Baseline"}
              radius={[6, 6, 0, 0]}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={scoreColors[entry.current]} />
              ))}
            </Bar>
            <Bar
              dataKey="standard"
              name="Age Standard"
              fill="#3f3f46"
              radius={[6, 6, 0, 0]}
              opacity={0.5}
            />
            {isRetest && baselineScores && (
              <Bar
                dataKey="baseline"
                name="Baseline"
                fill="#3b82f6"
                radius={[6, 6, 0, 0]}
                opacity={0.7}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

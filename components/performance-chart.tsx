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
} from "recharts";
import { chartLabels } from "@/lib/scoring";

interface PerformanceChartProps {
  scores: (1 | 2 | 3)[];
  baselineScores?: (1 | 2 | 3)[] | null;
  isRetest: boolean;
}

const scoreColors = ["", "#e74c3c", "#f39c12", "#2ecc71"];
const levelLabels = ["", "Developing", "Age Standard", "High Perf."];

export function PerformanceChart({ scores, baselineScores, isRetest }: PerformanceChartProps) {
  const data = chartLabels.map((label, i) => ({
    name: label,
    current: scores[i],
    standard: 2,
    ...(isRetest && baselineScores ? { baseline: baselineScores[i] } : {}),
  }));

  return (
    <div className="rounded-xl bg-card p-6 border border-border">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">Performance Overview</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: "#8a8a9a", fontSize: 12 }}
              axisLine={{ stroke: "#2a2a3a" }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 3]}
              ticks={[0, 1, 2, 3]}
              tickFormatter={(v: number) => levelLabels[v] || ""}
              tick={{ fill: "#8a8a9a", fontSize: 11 }}
              axisLine={{ stroke: "#2a2a3a" }}
              tickLine={false}
              width={90}
            />
            <Legend
              wrapperStyle={{ paddingTop: 16, fontSize: 12 }}
              formatter={(value: string) => (
                <span style={{ color: "#8a8a9a" }}>{value}</span>
              )}
            />
            <Bar
              dataKey="current"
              name={isRetest ? "Retest" : "Baseline"}
              radius={[4, 4, 0, 0]}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={scoreColors[entry.current]} />
              ))}
            </Bar>
            <Bar
              dataKey="standard"
              name="Age Standard"
              fill="#555566"
              radius={[4, 4, 0, 0]}
              opacity={0.5}
            />
            {isRetest && baselineScores && (
              <Bar
                dataKey="baseline"
                name="Baseline"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                opacity={0.7}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

"use client";

import {
  TrendingUp,
  Target,
  Trophy,
  FileDown,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { testLabels, trainingAreas, sportProfiles } from "@/lib/scoring";
import type { ScoreResult } from "@/lib/scoring";

interface DashboardCardsProps {
  currentResult: ScoreResult;
  baselineResult: ScoreResult | null;
  sport: string;
  isRetest: boolean;
  lastTestDate: string;
  onExportPdf: () => void;
}

export function DashboardCards({
  currentResult,
  baselineResult,
  sport,
  isRetest,
  lastTestDate,
  onExportPdf,
}: DashboardCardsProps) {
  const scores = currentResult.scores;
  const greens = scores.filter((s) => s === 3).length;
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

  const level =
    avgScore >= 2.6
      ? "High Performance"
      : avgScore >= 1.8
        ? "Age Standard"
        : "Developing";

  const levelColor =
    level === "High Performance"
      ? "text-score-green"
      : level === "Age Standard"
        ? "text-score-amber"
        : "text-score-red";

  // Primary focus = lowest score with highest sport priority
  const profile = sportProfiles[sport] || sportProfiles.Other;
  const ranked = scores
    .map((s, i) => ({
      score: s,
      index: i,
      priority: profile[trainingAreas[i].key] || 2,
    }))
    .sort((a, b) => a.score - b.score || b.priority - a.priority);

  const primaryFocus = trainingAreas[ranked[0].index].name;
  const strengthIdx = scores.indexOf(3);
  const strengthName =
    strengthIdx >= 0 ? testLabels[strengthIdx] : "Keep training";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Current Level */}
      <DashboardCard
        icon={<TrendingUp className="w-5 h-5" />}
        iconColor={levelColor}
        title="Current Level"
        value={level}
        valueColor={levelColor}
        subtitle={`${greens}/5 at green`}
      />

      {/* Primary Focus */}
      <DashboardCard
        icon={<Target className="w-5 h-5" />}
        iconColor="text-primary"
        title="Primary Focus"
        value={primaryFocus}
        subtitle="Biggest opportunity"
      />

      {/* Top Strength */}
      <DashboardCard
        icon={<Trophy className="w-5 h-5" />}
        iconColor="text-score-green"
        title="Top Strength"
        value={strengthName}
        subtitle={strengthIdx >= 0 ? "Above age standard" : "No greens yet"}
      />

      {/* Last Assessment */}
      <button
        onClick={onExportPdf}
        className="group flex flex-col gap-3 rounded-2xl bg-card border border-border p-5 text-left transition-all duration-200 hover:border-primary/40 hover:bg-card/80 cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-muted">
            <FileDown className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            Last Assessment
          </p>
          <p className="text-sm font-bold text-card-foreground mt-1">{lastTestDate}</p>
          <p className="text-xs text-primary font-medium mt-1">Download PDF</p>
        </div>
      </button>

      {/* Progress Snapshot (if retest) */}
      {isRetest && baselineResult && (
        <div className="sm:col-span-2 lg:col-span-4 rounded-2xl bg-card border border-border p-5">
          <h4 className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-4">
            Progress Snapshot -- Baseline vs Retest
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {scores.map((s, i) => {
              const baseline = baselineResult.scores[i];
              const diff = s - baseline;
              return (
                <div
                  key={testLabels[i]}
                  className="flex flex-col items-center gap-1 rounded-xl bg-muted/50 p-3"
                >
                  <span className="text-xs text-muted-foreground font-medium">
                    {testLabels[i].split(" ")[0]}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-bold text-card-foreground font-mono">
                      {s}
                    </span>
                    {diff !== 0 && (
                      <span
                        className={cn(
                          "flex items-center text-xs font-bold",
                          diff > 0 ? "text-score-green" : "text-score-red"
                        )}
                      >
                        {diff > 0 ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        {Math.abs(diff)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function DashboardCard({
  icon,
  iconColor,
  title,
  value,
  valueColor,
  subtitle,
}: {
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  value: string;
  valueColor?: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-card border border-border p-5 transition-all duration-200 hover:border-border/80">
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-muted">
        <span className={iconColor}>{icon}</span>
      </div>
      <div>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          {title}
        </p>
        <p className={cn("text-sm font-bold mt-1", valueColor || "text-card-foreground")}>
          {value}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

"use client";

import { cn } from "@/lib/utils";

interface HeroSectionProps {
  greens: number;
  ambers: number;
  reds: number;
  overallScore: number;
  level: string;
  lastTestDate: string | null;
  hasResults: boolean;
}

export function HeroSection({
  greens,
  ambers,
  reds,
  overallScore,
  level,
  lastTestDate,
  hasResults,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/hero-bg.jpg"
          alt=""
          crossOrigin="anonymous"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative flex flex-col gap-8 px-6 py-10 sm:px-10 sm:py-14 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Your Performance Hub
          </h2>
          <p className="text-lg text-muted-foreground font-medium">
            Track. Compare. Improve.
          </p>

          {hasResults && (
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <StatPill color="green" count={greens} label="Green" />
              <StatPill color="amber" count={ambers} label="Amber" />
              <StatPill color="red" count={reds} label="Red" />
              {lastTestDate && (
                <span className="text-xs text-muted-foreground">
                  Last tested: {lastTestDate}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Score Ring */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative flex items-center justify-center">
            <svg width="140" height="140" viewBox="0 0 140 140" className="rotate-[-90deg]">
              <circle
                cx="70"
                cy="70"
                r="58"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-border"
              />
              <circle
                cx="70"
                cy="70"
                r="58"
                fill="none"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 58}`}
                strokeDashoffset={`${2 * Math.PI * 58 * (1 - (hasResults ? overallScore / 100 : 0))}`}
                className={cn(
                  "transition-all duration-1000 ease-out",
                  overallScore >= 80
                    ? "text-score-green"
                    : overallScore >= 50
                      ? "text-score-amber"
                      : overallScore > 0
                        ? "text-score-red"
                        : "text-border"
                )}
                stroke="currentColor"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-bold text-foreground font-mono">
                {hasResults ? overallScore : "--"}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                Score
              </span>
            </div>
          </div>
          {hasResults && (
            <span
              className={cn(
                "rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider",
                level === "High Performance"
                  ? "bg-score-green/15 text-score-green"
                  : level === "Age Standard"
                    ? "bg-score-amber/15 text-score-amber"
                    : "bg-score-red/15 text-score-red"
              )}
            >
              {level}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

function StatPill({ color, count, label }: { color: string; count: number; label: string }) {
  const colorClasses: Record<string, string> = {
    green: "bg-score-green/15 text-score-green",
    amber: "bg-score-amber/15 text-score-amber",
    red: "bg-score-red/15 text-score-red",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold",
        colorClasses[color]
      )}
    >
      <span className="text-lg font-bold font-mono">{count}</span>
      {label}
    </span>
  );
}

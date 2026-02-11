"use client";

import { sportProfiles, trainingAreas } from "@/lib/scoring";
import { Target, Flame, Star } from "lucide-react";

interface TrainingRecommendationsProps {
  scores: (1 | 2 | 3)[];
  sport: string;
}

export function TrainingRecommendations({ scores, sport }: TrainingRecommendationsProps) {
  const profile = sportProfiles[sport] || sportProfiles.Other;

  const ranked = scores
    .map((s, i) => ({
      score: s,
      index: i,
      priority: profile[trainingAreas[i].key] || 2,
    }))
    .sort((a, b) => a.score - b.score || b.priority - a.priority);

  const primary = ranked[0];
  const secondary = ranked[1];

  const strengths = scores
    .map((s, i) => (s === 3 ? trainingAreas[i].name : null))
    .filter(Boolean);

  return (
    <div className="rounded-xl bg-card p-6 border border-border">
      <h3 className="text-lg font-semibold text-card-foreground mb-6">
        Performance Breakdown & Training Plan
      </h3>

      {/* Strengths */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 text-score-green" />
          <h4 className="text-sm font-semibold text-score-green uppercase tracking-wider">
            Your Strengths
          </h4>
        </div>
        {strengths.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            {strengths.map((s) => (
              <span key={s} className="text-sm text-card-foreground">
                {s}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No clear GREEN strengths yet -- build consistency and retest.
          </p>
        )}
      </div>

      {/* Primary Focus */}
      <div className="rounded-lg bg-primary/10 border border-primary/30 p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-4 h-4 text-primary" />
          <h4 className="text-sm font-semibold text-primary uppercase tracking-wider">
            Primary Focus (Next 4-6 Weeks)
          </h4>
        </div>
        <p className="text-sm font-semibold text-card-foreground mb-2">
          {trainingAreas[primary.index].name}
        </p>
        <p className="text-sm text-muted-foreground mb-3">
          This is the biggest opportunity right now. Improving this will have the biggest impact.
        </p>
        <ul className="flex flex-col gap-1.5">
          {trainingAreas[primary.index].tips.map((tip) => (
            <li key={tip} className="text-sm text-card-foreground flex items-start gap-2">
              <span className="text-primary mt-1 flex-shrink-0">-</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Secondary Focus */}
      <div className="rounded-lg bg-muted/50 border border-border p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Flame className="w-4 h-4 text-score-amber" />
          <h4 className="text-sm font-semibold text-score-amber uppercase tracking-wider">
            Secondary Focus
          </h4>
        </div>
        <p className="text-sm font-semibold text-card-foreground mb-2">
          {trainingAreas[secondary.index].name}
        </p>
        <p className="text-sm text-muted-foreground mb-3">
          Improving this will support your primary focus.
        </p>
        <ul className="flex flex-col gap-1.5">
          {trainingAreas[secondary.index].tips.map((tip) => (
            <li key={tip} className="text-sm text-card-foreground flex items-start gap-2">
              <span className="text-score-amber mt-1 flex-shrink-0">-</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg bg-muted/30 px-4 py-3">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-card-foreground">If you only do ONE thing:</span>{" "}
          train your primary focus twice per week for 6 weeks, then retest.
        </p>
      </div>
    </div>
  );
}

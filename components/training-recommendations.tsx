"use client";

import { sportProfiles, trainingAreas } from "@/lib/scoring";
import { Target, Flame, Star, ChevronRight } from "lucide-react";

interface TrainingRecommendationsProps {
  scores: (1 | 2 | 3)[];
  sport: string;
}

export function TrainingRecommendations({
  scores,
  sport,
}: TrainingRecommendationsProps) {
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
    <div className="rounded-2xl bg-card p-6 border border-border">
      <h3 className="text-base font-bold text-card-foreground mb-6">
        Training Plan
      </h3>

      {/* Strengths */}
      {strengths.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-score-green" />
            <h4 className="text-xs font-bold text-score-green uppercase tracking-widest">
              Your Strengths
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {strengths.map((s) => (
              <span
                key={s}
                className="rounded-lg bg-score-green/10 border border-score-green/20 px-3 py-1.5 text-xs font-semibold text-score-green"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Primary Focus */}
      <div className="rounded-2xl bg-primary/5 border border-primary/20 p-5 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20">
            <Target className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-primary uppercase tracking-widest">
              Primary Focus
            </h4>
            <p className="text-xs text-muted-foreground">Next 4-6 weeks</p>
          </div>
        </div>
        <p className="text-sm font-bold text-card-foreground mb-3">
          {trainingAreas[primary.index].name}
        </p>
        <ul className="flex flex-col gap-2">
          {trainingAreas[primary.index].tips.map((tip) => (
            <li
              key={tip}
              className="text-sm text-muted-foreground flex items-start gap-2"
            >
              <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Secondary Focus */}
      <div className="rounded-2xl bg-muted/50 border border-border p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-score-amber/10">
            <Flame className="w-4 h-4 text-score-amber" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-score-amber uppercase tracking-widest">
              Secondary Focus
            </h4>
          </div>
        </div>
        <p className="text-sm font-bold text-card-foreground mb-3">
          {trainingAreas[secondary.index].name}
        </p>
        <ul className="flex flex-col gap-2">
          {trainingAreas[secondary.index].tips.map((tip) => (
            <li
              key={tip}
              className="text-sm text-muted-foreground flex items-start gap-2"
            >
              <ChevronRight className="w-4 h-4 text-score-amber mt-0.5 flex-shrink-0" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Motivational CTA */}
      <div className="rounded-xl bg-muted/30 px-5 py-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          <span className="font-bold text-card-foreground">
            If you only do ONE thing:
          </span>{" "}
          train your primary focus twice per week for 6 weeks, then retest.
        </p>
      </div>
    </div>
  );
}

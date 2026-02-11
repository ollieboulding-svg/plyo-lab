"use client";

import { useState } from "react";
import type { ScoreResult } from "@/lib/scoring";
import { Header } from "@/components/header";
import { AthleteForm, type AthleteMeta } from "@/components/athlete-form";
import { ReportHeader } from "@/components/report-header";
import { ScoreResults } from "@/components/score-results";
import { PerformanceChart } from "@/components/performance-chart";
import { MeasurementComparison } from "@/components/measurement-comparison";
import { TrainingRecommendations } from "@/components/training-recommendations";
import { PdfExportButton } from "@/components/pdf-export-button";

export default function HomePage() {
  const [baselineResult, setBaselineResult] = useState<ScoreResult | null>(null);
  const [currentResult, setCurrentResult] = useState<ScoreResult | null>(null);
  const [meta, setMeta] = useState<AthleteMeta | null>(null);
  const [isRetest, setIsRetest] = useState(false);

  function handleBaseline(result: ScoreResult, athleteMeta: AthleteMeta) {
    setBaselineResult(result);
    setCurrentResult(result);
    setMeta(athleteMeta);
    setIsRetest(false);
  }

  function handleRetest(result: ScoreResult, athleteMeta: AthleteMeta) {
    setCurrentResult(result);
    setMeta(athleteMeta);
    setIsRetest(true);
  }

  function handleReset() {
    setBaselineResult(null);
    setCurrentResult(null);
    setMeta(null);
    setIsRetest(false);
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Input Form */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-6">
              <AthleteForm
                onBaseline={handleBaseline}
                onRetest={handleRetest}
                onReset={handleReset}
                hasBaseline={!!baselineResult}
              />
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-7">
            {currentResult && meta ? (
              <div className="flex flex-col gap-6" id="pdf-content">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">
                    {isRetest ? "Retest Results" : "Baseline Results"}
                  </h2>
                  <PdfExportButton targetId="pdf-content" />
                </div>

                <ReportHeader meta={meta} />

                <ScoreResults scores={currentResult.scores} />

                <PerformanceChart
                  scores={currentResult.scores}
                  baselineScores={isRetest ? baselineResult?.scores : null}
                  isRetest={isRetest}
                />

                <MeasurementComparison
                  raw={currentResult.raw}
                  gender={meta.gender}
                  ageGroup={meta.ageGroup}
                />

                <TrainingRecommendations
                  scores={currentResult.scores}
                  sport={meta.sport}
                />
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl bg-card border border-border border-dashed p-12 text-center min-h-[400px]">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-card-foreground mb-2">
        No results yet
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
        Enter athlete details and test results on the left, then click{" "}
        <span className="font-semibold text-primary">Run Baseline</span> to generate
        a performance report.
      </p>
    </div>
  );
}

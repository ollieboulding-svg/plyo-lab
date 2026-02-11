"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { ScoreResult } from "@/lib/scoring";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { DashboardCards } from "@/components/dashboard-cards";
import { AthleteForm, type AthleteMeta } from "@/components/athlete-form";
import { ReportHeader } from "@/components/report-header";
import { ScoreResults } from "@/components/score-results";
import { PerformanceChart } from "@/components/performance-chart";
import { MeasurementComparison } from "@/components/measurement-comparison";
import { TrainingRecommendations } from "@/components/training-recommendations";
import { PdfExportButton } from "@/components/pdf-export-button";
import { ClipboardList } from "lucide-react";

interface PersistedState {
  baselineResult: ScoreResult | null;
  currentResult: ScoreResult | null;
  meta: AthleteMeta | null;
  isRetest: boolean;
  lastTestDate: string | null;
}

const STORAGE_KEY = "plyo-lab-state";

function loadPersistedState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedState;
  } catch {
    return null;
  }
}

function persistState(state: PersistedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "assessment">("dashboard");
  const [baselineResult, setBaselineResult] = useState<ScoreResult | null>(null);
  const [currentResult, setCurrentResult] = useState<ScoreResult | null>(null);
  const [meta, setMeta] = useState<AthleteMeta | null>(null);
  const [isRetest, setIsRetest] = useState(false);
  const [lastTestDate, setLastTestDate] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const pdfRef = useRef<HTMLDivElement>(null);

  // Hydrate from localStorage
  useEffect(() => {
    const saved = loadPersistedState();
    if (saved) {
      setBaselineResult(saved.baselineResult);
      setCurrentResult(saved.currentResult);
      setMeta(saved.meta);
      setIsRetest(saved.isRetest);
      setLastTestDate(saved.lastTestDate);
    }
    setHydrated(true);
  }, []);

  // Persist on change
  useEffect(() => {
    if (!hydrated) return;
    persistState({ baselineResult, currentResult, meta, isRetest, lastTestDate });
  }, [baselineResult, currentResult, meta, isRetest, lastTestDate, hydrated]);

  const dateNow = () =>
    new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const handleBaseline = useCallback(
    (result: ScoreResult, athleteMeta: AthleteMeta) => {
      setBaselineResult(result);
      setCurrentResult(result);
      setMeta(athleteMeta);
      setIsRetest(false);
      setLastTestDate(dateNow());
      setActiveTab("dashboard");
    },
    []
  );

  const handleRetest = useCallback(
    (result: ScoreResult, athleteMeta: AthleteMeta) => {
      setCurrentResult(result);
      setMeta(athleteMeta);
      setIsRetest(true);
      setLastTestDate(dateNow());
      setActiveTab("dashboard");
    },
    []
  );

  const handleReset = useCallback(() => {
    setBaselineResult(null);
    setCurrentResult(null);
    setMeta(null);
    setIsRetest(false);
    setLastTestDate(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const handleExportPdf = useCallback(async () => {
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const el = document.getElementById("pdf-content");
      if (!el) return;

      el.style.backgroundColor = "#09090b";
      const canvas = await html2canvas(el, {
        scale: 2,
        backgroundColor: "#09090b",
        useCORS: true,
      });
      el.style.backgroundColor = "";

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = 210;
      const pageHeight = 297;
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save("PlyoLab_Report.pdf");
    } catch {
      // ignore
    }
  }, []);

  // Compute hero stats
  const scores = currentResult?.scores ?? [];
  const greens = scores.filter((s) => s === 3).length;
  const ambers = scores.filter((s) => s === 2).length;
  const reds = scores.filter((s) => s === 1).length;
  const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  const overallScore = scores.length > 0 ? Math.round((avgScore / 3) * 100) : 0;
  const level =
    avgScore >= 2.6 ? "High Performance" : avgScore >= 1.8 ? "Age Standard" : "Developing";

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === "dashboard" ? (
            <div className="flex flex-col gap-6">
              {/* Hero */}
              <HeroSection
                greens={greens}
                ambers={ambers}
                reds={reds}
                overallScore={overallScore}
                level={level}
                lastTestDate={lastTestDate}
                hasResults={!!currentResult}
              />

              {/* Dashboard cards or empty state */}
              {currentResult && meta ? (
                <>
                  <DashboardCards
                    currentResult={currentResult}
                    baselineResult={baselineResult}
                    sport={meta.sport}
                    isRetest={isRetest}
                    lastTestDate={lastTestDate || dateNow()}
                    onExportPdf={handleExportPdf}
                  />

                  {/* Detailed Results (for PDF) */}
                  <div id="pdf-content" ref={pdfRef} className="flex flex-col gap-6">
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
                </>
              ) : (
                <DashboardEmptyState onGoToAssessment={() => setActiveTab("assessment")} />
              )}
            </div>
          ) : (
            /* Assessment Tab */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5">
                <div className="lg:sticky lg:top-24">
                  <AthleteForm
                    onBaseline={handleBaseline}
                    onRetest={handleRetest}
                    onReset={handleReset}
                    hasBaseline={!!baselineResult}
                  />
                </div>
              </div>

              <div className="lg:col-span-7">
                {currentResult && meta ? (
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-bold text-foreground">
                        {isRetest ? "Retest Results" : "Baseline Results"}
                      </h2>
                      <PdfExportButton targetId="pdf-content-assessment" variant="compact" />
                    </div>

                    <div id="pdf-content-assessment" className="flex flex-col gap-6">
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
                  </div>
                ) : (
                  <AssessmentEmptyState />
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function DashboardEmptyState({ onGoToAssessment }: { onGoToAssessment: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-card border border-border border-dashed p-12 text-center min-h-[300px]">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
        <ClipboardList className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-lg font-bold text-card-foreground mb-2">
        No assessments yet
      </h3>
      <p className="text-sm text-muted-foreground max-w-md leading-relaxed mb-6">
        Run your first baseline assessment to see your performance dashboard with scoring,
        charts, and personalized training recommendations.
      </p>
      <button
        onClick={onGoToAssessment}
        className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-all active:scale-[0.98]"
      >
        Start Assessment
      </button>
    </div>
  );
}

function AssessmentEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-card border border-border border-dashed p-12 text-center min-h-[400px]">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-5">
        <svg
          className="w-8 h-8 text-muted-foreground"
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
      <h3 className="text-lg font-bold text-card-foreground mb-2">
        No results yet
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
        Enter athlete details and test results on the left, then click{" "}
        <span className="font-bold text-primary">Run Baseline</span> to generate
        a performance report.
      </p>
    </div>
  );
}

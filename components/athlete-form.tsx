"use client";

import { useState } from "react";
import {
  sports,
  ageGroups,
  genders,
  parseTimeToMinutes,
  calculateScores,
  type Gender,
  type AgeGroup,
  type ScoreResult,
  type RawInputs,
} from "@/lib/scoring";
import { User, Timer, ArrowUp, ArrowRight, Dumbbell, Heart, RotateCcw } from "lucide-react";

interface AthleteFormProps {
  onBaseline: (result: ScoreResult, meta: AthleteMeta) => void;
  onRetest: (result: ScoreResult, meta: AthleteMeta) => void;
  onReset: () => void;
  hasBaseline: boolean;
}

export interface AthleteMeta {
  name: string;
  gender: Gender;
  ageGroup: AgeGroup;
  sport: string;
  isRetest: boolean;
}

export function AthleteForm({ onBaseline, onRetest, onReset, hasBaseline }: AthleteFormProps) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender>("male");
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("16-17");
  const [sport, setSport] = useState("Football");
  const [sprint, setSprint] = useState("");
  const [vertical, setVertical] = useState("");
  const [broad, setBroad] = useState("");
  const [strength, setStrength] = useState("");
  const [endurance, setEndurance] = useState("");
  const [error, setError] = useState<string | null>(null);

  function getRawInputs(): RawInputs | null {
    const sprintVal = parseFloat(sprint);
    const verticalVal = parseFloat(vertical);
    const broadVal = parseFloat(broad);
    const strengthVal = parseFloat(strength);
    const enduranceVal = parseTimeToMinutes(endurance);

    if ([sprintVal, verticalVal, broadVal, strengthVal, enduranceVal].some((v) => Number.isNaN(v))) {
      setError("Please complete all fields. 1km must be mm.ss (e.g. 3.56) or mm:ss (e.g. 3:56).");
      return null;
    }
    setError(null);
    return { sprintVal, verticalVal, broadVal, strengthVal, enduranceVal };
  }

  function handleBaseline() {
    const raw = getRawInputs();
    if (!raw) return;
    const result = calculateScores(gender, ageGroup, raw);
    onBaseline(result, { name: name || "Athlete", gender, ageGroup, sport, isRetest: false });
  }

  function handleRetest() {
    const raw = getRawInputs();
    if (!raw) return;
    const result = calculateScores(gender, ageGroup, raw);
    onRetest(result, { name: name || "Athlete", gender, ageGroup, sport, isRetest: true });
  }

  function handleReset() {
    setName("");
    setSprint("");
    setVertical("");
    setBroad("");
    setStrength("");
    setEndurance("");
    setError(null);
    onReset();
  }

  return (
    <div className="rounded-xl bg-card p-6 border border-border">
      <div className="flex items-center gap-2 mb-6">
        <User className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-card-foreground">Athlete Details</h2>
      </div>

      {/* Profile Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="sm:col-span-2">
          <label htmlFor="athlete-name" className="block text-sm font-medium text-muted-foreground mb-1.5">
            Athlete Name
          </label>
          <input
            id="athlete-name"
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>
        <div>
          <label htmlFor="gender-select" className="block text-sm font-medium text-muted-foreground mb-1.5">
            Gender
          </label>
          <select
            id="gender-select"
            value={gender}
            onChange={(e) => setGender(e.target.value as Gender)}
            className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
          >
            {genders.map((g) => (
              <option key={g} value={g}>
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="age-select" className="block text-sm font-medium text-muted-foreground mb-1.5">
            Age Group
          </label>
          <select
            id="age-select"
            value={ageGroup}
            onChange={(e) => setAgeGroup(e.target.value as AgeGroup)}
            className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
          >
            {ageGroups.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="sport-select" className="block text-sm font-medium text-muted-foreground mb-1.5">
            Sport
          </label>
          <select
            id="sport-select"
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
          >
            {sports.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Test Inputs */}
      <div className="border-t border-border pt-6 mb-6">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Test Results
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TestInput
            id="sprint-input"
            icon={<Timer className="w-4 h-4" />}
            label="20m Sprint"
            unit="seconds"
            placeholder="e.g. 3.45"
            value={sprint}
            onChange={setSprint}
          />
          <TestInput
            id="vertical-input"
            icon={<ArrowUp className="w-4 h-4" />}
            label="Vertical Jump"
            unit="cm"
            placeholder="e.g. 45"
            value={vertical}
            onChange={setVertical}
          />
          <TestInput
            id="broad-input"
            icon={<ArrowRight className="w-4 h-4" />}
            label="Broad Jump"
            unit="cm"
            placeholder="e.g. 210"
            value={broad}
            onChange={setBroad}
          />
          <TestInput
            id="strength-input"
            icon={<Dumbbell className="w-4 h-4" />}
            label="Push-Ups"
            unit="reps"
            placeholder="e.g. 30"
            value={strength}
            onChange={setStrength}
          />
          <div className="sm:col-span-2">
            <TestInput
              id="endurance-input"
              icon={<Heart className="w-4 h-4" />}
              label="1km Endurance"
              unit="mm:ss"
              placeholder="e.g. 4.30 or 4:30"
              value={endurance}
              onChange={setEndurance}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3 mb-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleBaseline}
          className="flex-1 min-w-[140px] rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring/50"
        >
          Run Baseline
        </button>
        <button
          type="button"
          onClick={handleRetest}
          disabled={!hasBaseline}
          className="flex-1 min-w-[140px] rounded-lg border border-primary px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring/50"
        >
          Run Retest
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors focus:outline-none focus:ring-2 focus:ring-ring/50"
        >
          <RotateCcw className="w-4 h-4" />
          New Athlete
        </button>
      </div>
    </div>
  );
}

function TestInput({
  id,
  icon,
  label,
  unit,
  placeholder,
  value,
  onChange,
}: {
  id: string;
  icon: React.ReactNode;
  label: string;
  unit: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground mb-1.5">
        <span className="text-primary">{icon}</span>
        {label}
        <span className="text-xs text-muted-foreground/60">({unit})</span>
      </label>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 font-mono"
      />
    </div>
  );
}

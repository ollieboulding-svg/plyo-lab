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
import {
  User,
  Timer,
  ArrowUp,
  ArrowRight,
  Dumbbell,
  Heart,
  RotateCcw,
  Info,
} from "lucide-react";

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

export function AthleteForm({
  onBaseline,
  onRetest,
  onReset,
  hasBaseline,
}: AthleteFormProps) {
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

    if (
      [sprintVal, verticalVal, broadVal, strengthVal, enduranceVal].some((v) =>
        Number.isNaN(v)
      )
    ) {
      setError(
        "Please complete all fields. 1km must be mm.ss (e.g. 3.56) or mm:ss (e.g. 3:56)."
      );
      return null;
    }
    setError(null);
    return { sprintVal, verticalVal, broadVal, strengthVal, enduranceVal };
  }

  function handleBaseline() {
    const raw = getRawInputs();
    if (!raw) return;
    const result = calculateScores(gender, ageGroup, raw);
    onBaseline(result, {
      name: name || "Athlete",
      gender,
      ageGroup,
      sport,
      isRetest: false,
    });
  }

  function handleRetest() {
    const raw = getRawInputs();
    if (!raw) return;
    const result = calculateScores(gender, ageGroup, raw);
    onRetest(result, {
      name: name || "Athlete",
      gender,
      ageGroup,
      sport,
      isRetest: true,
    });
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
    <div className="rounded-2xl bg-card p-6 border border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10">
          <User className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h2 className="text-base font-bold text-card-foreground">
            Athlete Details
          </h2>
          <p className="text-xs text-muted-foreground">
            Enter profile and test results
          </p>
        </div>
      </div>

      {/* Profile Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="sm:col-span-2">
          <FormLabel htmlFor="athlete-name">Athlete Name</FormLabel>
          <input
            id="athlete-name"
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-all"
          />
        </div>
        <div>
          <FormLabel htmlFor="gender-select">Gender</FormLabel>
          <select
            id="gender-select"
            value={gender}
            onChange={(e) => setGender(e.target.value as Gender)}
            className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-all"
          >
            {genders.map((g) => (
              <option key={g} value={g}>
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <FormLabel htmlFor="age-select">
            <span>Age Group</span>
            <Tooltip text="Benchmarks are grouped by age range to compare against peers" />
          </FormLabel>
          <select
            id="age-select"
            value={ageGroup}
            onChange={(e) => setAgeGroup(e.target.value as AgeGroup)}
            className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-all"
          >
            {ageGroups.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <FormLabel htmlFor="sport-select">Sport</FormLabel>
          <select
            id="sport-select"
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-all"
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
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
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
              tooltip="Enter time as mm.ss (e.g. 3.56 = 3min 56sec) or mm:ss (e.g. 3:56)"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-destructive/10 border border-destructive/30 px-4 py-3 mb-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleBaseline}
          className="w-full rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring/50 active:scale-[0.98]"
        >
          Run Baseline
        </button>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleRetest}
            disabled={!hasBaseline}
            className="flex-1 rounded-xl border border-primary/50 bg-primary/5 px-4 py-3 text-sm font-bold text-primary hover:bg-primary/10 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring/50"
          >
            Run Retest
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring/50"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

function FormLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground mb-2"
    >
      {children}
    </label>
  );
}

function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className="text-muted-foreground hover:text-foreground transition-colors"
        aria-label={text}
      >
        <Info className="w-3.5 h-3.5" />
      </button>
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 rounded-lg bg-foreground px-3 py-2 text-xs text-background font-normal shadow-lg z-50">
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
        </span>
      )}
    </span>
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
  tooltip,
}: {
  id: string;
  icon: React.ReactNode;
  label: string;
  unit: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  tooltip?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground mb-2"
      >
        <span className="text-primary">{icon}</span>
        {label}
        <span className="text-xs text-muted-foreground/50">({unit})</span>
        {tooltip && <Tooltip text={tooltip} />}
      </label>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 font-mono transition-all"
      />
    </div>
  );
}

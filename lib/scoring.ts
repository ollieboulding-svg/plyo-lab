// ============================================
// SPORT PRIORITY PROFILES
// ============================================
export const sportProfiles: Record<string, { sprint: number; power: number; strength: number; endurance: number }> = {
  Football: { sprint: 3, power: 3, strength: 2, endurance: 2 },
  Rugby: { sprint: 2, power: 3, strength: 3, endurance: 2 },
  Athletics: { sprint: 3, power: 3, strength: 2, endurance: 1 },
  Basketball: { sprint: 3, power: 3, strength: 2, endurance: 2 },
  Hockey: { sprint: 3, power: 2, strength: 2, endurance: 3 },
  "American Football": { sprint: 3, power: 3, strength: 3, endurance: 1 },
  Other: { sprint: 2, power: 2, strength: 2, endurance: 2 },
};

export const sports = Object.keys(sportProfiles);

export const ageGroups = ["12-13", "14-15", "16-17", "18-21", "22-25", "26-30"] as const;
export type AgeGroup = (typeof ageGroups)[number];

export const genders = ["male", "female"] as const;
export type Gender = (typeof genders)[number];

// ============================================
// BENCHMARKS
// sprint seconds (lower better) [amber, green]
// vertical cm (higher better)
// broad cm (higher better)
// strength reps (higher better)
// endurance minutes (lower better)
// ============================================
type BenchmarkData = {
  sprint: [number, number];
  vertical: [number, number];
  broad: [number, number];
  strength: [number, number];
  endurance: [number, number];
};

export const benchmarks: Record<Gender, Record<AgeGroup, BenchmarkData>> = {
  female: {
    "12-13": { sprint: [3.9, 3.6], vertical: [28, 35], broad: [150, 170], strength: [8, 15], endurance: [6.0, 5.0] },
    "14-15": { sprint: [3.7, 3.4], vertical: [32, 40], broad: [165, 185], strength: [12, 20], endurance: [5.5, 4.7] },
    "16-17": { sprint: [3.6, 3.3], vertical: [36, 45], broad: [180, 200], strength: [15, 25], endurance: [5.2, 4.5] },
    "18-21": { sprint: [3.5, 3.2], vertical: [38, 48], broad: [185, 210], strength: [18, 30], endurance: [5.0, 4.3] },
    "22-25": { sprint: [3.4, 3.1], vertical: [40, 50], broad: [190, 215], strength: [20, 35], endurance: [4.8, 4.1] },
    "26-30": { sprint: [3.5, 3.2], vertical: [38, 48], broad: [185, 205], strength: [18, 30], endurance: [5.0, 4.3] },
  },
  male: {
    "12-13": { sprint: [3.7, 3.4], vertical: [32, 40], broad: [160, 180], strength: [10, 20], endurance: [5.8, 4.9] },
    "14-15": { sprint: [3.5, 3.2], vertical: [38, 48], broad: [180, 205], strength: [15, 30], endurance: [5.3, 4.6] },
    "16-17": { sprint: [3.4, 3.1], vertical: [45, 55], broad: [200, 225], strength: [20, 40], endurance: [5.0, 4.3] },
    "18-21": { sprint: [3.3, 3.0], vertical: [48, 58], broad: [210, 235], strength: [25, 45], endurance: [4.67, 4.0] },
    "22-25": { sprint: [3.2, 2.9], vertical: [50, 60], broad: [215, 245], strength: [30, 50], endurance: [4.5, 3.92] },
    "26-30": { sprint: [3.3, 3.0], vertical: [48, 58], broad: [210, 235], strength: [25, 45], endurance: [4.67, 4.08] },
  },
};

// ============================================
// SCORING HELPERS
// ============================================
export function scoreTest(value: number, amber: number, green: number, reverse = false): 1 | 2 | 3 {
  if (reverse) {
    if (value <= green) return 3;
    if (value <= amber) return 2;
    return 1;
  } else {
    if (value >= green) return 3;
    if (value >= amber) return 2;
    return 1;
  }
}

export function statusLabel(score: number): "green" | "amber" | "red" {
  return score === 3 ? "green" : score === 2 ? "amber" : "red";
}

export function approxPercentile(score: number): string {
  return score === 3 ? "\u224880th+" : score === 2 ? "\u224850\u201360th" : "\u2248<30th";
}

// ============================================
// TIME PARSING
// ============================================
export function parseTimeToMinutes(input: string): number {
  const v = input.trim();
  if (!v) return NaN;

  // mm:ss format
  if (v.includes(":")) {
    const [m, s] = v.split(":").map((x) => x.trim());
    const mm = parseInt(m, 10);
    const ss = parseInt(s, 10);
    if (Number.isNaN(mm) || Number.isNaN(ss) || ss < 0 || ss >= 60) return NaN;
    return mm + ss / 60;
  }

  // mm.ss format (seconds after dot)
  const match = v.match(/^(\d+)\.(\d{1,2})$/);
  if (match) {
    const mm = parseInt(match[1], 10);
    const ss = parseInt(match[2], 10);
    if (Number.isNaN(mm) || Number.isNaN(ss) || ss < 0 || ss >= 60) return NaN;
    return mm + ss / 60;
  }

  // Plain number = treat as minutes
  if (/^\d+$/.test(v)) {
    return parseInt(v, 10);
  }

  return NaN;
}

export function formatMinutesToMMSS(mins: number): string {
  const totalSeconds = Math.round(mins * 60);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

// ============================================
// FULL SCORE CALCULATION
// ============================================
export interface RawInputs {
  sprintVal: number;
  verticalVal: number;
  broadVal: number;
  strengthVal: number;
  enduranceVal: number;
}

export interface ScoreResult {
  scores: (1 | 2 | 3)[];
  raw: RawInputs;
}

export function calculateScores(
  gender: Gender,
  ageGroup: AgeGroup,
  raw: RawInputs
): ScoreResult {
  const data = benchmarks[gender][ageGroup];

  const scores: (1 | 2 | 3)[] = [
    scoreTest(raw.sprintVal, data.sprint[0], data.sprint[1], true),
    scoreTest(raw.verticalVal, data.vertical[0], data.vertical[1]),
    scoreTest(raw.broadVal, data.broad[0], data.broad[1]),
    scoreTest(raw.strengthVal, data.strength[0], data.strength[1]),
    scoreTest(raw.enduranceVal, data.endurance[0], data.endurance[1], true),
  ];

  return { scores, raw };
}

// ============================================
// TRAINING RECOMMENDATIONS
// ============================================
export interface TrainingArea {
  key: "sprint" | "power" | "strength" | "endurance";
  name: string;
  tips: string[];
}

export const trainingAreas: TrainingArea[] = [
  {
    key: "sprint",
    name: "Speed (20m acceleration)",
    tips: [
      "2 sessions/week: 6-10 x 10-30m sprints",
      "Full rest 60-120s",
      "Focus: fast first steps + tall posture",
    ],
  },
  {
    key: "power",
    name: "Vertical Power",
    tips: [
      "2 sessions/week: pogo hops + jump variations",
      "Low reps, high quality",
      "Controlled landings every rep",
    ],
  },
  {
    key: "power",
    name: "Horizontal Power",
    tips: [
      "2 sessions/week: broad jumps + bounds",
      "Stick landings, control knees/hips",
      "Progress distance gradually",
    ],
  },
  {
    key: "strength",
    name: "Strength (push-ups)",
    tips: [
      "2-3 sessions/week: push-up progression",
      "Add trunk stability (planks/deadbugs)",
      "Aim +2-5 reps over 6 weeks",
    ],
  },
  {
    key: "endurance",
    name: "Endurance (1km)",
    tips: [
      "1 easy run + 1 interval day/week",
      "Example: 6 x 200m fast / 200m easy",
      "Keep easy days easy",
    ],
  },
];

export const testLabels = ["20m Sprint", "Vertical Jump", "Broad Jump", "Push-Ups", "1km Endurance"];
export const chartLabels = ["Sprint", "Vertical", "Broad", "Strength", "Endurance"];

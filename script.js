let chartInstance = null;
let baselineScores = null;
let baselineRaw = null;

/* =========================
   SPORT PRIORITIES
========================= */
const sportProfiles = {
  Football: { sprint: 3, power: 3, strength: 2, endurance: 2 },
  Rugby: { sprint: 2, power: 3, strength: 3, endurance: 2 },
  Athletics: { sprint: 3, power: 3, strength: 2, endurance: 1 },
  Basketball: { sprint: 3, power: 3, strength: 2, endurance: 2 },
  Hockey: { sprint: 3, power: 2, strength: 2, endurance: 3 },
  "American Football": { sprint: 3, power: 3, strength: 3, endurance: 1 },
  Other: { sprint: 2, power: 2, strength: 2, endurance: 2 }
};

/* =========================
   BENCHMARKS (UNITS FIXED)
   sprint seconds (lower better) [amber, green]
   vertical cm (higher better)
   broad cm (higher better)
   strength reps (higher better)
   endurance minutes (lower better)
========================= */
const benchmarks = {
  female: {
    "12-13": { sprint:[3.9, 3.6], vertical:[28, 35], broad:[150, 170], strength:[8, 15],  endurance:[6.0, 5.0] },
    "14-15": { sprint:[3.7, 3.4], vertical:[32, 40], broad:[165, 185], strength:[12, 20], endurance:[5.5, 4.7] },
    "16-17": { sprint:[3.6, 3.3], vertical:[36, 45], broad:[180, 200], strength:[15, 25], endurance:[5.2, 4.5] },
    "18-21": { sprint:[3.5, 3.2], vertical:[38, 48], broad:[185, 210], strength:[18, 30], endurance:[5.0, 4.3] },
    "22-25": { sprint:[3.4, 3.1], vertical:[40, 50], broad:[190, 215], strength:[20, 35], endurance:[4.8, 4.1] },
    "26-30": { sprint:[3.5, 3.2], vertical:[38, 48], broad:[185, 205], strength:[18, 30], endurance:[5.0, 4.3] }
  },
  male: {
    "12-13": { sprint:[3.7, 3.4], vertical:[32, 40], broad:[160, 180], strength:[10, 20], endurance:[5.8, 4.9] },
    "14-15": { sprint:[3.5, 3.2], vertical:[38, 48], broad:[180, 205], strength:[15, 30], endurance:[5.3, 4.6] },
    "16-17": { sprint:[3.4, 3.1], vertical:[45, 55], broad:[200, 225], strength:[20, 40], endurance:[5.0, 4.3] },
    "18-21": { sprint:[3.3, 3.0], vertical:[48, 58], broad:[210, 235], strength:[25, 45], endurance:[4.67, 4.00] }, // 4:40 / 4:00
    "22-25": { sprint:[3.2, 2.9], vertical:[50, 60], broad:[215, 245], strength:[30, 50], endurance:[4.50, 3.92] }, // 4:30 / 3:55
    "26-30": { sprint:[3.3, 3.0], vertical:[48, 58], broad:[210, 235], strength:[25, 45], endurance:[4.67, 4.08] }  // 4:40 / 4:05
  }
};

/* =========================
   HELPERS
========================= */
function scoreTest(value, amber, green, reverse = false) {
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

function statusLabel(score) {
  return score === 3 ? "green" : score === 2 ? "amber" : "red";
}

function approxPercentile(score) {
  return score === 3 ? "≈80th+" : score === 2 ? "≈50–60th" : "≈<30th";
}

// Preferred endurance input: mm.ss (3.56 = 3m56s). Also accepts mm:ss.
function parseTimeToMinutes(input) {
  const v = String(input).trim();
  if (!v) return NaN;

  // Backup: mm:ss
  if (v.includes(":")) {
    const [m, s] = v.split(":").map(x => x.trim());
    const mm = parseInt(m, 10);
    const ss = parseInt(s, 10);
    if (Number.isNaN(mm) || Number.isNaN(ss) || ss < 0 || ss >= 60) return NaN;
    return mm + ss / 60;
  }

  // Preferred: mm.ss (seconds after dot)
  const match = v.match(/^(\d+)\.(\d{1,2})$/);
  if (match) {
    const mm = parseInt(match[1], 10);
    let ss = parseInt(match[2], 10);
    if (Number.isNaN(mm) || Number.isNaN(ss)) return NaN;
    if (ss < 0 || ss >= 60) return NaN;
    return mm + ss / 60;
  }

  // If they type "4" treat as 4:00
  if (/^\d+$/.test(v)) {
    return parseInt(v, 10);
  }

  return NaN;
}

function formatMinutesToMMSS(mins) {
  const totalSeconds = Math.round(mins * 60);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function nowDateString() {
  return new Date().toLocaleString();
}

/* =========================
   INPUTS + SCORE CALC
========================= */
function getInputs() {
  const sprintVal = parseFloat(document.getElementById("sprint").value);
  const verticalVal = parseFloat(document.getElementById("vertical").value);
  const broadVal = parseFloat(document.getElementById("broad").value);
  const strengthVal = parseFloat(document.getElementById("strength").value);
  const enduranceVal = parseTimeToMinutes(document.getElementById("endurance").value);

  if ([sprintVal, verticalVal, broadVal, strengthVal, enduranceVal].some(v => Number.isNaN(v))) {
    throw new Error("Please complete all fields. 1km must be mm.ss (e.g. 3.56) or mm:ss (e.g. 3:56).");
  }
  return { sprintVal, verticalVal, broadVal, strengthVal, enduranceVal };
}

function calculateScores() {
  const gender = document.getElementById("gender").value;
  const age = document.getElementById("ageGroup").value;
  const data = benchmarks?.[gender]?.[age];
  if (!data) throw new Error("Benchmark data missing for this selection.");

  const raw = getInputs();

  const scores = [
    scoreTest(raw.sprintVal, data.sprint[0], data.sprint[1], true),
    scoreTest(raw.verticalVal, data.vertical[0], data.vertical[1]),
    scoreTest(raw.broadVal, data.broad[0], data.broad[1]),
    scoreTest(raw.strengthVal, data.strength[0], data.strength[1]),
    scoreTest(raw.enduranceVal, data.endurance[0], data.endurance[1], true)
  ];

  return { scores, raw };
}

/* =========================
   ACTIONS
========================= */
function runBaseline() {
  try {
    const { scores, raw } = calculateScores();
    baselineScores = scores;
    baselineRaw = raw;
    document.getElementById("retestBtn").disabled = false;

    renderPDFHeader(false);
    renderResults(scores);
    drawChart(scores, false);
    renderMeasurementComparison(raw);
    renderBreakdown(scores);

  } catch (err) {
    alert(err.message);
  }
}

function runRetest() {
  try {
    if (!baselineScores) {
      alert("Run a Baseline Test first.");
      return;
    }

    const { scores, raw } = calculateScores();

    renderPDFHeader(true);
    renderResults(scores);
    drawChart(scores, true);
    renderMeasurementComparison(raw);
    renderBreakdown(scores);

  } catch (err) {
    alert(err.message);
  }
}

function resetNewAthlete() {
  baselineScores = null;
  baselineRaw = null;
  document.getElementById("retestBtn").disabled = true;

  ["athleteName","sprint","vertical","broad","strength","endurance"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });

  document.getElementById("pdfHeader").innerHTML = "";
  document.getElementById("results").innerHTML = "";
  document.getElementById("measurementCompare").innerHTML = "";
  document.getElementById("recommendations").innerHTML = "";

  if (chartInstance) chartInstance.destroy();
}

/* =========================
   PDF HEADER
========================= */
function renderPDFHeader(isRetest) {
  const name = (document.getElementById("athleteName").value || "Athlete").trim();
  const age = document.getElementById("ageGroup").value;
  const gender = document.getElementById("gender").value;
  const sport = document.getElementById("sport").value;

  document.getElementById("pdfHeader").innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;">
      <div>
        <h2 style="margin:0;">Plyo Lab – Performance Report</h2>
        <p style="margin:4px 0 0 0;"><strong>${name}</strong> • ${gender} • Age ${age} • ${sport}</p>
        <p style="margin:4px 0 0 0;color:#555;">${isRetest ? "Retest Report" : "Baseline Report"} • ${nowDateString()}</p>
      </div>
      <div style="text-align:right;font-size:12px;color:#666;max-width:260px;">
        Field-based benchmarks for development tracking.<br>
        Retest after training to measure progress.
      </div>
    </div>
    <hr>
  `;
}

/* =========================
   RESULTS UI
========================= */
function renderResults(scores) {
  const labels = ["20m Sprint", "Vertical Jump", "Broad Jump", "Push-Ups", "1km Endurance"];

  let html = `<h3>Results</h3>`;
  scores.forEach((s, i) => {
    const c = statusLabel(s);
    html += `
      <div class="result-row">
        <span class="status">
          <span class="dot ${c}"></span>
          ${labels[i]}: ${c.toUpperCase()}
          <span style="font-weight:400;color:#666;">(${approxPercentile(s)})</span>
        </span>
      </div>
    `;
  });

  const greens = scores.filter(x => x === 3).length;
  const ambers = scores.filter(x => x === 2).length;
  const reds = scores.filter(x => x === 1).length;

  html += `<p style="margin-top:10px;"><strong>Summary:</strong> ${greens} green, ${ambers} amber, ${reds} red.</p>`;
  document.getElementById("results").innerHTML = html;
}

/* =========================
   CHART
========================= */
function drawChart(scores, isRetest) {
  const canvas = document.getElementById("performanceChart");
  const ctx = canvas.getContext("2d");

  if (chartInstance) chartInstance.destroy();

  const datasets = [
    {
      label: isRetest ? "Retest" : "Baseline",
      data: scores,
      backgroundColor: scores.map(v => (v === 3 ? "#2ecc71" : v === 2 ? "#f39c12" : "#e74c3c"))
    },
    {
      label: "Age Standard",
      data: [2, 2, 2, 2, 2],
      backgroundColor: "#cccccc"
    }
  ];

  if (isRetest && baselineScores) {
    datasets.push({
      label: "Baseline (saved)",
      data: baselineScores,
      backgroundColor: "#3498db"
    });
  }

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Sprint", "Vertical", "Broad", "Strength", "Endurance"],
      datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: 0,
          max: 3,
          ticks: {
            stepSize: 1,
            callback: v => ["", "Developing", "Age Standard", "High Performance"][v] || ""
          }
        }
      }
    }
  });
}

/* =========================
   MEASUREMENT VS AGE STANDARD TABLE
========================= */
function renderMeasurementComparison(raw) {
  const age = document.getElementById("ageGroup").value;
  const gender = document.getElementById("gender").value;
  const data = benchmarks[gender][age];

  const rows = [
    { label: "20m Sprint", unit: "s", athlete: raw.sprintVal, standard: data.sprint[0], better: "lower" },
    { label: "Vertical Jump", unit: "cm", athlete: raw.verticalVal, standard: data.vertical[0], better: "higher" },
    { label: "Broad Jump", unit: "cm", athlete: raw.broadVal, standard: data.broad[0], better: "higher" },
    { label: "Push-Ups", unit: "reps", athlete: raw.strengthVal, standard: data.strength[0], better: "higher" },
    { label: "1km Run", unit: "mm:ss", athlete: raw.enduranceVal, standard: data.endurance[0], better: "lower", format: "time" }
  ];

  const body = rows.map(r => {
    const diff = r.better === "higher" ? (r.athlete - r.standard) : (r.standard - r.athlete);

    const athleteText = r.format === "time"
      ? formatMinutesToMMSS(r.athlete)
      : (r.unit === "s" ? r.athlete.toFixed(2) : Math.round(r.athlete));

    const standardText = r.format === "time"
      ? formatMinutesToMMSS(r.standard)
      : (r.unit === "s" ? r.standard.toFixed(2) : Math.round(r.standard));

    const diffText = r.format === "time"
      ? `${diff >= 0 ? "+" : "-"}${formatMinutesToMMSS(Math.abs(diff))}`
      : `${diff >= 0 ? "+" : "-"}${Math.abs(diff).toFixed(r.unit === "s" ? 2 : 0)} ${r.unit}`;

    const status = diff >= 0 ? "green" : "red";

    return `
      <tr>
        <td>${r.label}</td>
        <td style="text-align:right;">${athleteText}</td>
        <td style="text-align:right;">${standardText}</td>
        <td style="text-align:right;"><span class="status"><span class="dot ${status}"></span>${diffText}</span></td>
      </tr>
    `;
  }).join("");

  document.getElementById("measurementCompare").innerHTML = `
    <h3 style="margin:0 0 8px 0;">Measurement vs Age Standard</h3>
    <table>
      <thead>
        <tr>
          <th style="text-align:left;">Test</th>
          <th style="text-align:right;">You</th>
          <th style="text-align:right;">Age Standard</th>
          <th style="text-align:right;">Difference</th>
        </tr>
      </thead>
      <tbody>${body}</tbody>
    </table>
    <p style="margin-top:8px;color:#555;font-size:12px;">
      Difference shows how far above/below the age standard you are for each test.
    </p>
  `;
}

/* =========================
   ATHLETE-FRIENDLY BREAKDOWN (TOP 2)
========================= */
function renderBreakdown(scores) {
  const sport = document.getElementById("sport").value;
  const profile = sportProfiles[sport] || sportProfiles.Other;

  const areas = [
    { key: "sprint", name: "Speed (20m acceleration)", tips: ["2 sessions/week: 6–10 x 10–30m sprints", "Full rest 60–120s", "Focus: fast first steps + tall posture"] },
    { key: "power", name: "Vertical Power", tips: ["2 sessions/week: pogo hops + jump variations", "Low reps, high quality", "Controlled landings every rep"] },
    { key: "power", name: "Horizontal Power", tips: ["2 sessions/week: broad jumps + bounds", "Stick landings, control knees/hips", "Progress distance gradually"] },
    { key: "strength", name: "Strength (push-ups)", tips: ["2–3 sessions/week: push-up progression", "Add trunk stability (planks/deadbugs)", "Aim +2–5 reps over 6 weeks"] },
    { key: "endurance", name: "Endurance (1km)", tips: ["1 easy run + 1 interval day/week", "Example: 6 x 200m fast / 200m easy", "Keep easy days easy"] }
  ];

  const ranked = scores
    .map((s, i) => ({ s, i, priority: profile[areas[i].key] || 2 }))
    .sort((a, b) => a.s - b.s || b.priority - a.priority);

  const primary = ranked[0];
  const secondary = ranked[1];

  const strengths = scores
    .map((s, i) => (s === 3 ? `• ${areas[i].name}` : null))
    .filter(Boolean);

  document.getElementById("recommendations").innerHTML = `
    <h3>Performance Breakdown & Training Plan</h3>

    <h4>Your Strengths</h4>
    <p>${strengths.length ? strengths.join("<br>") : "• No clear GREEN strengths yet — build consistency and retest."}</p>

    <h4>Primary Focus (Next 4–6 Weeks)</h4>
    <p><strong>${areas[primary.i].name}</strong><br>
    This is the biggest opportunity right now. Improving this will have the biggest impact.</p>
    <ul>${areas[primary.i].tips.map(t => `<li>${t}</li>`).join("")}</ul>

    <h4>Secondary Focus</h4>
    <p><strong>${areas[secondary.i].name}</strong><br>
    Improving this will support your primary focus.</p>
    <ul>${areas[secondary.i].tips.map(t => `<li>${t}</li>`).join("")}</ul>

    <p style="margin-top:10px;"><strong>If you only do ONE thing:</strong> train your primary focus twice per week for 6 weeks, then retest.</p>
  `;
}

/* =========================
   PDF EXPORT (multi-page)
========================= */
function exportPDF() {
  if (!window.html2canvas) return alert("html2canvas not loaded. Check external scripts order.");
  if (!window.jspdf || !window.jspdf.jsPDF) return alert("jsPDF not loaded. Check external scripts order.");

  const { jsPDF } = window.jspdf;

  setTimeout(() => {
    html2canvas(document.getElementById("pdfContent"), { scale: 2 }).then(canvas => {
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
    });
  }, 150);
}

// ==============================|| HIKE CALCULATOR (pure) ||============================== //

// Formulas confirmed against https://razorpay.com/x/salary-hike-calculator/:
//   New CTC = Current CTC × (1 + Hike% / 100)
//   Hike % = (New CTC − Current CTC) / Current CTC × 100

const SCENARIO_STEP = 10;
const PROJECTION_YEARS = 3;

export function newCtcFromHike(currentCtc: number, hikePercent: number): number {
  return currentCtc * (1 + hikePercent / 100);
}

export function hikePercentFromNewCtc(currentCtc: number, newCtc: number): number {
  return ((newCtc - currentCtc) / currentCtc) * 100;
}

export interface ScenarioRow {
  percent: number;
  newCtc: number;
}

// Rounds a percent to the nearest 10, e.g. 6 -> 10, 12 -> 10, 16 -> 20, -3 -> 0 (`|| 0` avoids a stray -0).
// Keeps the chart's flanking scenarios on clean round numbers even when the effective percent isn't one.
function roundToStep(percent: number): number {
  return Math.round(percent / SCENARIO_STEP) * SCENARIO_STEP || 0;
}

export function scenarioRows(currentCtc: number, effectivePercent: number): ScenarioRow[] {
  const percents = [roundToStep(effectivePercent - SCENARIO_STEP), effectivePercent, roundToStep(effectivePercent + SCENARIO_STEP)];
  return percents.map((percent) => ({
    percent,
    newCtc: newCtcFromHike(currentCtc, percent)
  }));
}

export interface ProjectionRow {
  year: number;
  ctc: number;
}

export function projectionRows(currentCtc: number, effectivePercent: number): ProjectionRow[] {
  const rows: ProjectionRow[] = [{ year: 0, ctc: currentCtc }];
  for (let year = 1; year <= PROJECTION_YEARS; year++) {
    rows.push({ year, ctc: newCtcFromHike(rows[year - 1].ctc, effectivePercent) });
  }
  return rows;
}

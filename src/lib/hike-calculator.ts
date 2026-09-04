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

export function scenarioRows(currentCtc: number, effectivePercent: number): ScenarioRow[] {
  return [effectivePercent - SCENARIO_STEP, effectivePercent, effectivePercent + SCENARIO_STEP].map((percent) => ({
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

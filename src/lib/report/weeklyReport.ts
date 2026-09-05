import type { AppData, HistoryEntry, LandingPageItem, Product, ResearchItem, Stage } from "@/lib/types";
import { isWithinWeek, type ReportWeek } from "@/lib/utils/date";
import { countsByStage, type StageCounts } from "@/lib/selectors";
import { STAGE_ORDER } from "@/lib/constants";

export interface StageActivityEntry {
  product: Product;
  events: HistoryEntry[];
}

export interface WeeklyReportData {
  week: ReportWeek;
  generatedAt: string;
  createdThisWeek: Product[];
  completedThisWeek: Product[];
  pendingNow: Product[];
  stageCountsNow: StageCounts;
  stageActivity: Record<Stage, StageActivityEntry[]>;
  researchActivity: ResearchItem[];
  landingActivity: LandingPageItem[];
  peopleActivityCount: Record<string, number>;
}

function hasActivityInWeek(history: HistoryEntry[], week: ReportWeek): HistoryEntry[] {
  return history.filter((h) => isWithinWeek(h.timestamp, week));
}

function currentStagePersonId(product: Product): string | null {
  if (product.stage === "VIDEO_EDITING") return product.videoEditingPersonId;
  if (product.stage === "TESTING" || product.stage === "FINISHED") return product.testingPersonId;
  return product.designPersonId;
}

export function buildWeeklyReport(data: AppData, week: ReportWeek): WeeklyReportData {
  const createdThisWeek = data.products.filter((p) => isWithinWeek(p.createdAt, week));
  const completedThisWeek = data.products.filter((p) => isWithinWeek(p.completedAt, week));
  const pendingNow = data.products.filter((p) => p.stage !== "FINISHED");

  const stageActivity: Record<Stage, StageActivityEntry[]> = { DESIGN: [], VIDEO_EDITING: [], TESTING: [], FINISHED: [] };
  for (const stage of STAGE_ORDER) {
    for (const p of data.products.filter((prod) => prod.stage === stage)) {
      const events = hasActivityInWeek(p.history, week);
      if (events.length > 0) stageActivity[stage].push({ product: p, events });
    }
  }

  const researchActivity = data.research.filter(
    (r) => isWithinWeek(r.foundAt, week) || hasActivityInWeek(r.history, week).length > 0
  );
  const landingActivity = data.landingPage.filter(
    (l) => isWithinWeek(l.createdAt, week) || hasActivityInWeek(l.history, week).length > 0
  );

  const peopleActivityCount: Record<string, number> = {};
  const touch = (id: string | null | undefined) => {
    if (!id) return;
    peopleActivityCount[id] = (peopleActivityCount[id] ?? 0) + 1;
  };
  for (const stage of STAGE_ORDER) stageActivity[stage].forEach((e) => touch(currentStagePersonId(e.product)));
  researchActivity.forEach((r) => touch(r.foundByPersonId));
  landingActivity.forEach((l) => touch(l.assignedPersonId));

  return {
    week,
    generatedAt: new Date().toISOString(),
    createdThisWeek,
    completedThisWeek,
    pendingNow,
    stageCountsNow: countsByStage(data.products),
    stageActivity,
    researchActivity,
    landingActivity,
    peopleActivityCount,
  };
}

"use client";

import { useMemo, useState } from "react";
import { FileDown } from "lucide-react";
import { useData } from "@/lib/data/DataProvider";
import { getPreviousReportWeeks, formatWeekLabel } from "@/lib/utils/date";
import { buildWeeklyReport } from "@/lib/report/weeklyReport";
import { generateWeeklyReportPdf } from "@/lib/report/pdf";
import { Button } from "@/components/ui/Button";
import { Card, SectionHeader } from "@/components/ui/Card";
import { StatTile } from "@/components/ui/StatTile";
import { STAGE_META } from "@/lib/constants";

const ACTIVE_STAGES = ["DESIGN", "VIDEO_EDITING", "TESTING"] as const;

export function WeeklyReport() {
  const { data } = useData();
  const weeks = useMemo(() => getPreviousReportWeeks(12), []);
  const [weekIndex, setWeekIndex] = useState(0);

  const week = weeks[weekIndex];
  const report = useMemo(() => buildWeeklyReport(data, week), [data, week]);

  return (
    <div className="space-y-5">
      <Card>
        <SectionHeader title="Weekly Report" subtitle="Saturday to Saturday period" />
        <label className="block text-xs font-medium text-text-secondary mb-1.5">Select week</label>
        <select
          className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text-primary outline-none focus:ring-2 focus:ring-brand/30 mb-4"
          value={weekIndex}
          onChange={(e) => setWeekIndex(Number(e.target.value))}
        >
          {weeks.map((w, i) => (
            <option key={i} value={i}>
              {formatWeekLabel(w)} {i === 0 ? "(current week)" : ""}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <StatTile label="Created" value={report.createdThisWeek.length} />
          <StatTile label="Completed" value={report.completedThisWeek.length} tone="green" />
          <StatTile label="Pending Now" value={report.pendingNow.length} tone="orange" />
          <StatTile
            label="Overdue Now"
            value={report.pendingNow.filter((p) => p.deadline && new Date(p.deadline) < new Date()).length}
            tone="red"
          />
        </div>

        <div className="grid grid-cols-3 gap-2 mb-5">
          {ACTIVE_STAGES.map((s) => (
            <div key={s} className="rounded-lg border border-border px-3 py-2.5 text-center">
              <p className={`text-xs font-semibold ${STAGE_META[s].text}`}>{STAGE_META[s].label}</p>
              <p className="text-lg font-bold text-text-primary mt-0.5">{report.stageActivity[s].length}</p>
              <p className="text-[10px] text-text-muted">items touched</p>
            </div>
          ))}
        </div>

        <Button className="w-full" onClick={() => generateWeeklyReportPdf(data, report)}>
          <FileDown size={16} /> Export Weekly Report
        </Button>
      </Card>
    </div>
  );
}

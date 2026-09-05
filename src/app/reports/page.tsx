import { WeeklyReport } from "@/components/reports/WeeklyReport";

export default function ReportsPage() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-medium text-text-muted">Reports</p>
        <h1 className="text-xl font-bold text-text-primary tracking-tight mt-0.5">Weekly Export</h1>
      </div>
      <WeeklyReport />
    </div>
  );
}

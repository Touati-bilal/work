import { AlertOctagon } from "lucide-react";
import { daysLate, isOverdue } from "@/lib/utils/date";

export function OverdueTag({ deadline, completedAt }: { deadline?: string; completedAt?: string }) {
  if (!isOverdue(deadline, completedAt)) return null;
  const days = daysLate(deadline);
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-rose-300 bg-rose-600 px-2 py-0.5 text-[11px] font-semibold text-white dark:border-rose-500/40">
      <AlertOctagon size={12} strokeWidth={2.4} />
      Overdue {days > 0 ? `· ${days}d late` : ""}
    </span>
  );
}

import type { LucideIcon } from "lucide-react";

export function StatTile({
  label,
  value,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: number | string;
  icon?: LucideIcon;
  tone?: "default" | "red" | "orange" | "blue" | "gray" | "green";
}) {
  const toneClasses: Record<string, string> = {
    default: "text-text-primary",
    red: "text-rose-600 dark:text-rose-400",
    orange: "text-amber-600 dark:text-amber-400",
    blue: "text-blue-600 dark:text-blue-400",
    gray: "text-slate-500",
    green: "text-emerald-600 dark:text-emerald-400",
  };

  return (
    <div className="card-surface rounded-2xl p-3.5 flex flex-col gap-2 min-w-0">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wide text-text-muted truncate">{label}</span>
        {Icon && <Icon size={14} className="text-text-muted shrink-0" />}
      </div>
      <span className={`text-2xl font-bold tabular-nums ${toneClasses[tone]}`}>{value}</span>
    </div>
  );
}

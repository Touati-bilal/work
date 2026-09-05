import { AlertTriangle, CircleDot, Loader2, PauseCircle, CheckCircle2 } from "lucide-react";
import type { Status } from "@/lib/types";
import { STATUS_META } from "@/lib/constants";

const ICONS: Record<Status, typeof AlertTriangle> = {
  NEED_REVISION: AlertTriangle,
  ZU_ERLEDIGEN: CircleDot,
  IN_BEARBEITUNG: Loader2,
  WAITING: PauseCircle,
  VOLLSTANDIG: CheckCircle2,
};

export function StatusBadge({
  status,
  size = "md",
  showLabel = true,
}: {
  status: Status;
  size?: "sm" | "md";
  showLabel?: boolean;
}) {
  const meta = STATUS_META[status];
  const Icon = ICONS[status];
  const iconSize = size === "sm" ? 12 : 14;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${meta.classes} ${
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"
      }`}
    >
      <Icon size={iconSize} strokeWidth={2.4} />
      {showLabel && meta.label}
    </span>
  );
}

export function StatusDot({ status }: { status: Status }) {
  const meta = STATUS_META[status];
  return <span className={`inline-block h-2 w-2 rounded-full ${meta.dot}`} aria-hidden />;
}

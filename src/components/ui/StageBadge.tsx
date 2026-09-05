import { PenTool, Clapperboard, FlaskConical, CheckCircle2 } from "lucide-react";
import type { ItemType, Stage } from "@/lib/types";
import { STAGE_META, ITEM_TYPE_META } from "@/lib/constants";

export const STAGE_ICONS: Record<Stage, typeof PenTool> = {
  DESIGN: PenTool,
  VIDEO_EDITING: Clapperboard,
  TESTING: FlaskConical,
  FINISHED: CheckCircle2,
};
const ICONS = STAGE_ICONS;

export function StageBadge({ stage, size = "md", showLabel = true }: { stage: Stage; size?: "sm" | "md"; showLabel?: boolean }) {
  const meta = STAGE_META[stage];
  const Icon = ICONS[stage];
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

export function StageDot({ stage }: { stage: Stage }) {
  return <span className={`inline-block h-2 w-2 rounded-full ${STAGE_META[stage].dot}`} aria-hidden />;
}

export function ItemTypeBadge({ itemType, size = "md" }: { itemType: ItemType; size?: "sm" | "md" }) {
  const meta = ITEM_TYPE_META[itemType];
  return (
    <span
      title={meta.description}
      className={`inline-flex items-center rounded-full border font-medium ${meta.classes} ${
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]"
      }`}
    >
      {meta.label}
    </span>
  );
}

import type { StageCounts } from "@/lib/selectors";

// Same hues as STAGE_META (fuchsia/indigo/cyan) — kept in sync intentionally.
const RING_COLORS = {
  DESIGN: "#d946ef",
  VIDEO_EDITING: "#6366f1",
  TESTING: "#06b6d4",
} as const;

const TRACK_COLOR = "var(--border)";

/** Conic-gradient composition ring of active (non-Finished) items by stage. */
export function activeStageRingGradient(counts: StageCounts): string {
  const segments: Array<{ key: keyof typeof RING_COLORS; value: number }> = [
    { key: "DESIGN", value: counts.DESIGN },
    { key: "VIDEO_EDITING", value: counts.VIDEO_EDITING },
    { key: "TESTING", value: counts.TESTING },
  ];
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  if (total === 0) return `conic-gradient(${TRACK_COLOR} 0deg 360deg)`;

  let acc = 0;
  const stops = segments
    .filter((s) => s.value > 0)
    .map((s) => {
      const start = (acc / total) * 360;
      acc += s.value;
      const end = (acc / total) * 360;
      return `${RING_COLORS[s.key]} ${start}deg ${end}deg`;
    });
  return `conic-gradient(${stops.join(", ")})`;
}

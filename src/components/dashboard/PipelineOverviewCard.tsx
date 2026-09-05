import Link from "next/link";
import { STAGE_META } from "@/lib/constants";
import type { StageCounts } from "@/lib/selectors";
import { activeStageRingGradient } from "@/lib/utils/ring";

export function PipelineOverviewCard({ counts }: { counts: StageCounts }) {
  const active = counts.DESIGN + counts.VIDEO_EDITING + counts.TESTING;

  return (
    <div className="card-surface fade-slide-up rounded-2xl p-4 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div
          className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full transition-[background-image] duration-700 ease-out"
          style={{ backgroundImage: activeStageRingGradient(counts) }}
        >
          <div className="flex h-12 w-12 flex-col items-center justify-center rounded-full bg-surface shadow-sm">
            <span className="text-base font-bold text-text-primary tabular-nums leading-none">{active}</span>
            <span className="text-[9px] text-text-muted leading-none mt-0.5">active</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <span className="text-sm font-semibold text-text-primary">Pipeline Situation</span>
          <p className="text-xs text-text-muted mt-1">{counts.FINISHED} finished all-time</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 text-center border-t border-border pt-3">
        <StageStat stage="DESIGN" value={counts.DESIGN} />
        <StageStat stage="VIDEO_EDITING" value={counts.VIDEO_EDITING} />
        <StageStat stage="TESTING" value={counts.TESTING} />
        <StageStat stage="FINISHED" value={counts.FINISHED} />
      </div>
    </div>
  );
}

function StageStat({ stage, value }: { stage: keyof typeof STAGE_META; value: number }) {
  const meta = STAGE_META[stage];
  return (
    <Link
      href={`/manager?stage=${stage}`}
      className="flex flex-col items-center rounded-lg py-1 transition-all duration-150 hover:bg-surface-2 active:scale-95"
    >
      <span className={`text-lg font-bold tabular-nums ${meta.text}`}>{value}</span>
      <span className="text-[10px] text-text-muted mt-0.5">{meta.label.split(" ")[0]}</span>
    </Link>
  );
}

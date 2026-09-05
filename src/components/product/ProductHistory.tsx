"use client";

import type { HistoryEntry } from "@/lib/types";
import { formatDateTime } from "@/lib/utils/date";
import { StageDot } from "@/components/ui/StageBadge";
import { HISTORY_KIND_META } from "@/lib/constants";
import { personById } from "@/lib/selectors";
import { useData } from "@/lib/data/DataProvider";

export function ProductHistory({ history }: { history: HistoryEntry[] }) {
  const { data } = useData();
  const sorted = [...history].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return (
    <div>
      {sorted.map((entry, i) => {
        const kind = entry.kind && entry.kind !== "SYSTEM" ? entry.kind : undefined;
        const author = personById(data, entry.authorPersonId);
        return (
          <div key={entry.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className="mt-1.5 flex h-2.5 w-2.5 items-center justify-center shrink-0">
                {entry.stage ? (
                  <StageDot stage={entry.stage} />
                ) : (
                  <span className={`h-2 w-2 rounded-full ${kind ? HISTORY_KIND_META[kind].classes : "bg-text-muted"}`} />
                )}
              </span>
              {i < sorted.length - 1 && <span className="w-px flex-1 bg-border mt-1" />}
            </div>
            <div className={i < sorted.length - 1 ? "pb-5" : ""}>
              <div className="flex items-center gap-1.5 flex-wrap">
                {kind && (
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                    {HISTORY_KIND_META[kind].label}
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-text-primary whitespace-pre-wrap">{entry.label}</p>
              <p className="text-xs text-text-muted mt-0.5">
                {formatDateTime(entry.timestamp)}
                {author && ` · ${author.handle}`}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

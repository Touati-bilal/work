"use client";

import { useState } from "react";
import type { LandingPageItem } from "@/lib/types";
import { useData } from "@/lib/data/DataProvider";
import { personById } from "@/lib/selectors";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PriorityBadge } from "@/components/ui/CategoryBadge";
import { PersonChip } from "@/components/ui/PersonAvatar";
import { OverdueTag } from "@/components/ui/OverdueTag";
import { formatDate } from "@/lib/utils/date";
import { Sheet } from "@/components/ui/Sheet";
import { LandingPageForm } from "@/components/work/LandingPageForm";
import { EmptyState } from "@/components/ui/EmptyState";
import { Calendar, Rocket } from "lucide-react";

export function LandingPageList({ items }: { items: LandingPageItem[] }) {
  const { data } = useData();
  const [editing, setEditing] = useState<LandingPageItem | null>(null);

  if (items.length === 0) {
    return <EmptyState icon={Rocket} title="No landing page tasks" description="Create a task to track landing page work." />;
  }

  return (
    <div className="grid gap-2.5 md:grid-cols-2">
      {items.map((item) => {
        const person = personById(data, item.assignedPersonId);
        return (
          <button
            key={item.id}
            onClick={() => setEditing(item)}
            className="card-surface text-left rounded-2xl p-3.5 flex flex-col gap-2.5 active:opacity-70"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                {item.sku && <p className="font-mono text-xs font-semibold text-text-muted">{item.sku}</p>}
                <p className="text-[14.5px] font-semibold text-text-primary leading-snug mt-0.5">{item.productName}</p>
              </div>
              <StatusBadge status={item.status} size="sm" />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <PriorityBadge priority={item.priority} size="sm" />
              <OverdueTag deadline={item.deadline} completedAt={item.completedAt} />
            </div>

            {item.notes && <p className="text-xs text-text-secondary line-clamp-2">{item.notes}</p>}

            <div className="flex items-center justify-between border-t border-border pt-2.5">
              <PersonChip person={person} />
              {item.deadline && (
                <span className="flex items-center gap-1 text-xs text-text-muted">
                  <Calendar size={13} /> {formatDate(item.deadline)}
                </span>
              )}
            </div>
          </button>
        );
      })}

      <Sheet open={!!editing} onClose={() => setEditing(null)} title="Edit Landing Page Task">
        {editing && <LandingPageForm item={editing} onDone={() => setEditing(null)} />}
      </Sheet>
    </div>
  );
}

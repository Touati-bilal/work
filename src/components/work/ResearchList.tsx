"use client";

import { useState } from "react";
import Link from "next/link";
import type { ResearchItem } from "@/lib/types";
import { useData } from "@/lib/data/DataProvider";
import { personById } from "@/lib/selectors";
import { CategoryBadge, PriorityBadge } from "@/components/ui/CategoryBadge";
import { RESEARCH_STATUS_META } from "@/lib/constants";
import { PersonChip } from "@/components/ui/PersonAvatar";
import { formatDate } from "@/lib/utils/date";
import { Sheet } from "@/components/ui/Sheet";
import { ResearchForm } from "@/components/work/ResearchForm";
import { SendToManagerForm } from "@/components/work/SendToManagerForm";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ExternalLink, Microscope, Send } from "lucide-react";

export function ResearchList({ items }: { items: ResearchItem[] }) {
  const { data } = useData();
  const [editing, setEditing] = useState<ResearchItem | null>(null);
  const [sending, setSending] = useState<ResearchItem | null>(null);

  if (items.length === 0) {
    return <EmptyState icon={Microscope} title="No research items" description="Products you find during research will show up here." />;
  }

  return (
    <div className="grid gap-2.5 md:grid-cols-2">
      {items.map((item) => {
        const foundBy = personById(data, item.foundByPersonId);
        const meta = RESEARCH_STATUS_META[item.status];
        return (
          <div key={item.id} className="card-surface rounded-2xl p-3.5 flex flex-col gap-2.5">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[14.5px] font-semibold text-text-primary leading-snug">{item.name}</p>
              <PriorityBadge priority={item.priority} size="sm" />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <CategoryBadge category={item.category} size="sm" />
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${meta.classes}`}>
                {meta.label}
              </span>
              {item.source && <span className="text-[11px] text-text-muted">via {item.source}</span>}
            </div>

            {item.notes && <p className="text-xs text-text-secondary line-clamp-2">{item.notes}</p>}

            <div className="flex items-center justify-between border-t border-border pt-2.5">
              <PersonChip person={foundBy} />
              <span className="text-xs text-text-muted">{formatDate(item.foundAt)}</span>
            </div>

            <div className="flex items-center gap-2">
              {item.url && (
                <a href={item.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-medium text-brand hover:underline">
                  <ExternalLink size={12} /> Link
                </a>
              )}
              <button onClick={() => setEditing(item)} className="text-xs font-medium text-text-secondary hover:text-text-primary ml-auto">
                Edit
              </button>
              {item.status === "SENT_TO_MANAGER" && item.sentToManagerProductId ? (
                <Link href={`/product/${item.sentToManagerProductId}`} className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  View in Manager
                </Link>
              ) : (
                <Button variant="secondary" className="!px-2.5 !py-1.5 text-xs" onClick={() => setSending(item)}>
                  <Send size={12} /> Send to Manager
                </Button>
              )}
            </div>
          </div>
        );
      })}

      <Sheet open={!!editing} onClose={() => setEditing(null)} title="Edit Research Item">
        {editing && <ResearchForm item={editing} onDone={() => setEditing(null)} />}
      </Sheet>

      <Sheet open={!!sending} onClose={() => setSending(null)} title="Send to Manager">
        {sending && <SendToManagerForm item={sending} onDone={() => setSending(null)} />}
      </Sheet>
    </div>
  );
}

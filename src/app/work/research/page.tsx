"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { useData } from "@/lib/data/DataProvider";
import { ResearchList } from "@/components/work/ResearchList";
import { ResearchForm } from "@/components/work/ResearchForm";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import type { ResearchStatus } from "@/lib/types";
import { RESEARCH_STATUS_META } from "@/lib/constants";

const FILTERS: Array<{ value: ResearchStatus | "ALL"; label: string }> = [
  { value: "ALL", label: "All" },
  { value: "NEW", label: RESEARCH_STATUS_META.NEW.label },
  { value: "IN_REVIEW", label: RESEARCH_STATUS_META.IN_REVIEW.label },
  { value: "SENT_TO_MANAGER", label: RESEARCH_STATUS_META.SENT_TO_MANAGER.label },
  { value: "REJECTED", label: RESEARCH_STATUS_META.REJECTED.label },
];

export default function ResearchPage() {
  const { data } = useData();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<ResearchStatus | "ALL">("ALL");

  const items = useMemo(() => {
    const sorted = [...data.research].sort((a, b) => new Date(b.foundAt).getTime() - new Date(a.foundAt).getTime());
    return filter === "ALL" ? sorted : sorted.filter((r) => r.status === filter);
  }, [data.research, filter]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/work" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-surface-2">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <p className="text-xs font-medium text-text-muted">Work</p>
            <h1 className="text-xl font-bold text-text-primary tracking-tight">Product Research</h1>
          </div>
        </div>
        <Button onClick={() => setShowForm(true)} className="!px-3 !py-2 text-xs">
          <Plus size={14} /> Add
        </Button>
      </div>

      <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold tap-target ${
              filter === f.value ? "border-brand bg-brand text-brand-foreground" : "border-border text-text-secondary"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ResearchList items={items} />

      <Sheet open={showForm} onClose={() => setShowForm(false)} title="Add Research Item">
        <ResearchForm onDone={() => setShowForm(false)} />
      </Sheet>
    </div>
  );
}

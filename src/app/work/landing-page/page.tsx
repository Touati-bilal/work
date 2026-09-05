"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { useData } from "@/lib/data/DataProvider";
import { LandingPageList } from "@/components/work/LandingPageList";
import { LandingPageForm } from "@/components/work/LandingPageForm";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import type { Status } from "@/lib/types";
import { STATUS_META, STATUSES } from "@/lib/constants";

export default function LandingPagePage() {
  const { data } = useData();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<Status | "ALL">("ALL");

  const items = useMemo(() => {
    const sorted = [...data.landingPage].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return filter === "ALL" ? sorted : sorted.filter((l) => l.status === filter);
  }, [data.landingPage, filter]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/work" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-surface-2">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <p className="text-xs font-medium text-text-muted">Work</p>
            <h1 className="text-xl font-bold text-text-primary tracking-tight">Landing Page</h1>
          </div>
        </div>
        <Button onClick={() => setShowForm(true)} className="!px-3 !py-2 text-xs">
          <Plus size={14} /> Add
        </Button>
      </div>

      <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setFilter("ALL")}
          className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold tap-target ${
            filter === "ALL" ? "border-brand bg-brand text-brand-foreground" : "border-border text-text-secondary"
          }`}
        >
          All
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold tap-target ${
              filter === s ? "border-brand bg-brand text-brand-foreground" : "border-border text-text-secondary"
            }`}
          >
            {STATUS_META[s].label}
          </button>
        ))}
      </div>

      <LandingPageList items={items} />

      <Sheet open={showForm} onClose={() => setShowForm(false)} title="Add Landing Page Task">
        <LandingPageForm onDone={() => setShowForm(false)} />
      </Sheet>
    </div>
  );
}

"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useData } from "@/lib/data/DataProvider";
import { activeProducts } from "@/lib/selectors";
import { STAGE_ORDER } from "@/lib/constants";
import { ManagerFilters, type ManagerFilterState } from "@/components/manager/ManagerFilters";
import { StageSection } from "@/components/manager/StageSection";
import { ProductForm } from "@/components/manager/ProductForm";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { History, Plus } from "lucide-react";
import type { Stage } from "@/lib/types";

function ManagerPageInner({ initialStage }: { initialStage: Stage | "ALL" }) {
  const { data } = useData();
  const [showForm, setShowForm] = useState(false);

  const [filters, setFilters] = useState<ManagerFilterState>({
    stage: initialStage,
    itemType: "ALL",
    personId: "ALL",
  });

  const filtered = useMemo(() => {
    let list = activeProducts(data.products);
    if (filters.itemType !== "ALL") list = list.filter((p) => p.itemType === filters.itemType);
    if (filters.personId !== "ALL") {
      list = list.filter(
        (p) => p.designPersonId === filters.personId || p.videoEditingPersonId === filters.personId || p.testingPersonId === filters.personId
      );
    }
    return list;
  }, [data.products, filters]);

  const stagesToShow = filters.stage === "ALL" ? STAGE_ORDER.filter((s) => s !== "FINISHED") : [filters.stage as Stage];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-text-muted">Manager</p>
          <h1 className="text-xl font-bold text-text-primary tracking-tight mt-0.5">Design · Video Editing · Testing</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/manager/history"
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-text-secondary hover:bg-surface-2"
          >
            <History size={14} /> History
          </Link>
          <Button onClick={() => setShowForm(true)} className="!px-3 !py-2 text-xs">
            <Plus size={14} /> New
          </Button>
        </div>
      </div>

      <ManagerFilters value={filters} onChange={setFilters} />

      <div className="space-y-7">
        {stagesToShow.map((stage) => (
          <StageSection key={stage} stage={stage} products={filtered.filter((p) => p.stage === stage)} />
        ))}
      </div>

      <Sheet open={showForm} onClose={() => setShowForm(false)} title="New Item">
        <ProductForm onDone={() => setShowForm(false)} />
      </Sheet>
    </div>
  );
}

function ManagerRouteSync() {
  const params = useSearchParams();
  const stage = (params.get("stage") as Stage | null) ?? "ALL";
  return <ManagerPageInner key={stage} initialStage={stage} />;
}

export default function ManagerPage() {
  return (
    <Suspense fallback={null}>
      <ManagerRouteSync />
    </Suspense>
  );
}

"use client";

import { useState } from "react";
import type { Product, Stage } from "@/lib/types";
import { STAGE_META } from "@/lib/constants";
import { ProductCard } from "@/components/manager/ProductCard";
import { ProductTable } from "@/components/manager/ProductTable";
import { EmptyState } from "@/components/ui/EmptyState";

export function StageSection({ stage, products }: { stage: Stage; products: Product[] }) {
  const meta = STAGE_META[stage];
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? products : products.slice(0, 8);

  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <span className={`h-2.5 w-2.5 rounded-full ${meta.accent}`} />
        <h2 className="text-[15px] font-semibold text-text-primary">{meta.label}</h2>
        <span className="text-xs text-text-muted">({products.length})</span>
      </div>

      {products.length === 0 ? (
        <EmptyState title={`Nothing in ${meta.label}`} description="Items matching the current filters will appear here." />
      ) : (
        <>
          <div className="grid gap-2.5 sm:grid-cols-2 md:hidden">
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <ProductTable products={visible} />
          {products.length > visible.length && (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="mt-2.5 text-xs font-medium text-brand hover:underline"
            >
              Show all {products.length}
            </button>
          )}
        </>
      )}
    </section>
  );
}

"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import { useData } from "@/lib/data/DataProvider";
import { currentAssignee } from "@/lib/selectors";
import { StageBadge, ItemTypeBadge } from "@/components/ui/StageBadge";
import { PersonChip } from "@/components/ui/PersonAvatar";
import { OverdueTag } from "@/components/ui/OverdueTag";
import { formatDate } from "@/lib/utils/date";
import { Calendar, StickyNote } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  const { data } = useData();
  const person = currentAssignee(data, product);
  const overdue = !product.completedAt && !!product.deadline && new Date(product.deadline) < new Date();

  return (
    <Link
      href={`/product/${product.id}`}
      className="card-surface flex flex-col gap-2.5 rounded-2xl p-3.5 transition-all duration-200 hover:shadow-md active:opacity-70"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-mono text-xs font-semibold text-text-muted">{product.sku}</p>
          <p className="text-[14.5px] font-semibold text-text-primary leading-snug mt-0.5 line-clamp-2">
            {product.name}
          </p>
        </div>
        <StageBadge stage={product.stage} size="sm" />
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <ItemTypeBadge itemType={product.itemType} size="sm" />
        {overdue && <OverdueTag deadline={product.deadline} completedAt={product.completedAt} />}
      </div>

      {product.notes && (
        <p className="flex items-start gap-1.5 text-xs text-text-secondary line-clamp-2">
          <StickyNote size={13} className="mt-0.5 shrink-0 text-text-muted" />
          {product.notes}
        </p>
      )}

      <div className="flex items-center justify-between border-t border-border pt-2.5 mt-0.5">
        <PersonChip person={person} />
        {product.deadline && (
          <span className={`flex items-center gap-1 text-xs font-medium ${overdue ? "text-rose-600 dark:text-rose-400" : "text-text-muted"}`}>
            <Calendar size={13} />
            {formatDate(product.deadline)}
          </span>
        )}
      </div>
    </Link>
  );
}

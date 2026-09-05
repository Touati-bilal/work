"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import { useData } from "@/lib/data/DataProvider";
import { currentAssignee } from "@/lib/selectors";
import { StageBadge, ItemTypeBadge } from "@/components/ui/StageBadge";
import { PersonChip } from "@/components/ui/PersonAvatar";
import { OverdueTag } from "@/components/ui/OverdueTag";
import { formatDate } from "@/lib/utils/date";

export function ProductTable({ products }: { products: Product[] }) {
  const { data } = useData();

  return (
    <div className="hidden md:block card-surface rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs text-text-muted">
            <th className="px-4 py-3 font-medium">SKU</th>
            <th className="px-4 py-3 font-medium">Product</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Current Owner</th>
            <th className="px-4 py-3 font-medium">Stage</th>
            <th className="px-4 py-3 font-medium">Deadline</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {products.map((p) => {
            const person = currentAssignee(data, p);
            const overdue = !p.completedAt && !!p.deadline && new Date(p.deadline) < new Date();
            return (
              <tr key={p.id} className="hover:bg-surface-2 transition-colors">
                <td className="px-4 py-3">
                  <Link href={`/product/${p.id}`} className="font-mono text-xs font-semibold text-brand hover:underline">
                    {p.sku}
                  </Link>
                </td>
                <td className="px-4 py-3 max-w-[220px]">
                  <Link href={`/product/${p.id}`} className="text-text-primary font-medium truncate block">
                    {p.name}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <ItemTypeBadge itemType={p.itemType} size="sm" />
                </td>
                <td className="px-4 py-3">
                  <PersonChip person={person} />
                </td>
                <td className="px-4 py-3">
                  <StageBadge stage={p.stage} size="sm" />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={overdue ? "text-rose-600 dark:text-rose-400 font-medium" : "text-text-secondary"}>
                      {formatDate(p.deadline)}
                    </span>
                    <OverdueTag deadline={p.deadline} completedAt={p.completedAt} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

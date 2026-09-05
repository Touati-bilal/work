"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useData } from "@/lib/data/DataProvider";
import { completedProducts } from "@/lib/selectors";
import { ProductCard } from "@/components/manager/ProductCard";
import { ProductTable } from "@/components/manager/ProductTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { CheckCircle2 } from "lucide-react";

export default function ManagerHistoryPage() {
  const { data } = useData();
  const completed = completedProducts(data.products).sort(
    (a, b) => new Date(b.completedAt ?? 0).getTime() - new Date(a.completedAt ?? 0).getTime()
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Link href="/manager" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-surface-2">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <p className="text-xs font-medium text-text-muted">Manager</p>
          <h1 className="text-xl font-bold text-text-primary tracking-tight">Completed History</h1>
        </div>
      </div>

      {completed.length === 0 ? (
        <EmptyState icon={CheckCircle2} title="No finished items yet" description="Finished products will be archived here." />
      ) : (
        <>
          <div className="grid gap-2.5 sm:grid-cols-2 md:hidden">
            {completed.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <ProductTable products={completed} />
        </>
      )}
    </div>
  );
}

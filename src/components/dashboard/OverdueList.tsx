import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/manager/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { CheckCircle2 } from "lucide-react";

export function OverdueList({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return <EmptyState icon={CheckCircle2} title="Nothing overdue" description="All active items are within their deadline." />;
  }

  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

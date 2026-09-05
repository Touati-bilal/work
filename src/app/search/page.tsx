"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import { useData } from "@/lib/data/DataProvider";
import { personById } from "@/lib/selectors";
import { ProductCard } from "@/components/manager/ProductCard";
import { ResearchList } from "@/components/work/ResearchList";
import { LandingPageList } from "@/components/work/LandingPageList";
import { EmptyState } from "@/components/ui/EmptyState";

function SearchPageInner({ initialQuery }: { initialQuery: string }) {
  const { data } = useData();
  const [query, setQuery] = useState(initialQuery);

  const q = query.trim().toLowerCase();

  const products = useMemo(() => {
    if (!q) return [];
    return data.products.filter((p) => {
      const people = [p.designPersonId, p.videoEditingPersonId, p.testingPersonId]
        .map((id) => personById(data, id))
        .filter(Boolean);
      return (
        p.sku.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.itemType.toLowerCase().includes(q) ||
        p.stage.toLowerCase().includes(q) ||
        people.some((person) => person!.handle.toLowerCase().includes(q) || person!.name.toLowerCase().includes(q))
      );
    });
  }, [data, q]);

  const research = useMemo(() => {
    if (!q) return [];
    return data.research.filter((r) => {
      const person = personById(data, r.foundByPersonId);
      return (
        r.name.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        (r.sku ?? "").toLowerCase().includes(q) ||
        person?.handle.toLowerCase().includes(q)
      );
    });
  }, [data, q]);

  const landing = useMemo(() => {
    if (!q) return [];
    return data.landingPage.filter((l) => {
      const person = personById(data, l.assignedPersonId);
      return (
        l.productName.toLowerCase().includes(q) ||
        (l.sku ?? "").toLowerCase().includes(q) ||
        person?.handle.toLowerCase().includes(q)
      );
    });
  }, [data, q]);

  const hasResults = products.length + research.length + landing.length > 0;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-medium text-text-muted">Search</p>
        <h1 className="text-xl font-bold text-text-primary tracking-tight mt-0.5">Find anything</h1>
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2.5 focus-within:ring-2 focus-within:ring-brand/30">
        <SearchIcon size={16} className="text-text-muted shrink-0" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="SKU, product, person, stage, type..."
          className="w-full bg-transparent text-sm outline-none text-text-primary placeholder:text-text-muted"
        />
      </div>

      {!q && <EmptyState icon={SearchIcon} title="Search across everything" description="Find products, research items and landing page tasks by SKU, name, person, stage or type." />}

      {q && !hasResults && <EmptyState icon={SearchIcon} title="No results" description={`Nothing matches "${query}".`} />}

      {products.length > 0 && (
        <section>
          <h2 className="text-[13px] font-semibold uppercase tracking-wide text-text-muted mb-2.5">
            Manager · {products.length}
          </h2>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {research.length > 0 && (
        <section>
          <h2 className="text-[13px] font-semibold uppercase tracking-wide text-text-muted mb-2.5">
            Research · {research.length}
          </h2>
          <ResearchList items={research} />
        </section>
      )}

      {landing.length > 0 && (
        <section>
          <h2 className="text-[13px] font-semibold uppercase tracking-wide text-text-muted mb-2.5">
            Landing Page · {landing.length}
          </h2>
          <LandingPageList items={landing} />
        </section>
      )}
    </div>
  );
}

function SearchRouteSync() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  // Remount when the URL query changes so searching again from the header
  // (e.g. while already on /search) always reflects the new term.
  return <SearchPageInner key={q} initialQuery={q} />;
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchRouteSync />
    </Suspense>
  );
}

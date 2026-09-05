"use client";

import Link from "next/link";
import { useData } from "@/lib/data/DataProvider";
import { activeProducts, countsByStage, overdueProducts } from "@/lib/selectors";
import { StatTile } from "@/components/ui/StatTile";
import { PipelineOverviewCard } from "@/components/dashboard/PipelineOverviewCard";
import { OverdueList } from "@/components/dashboard/OverdueList";
import { AlertTriangle, CheckCircle2, ListChecks, Microscope, Rocket } from "lucide-react";
import { format } from "date-fns";

export default function DashboardPage() {
  const { data, ready } = useData();

  if (!ready) return null;

  const active = activeProducts(data.products);
  const overdue = overdueProducts(data.products);
  const finishedCount = data.products.filter((p) => p.stage === "FINISHED").length;
  const productCount = active.filter((p) => p.itemType === "PRODUCT").length;

  const researchPending = data.research.filter((r) => r.status === "NEW" || r.status === "IN_REVIEW").length;
  const landingPending = data.landingPage.filter((l) => l.status !== "VOLLSTANDIG").length;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium text-text-muted">{format(new Date(), "EEEE, d MMMM yyyy")}</p>
        <h1 className="text-xl font-bold text-text-primary tracking-tight mt-0.5">Command Center</h1>
      </div>

      <section>
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-text-muted mb-2.5 px-0.5">
          Pipeline Situation
        </h2>
        <PipelineOverviewCard counts={countsByStage(data.products)} />
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile label="Active Items" value={active.length} icon={ListChecks} />
        <StatTile label="Products" value={productCount} icon={ListChecks} />
        <StatTile label="Overdue" value={overdue.length} icon={AlertTriangle} tone={overdue.length ? "red" : "default"} />
        <StatTile label="Finished" value={finishedCount} icon={CheckCircle2} tone="green" />
      </div>

      <section>
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-text-muted mb-2.5 px-0.5">
          Overdue Items
        </h2>
        <OverdueList products={overdue} />
      </section>

      <section>
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-text-muted mb-2.5 px-0.5">
          Work at a Glance
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/work/research" className="card-surface rounded-2xl p-4 flex flex-col gap-2 transition-all duration-200 hover:shadow-md active:opacity-70">
            <Microscope size={18} className="text-text-muted" />
            <span className="text-2xl font-bold tabular-nums text-text-primary">{researchPending}</span>
            <span className="text-xs text-text-muted">Research pending</span>
          </Link>
          <Link href="/work/landing-page" className="card-surface rounded-2xl p-4 flex flex-col gap-2 transition-all duration-200 hover:shadow-md active:opacity-70">
            <Rocket size={18} className="text-text-muted" />
            <span className="text-2xl font-bold tabular-nums text-text-primary">{landingPending}</span>
            <span className="text-xs text-text-muted">Landing Page pending</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

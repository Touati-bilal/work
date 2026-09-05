"use client";

import Link from "next/link";
import { useData } from "@/lib/data/DataProvider";
import { Microscope, Rocket, ChevronRight } from "lucide-react";

export default function WorkPage() {
  const { data } = useData();

  const researchNew = data.research.filter((r) => r.status === "NEW").length;
  const researchReview = data.research.filter((r) => r.status === "IN_REVIEW").length;
  const researchSent = data.research.filter((r) => r.status === "SENT_TO_MANAGER").length;

  const landingActive = data.landingPage.filter((l) => l.status !== "VOLLSTANDIG").length;
  const landingDone = data.landingPage.filter((l) => l.status === "VOLLSTANDIG").length;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium text-text-muted">Work</p>
        <h1 className="text-xl font-bold text-text-primary tracking-tight mt-0.5">Research & Landing Pages</h1>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Link href="/work/research" className="card-surface rounded-2xl p-5 flex flex-col gap-4 active:opacity-70">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Microscope size={20} />
            </div>
            <ChevronRight size={18} className="text-text-muted" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-text-primary">Product Research</h2>
            <p className="text-xs text-text-muted mt-0.5">Todo list for products you are scouting</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center border-t border-border pt-3">
            <MiniStat value={researchNew} label="New" />
            <MiniStat value={researchReview} label="In Review" />
            <MiniStat value={researchSent} label="Sent" />
          </div>
        </Link>

        <Link href="/work/landing-page" className="card-surface rounded-2xl p-5 flex flex-col gap-4 active:opacity-70">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <Rocket size={20} />
            </div>
            <ChevronRight size={18} className="text-text-muted" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-text-primary">Landing Page</h2>
            <p className="text-xs text-text-muted mt-0.5">Workflow for landing page tasks</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center border-t border-border pt-3">
            <MiniStat value={landingActive} label="Active" />
            <MiniStat value={landingDone} label="Completed" />
          </div>
        </Link>
      </div>
    </div>
  );
}

function MiniStat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <p className="text-lg font-bold text-text-primary tabular-nums">{value}</p>
      <p className="text-[10px] text-text-muted mt-0.5">{label}</p>
    </div>
  );
}

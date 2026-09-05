"use client";

import { Check } from "lucide-react";
import type { Product, Stage } from "@/lib/types";
import { useData } from "@/lib/data/DataProvider";
import { personById } from "@/lib/selectors";
import { STAGE_META } from "@/lib/constants";
import { STAGE_ICONS } from "@/components/ui/StageBadge";
import { Button } from "@/components/ui/Button";
import { CheckCircle2 } from "lucide-react";

const STAGE_RANK: Record<Stage, number> = { DESIGN: 0, VIDEO_EDITING: 1, TESTING: 2, FINISHED: 3 };

type PersonKey = "designPersonId" | "videoEditingPersonId" | "testingPersonId";

const PRODUCT_NODES: Array<{ stage: Stage; personKey: PersonKey | null }> = [
  { stage: "DESIGN", personKey: "designPersonId" },
  { stage: "VIDEO_EDITING", personKey: "videoEditingPersonId" },
  { stage: "TESTING", personKey: "testingPersonId" },
  { stage: "FINISHED", personKey: null },
];

export function PipelineStepper({ product }: { product: Product }) {
  const { data, completeStage } = useData();
  const isCatalog = product.itemType === "CATEGORY";
  const isFinished = product.stage === "FINISHED";

  if (isCatalog) {
    const person = personById(data, product.designPersonId);
    const meta = STAGE_META.DESIGN;
    const Icon = isFinished ? CheckCircle2 : STAGE_ICONS.DESIGN;

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-xl border border-border px-4 py-3.5">
          <div
            className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors duration-500 ${
              isFinished ? "bg-emerald-500 text-white" : `${meta.accent} text-white`
            }`}
          >
            {!isFinished && <span className={`pulse-ring absolute inset-0 rounded-full ${meta.accent}`} />}
            <Icon size={20} strokeWidth={2.4} className="relative" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text-primary">{isFinished ? "Finished" : "Design"}</p>
            <p className="text-xs text-text-muted truncate">{person ? person.handle : "Unassigned"}</p>
          </div>
        </div>

        {!isFinished && (
          <Button className="w-full transition-transform active:scale-[0.98]" onClick={() => completeStage(product.id)}>
            <CheckCircle2 size={16} /> Complete Design
          </Button>
        )}
      </div>
    );
  }

  const totalSteps = 3;
  const completedSteps = Math.min(STAGE_RANK[product.stage], totalSteps);
  const progressPct = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-text-secondary">Overall progress</span>
          <span className="text-xs font-semibold text-text-primary tabular-nums">{progressPct}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-cyan-500 transition-[width] duration-700 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="flex items-start">
        {PRODUCT_NODES.map((node, i) => {
          const meta = STAGE_META[node.stage];
          const Icon = node.stage === "FINISHED" ? CheckCircle2 : STAGE_ICONS[node.stage];
          const done = STAGE_RANK[product.stage] > STAGE_RANK[node.stage] || (node.stage === "FINISHED" && isFinished);
          const isCurrent = product.stage === node.stage;
          const person = node.personKey ? personById(data, product[node.personKey]) : undefined;

          return (
            <div key={node.stage} className={`flex items-center ${i === PRODUCT_NODES.length - 1 ? "" : "flex-1"}`}>
              <div className="flex flex-col items-center gap-1.5 w-14 shrink-0">
                <div
                  className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                    done
                      ? `${meta.accent} border-transparent text-white`
                      : isCurrent
                        ? `bg-surface ${meta.text} border-current`
                        : "bg-surface border-border text-text-muted"
                  }`}
                >
                  {isCurrent && !done && <span className={`pulse-ring absolute inset-0 rounded-full ${meta.accent}`} />}
                  <span className="relative">
                    {done ? <Check size={18} strokeWidth={3} className="check-pop" /> : <Icon size={16} strokeWidth={2.4} />}
                  </span>
                </div>
                <div className="text-center">
                  <p className={`text-[10px] font-semibold leading-tight ${isCurrent ? meta.text : "text-text-muted"}`}>
                    {node.stage === "FINISHED" ? "Completed" : meta.label.replace(" Editing", "")}
                  </p>
                  {person && <p className="text-[9px] text-text-muted truncate max-w-14">{person.handle}</p>}
                </div>
              </div>

              {i < PRODUCT_NODES.length - 1 && (
                <div className="h-0.5 flex-1 rounded-full bg-border overflow-hidden -mt-5">
                  <div
                    className={`h-full rounded-full transition-[width] duration-700 ease-out ${meta.accent}`}
                    style={{ width: done ? "100%" : "0%" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!isFinished && (
        <Button className="w-full transition-transform active:scale-[0.98]" onClick={() => completeStage(product.id)}>
          <CheckCircle2 size={16} /> Complete {STAGE_META[product.stage].label}
        </Button>
      )}
    </div>
  );
}

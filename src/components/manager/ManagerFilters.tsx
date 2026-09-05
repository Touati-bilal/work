"use client";

import type { ItemType, Stage } from "@/lib/types";
import { useData } from "@/lib/data/DataProvider";
import { ITEM_TYPE_META, ITEM_TYPES, STAGE_META } from "@/lib/constants";
import { inputClass } from "@/components/ui/Field";

export interface ManagerFilterState {
  stage: Stage | "ALL";
  itemType: ItemType | "ALL";
  personId: string | "ALL";
}

const STAGES: Stage[] = ["DESIGN", "VIDEO_EDITING", "TESTING", "FINISHED"];

export function ManagerFilters({
  value,
  onChange,
}: {
  value: ManagerFilterState;
  onChange: (next: ManagerFilterState) => void;
}) {
  const { data } = useData();

  return (
    <div className="space-y-3">
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        <Chip active={value.stage === "ALL"} onClick={() => onChange({ ...value, stage: "ALL" })} label="All Stages" />
        {STAGES.map((s) => (
          <Chip key={s} active={value.stage === s} onClick={() => onChange({ ...value, stage: s })} label={STAGE_META[s].label} />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <select
          className={inputClass}
          value={value.itemType}
          onChange={(e) => onChange({ ...value, itemType: e.target.value as ItemType | "ALL" })}
        >
          <option value="ALL">All Types</option>
          {ITEM_TYPES.map((t) => (
            <option key={t} value={t}>
              {ITEM_TYPE_META[t].label}
            </option>
          ))}
        </select>

        <select
          className={inputClass}
          value={value.personId}
          onChange={(e) => onChange({ ...value, personId: e.target.value })}
        >
          <option value="ALL">All People</option>
          {data.people.map((p) => (
            <option key={p.id} value={p.id}>
              {p.handle}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function Chip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold tap-target transition-colors ${
        active ? "border-brand bg-brand text-brand-foreground" : "border-border text-text-secondary"
      }`}
    >
      {label}
    </button>
  );
}

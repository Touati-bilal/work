"use client";

import type { Person, PersonGroup } from "@/lib/types";
import { useData } from "@/lib/data/DataProvider";
import { useMemo } from "react";

export function PersonSelector({
  value,
  onChange,
  group,
  allowUnassigned = true,
  className = "",
  id,
}: {
  value: string | null;
  onChange: (id: string | null) => void;
  group?: PersonGroup;
  allowUnassigned?: boolean;
  className?: string;
  id?: string;
}) {
  const { data } = useData();

  const people = useMemo<Person[]>(() => {
    const list = data.people.filter((p) => p.active && (!group || p.group === group));
    return list;
  }, [data.people, group]);

  return (
    <select
      id={id}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value || null)}
      className={`w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text-primary outline-none focus:ring-2 focus:ring-brand/30 ${className}`}
    >
      {allowUnassigned && <option value="">Unassigned</option>}
      {people.map((p) => (
        <option key={p.id} value={p.id}>
          {p.handle}
        </option>
      ))}
    </select>
  );
}

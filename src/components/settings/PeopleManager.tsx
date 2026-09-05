"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { useData } from "@/lib/data/DataProvider";
import type { PersonGroup } from "@/lib/types";
import { Card, SectionHeader } from "@/components/ui/Card";
import { PersonAvatar } from "@/components/ui/PersonAvatar";
import { Button } from "@/components/ui/Button";
import { Field, inputClass } from "@/components/ui/Field";

const GROUPS: { value: PersonGroup; label: string }[] = [
  { value: "PHOTO", label: "Photo Team" },
  { value: "VIDEO", label: "Video Team" },
  { value: "TESTING", label: "Testing Team" },
  { value: "RESEARCH", label: "Work / Research" },
  { value: "MANAGEMENT", label: "Management" },
];

export function PeopleManager() {
  const { data, addPerson } = useData();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [group, setGroup] = useState<PersonGroup>("PHOTO");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    addPerson({ name: name.trim(), group });
    setName("");
    setShowForm(false);
  }

  return (
    <Card>
      <SectionHeader
        title="People"
        subtitle="Team members across Photo, Video, Testing & Research"
        action={
          <Button variant="secondary" className="!px-3 !py-2 text-xs" onClick={() => setShowForm((s) => !s)}>
            <UserPlus size={14} /> Add
          </Button>
        }
      />

      {showForm && (
        <form onSubmit={handleAdd} className="mb-4 rounded-lg border border-border p-3">
          <Field label="Name" required>
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sara Ahmed" required />
          </Field>
          <Field label="Group" required>
            <select className={inputClass} value={group} onChange={(e) => setGroup(e.target.value as PersonGroup)}>
              {GROUPS.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </Field>
          <Button type="submit" className="w-full">
            Add Person
          </Button>
        </form>
      )}

      <div className="space-y-4">
        {GROUPS.map((g) => {
          const people = data.people.filter((p) => p.group === g.value);
          if (people.length === 0) return null;
          return (
            <div key={g.value}>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted mb-2">{g.label}</p>
              <div className="flex flex-wrap gap-2">
                {people.map((p) => (
                  <span key={p.id} className="flex items-center gap-2 rounded-full border border-border bg-surface-2 px-2.5 py-1.5">
                    <PersonAvatar person={p} size={22} />
                    <span className="text-xs font-medium text-text-primary">{p.handle}</span>
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

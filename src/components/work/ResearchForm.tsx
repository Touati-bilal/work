"use client";

import { useState } from "react";
import type { ProductCategory, Priority, ResearchItem } from "@/lib/types";
import { useData } from "@/lib/data/DataProvider";
import { CATEGORIES, PRIORITIES, PRIORITY_META } from "@/lib/constants";
import { Field, inputClass } from "@/components/ui/Field";
import { PersonSelector } from "@/components/ui/PersonSelector";
import { Button } from "@/components/ui/Button";

export function ResearchForm({ item, onDone }: { item?: ResearchItem; onDone: () => void }) {
  const { addResearch, updateResearch, deleteResearch } = useData();
  const isEdit = !!item;

  const [name, setName] = useState(item?.name ?? "");
  const [category, setCategory] = useState<ProductCategory>(item?.category ?? "BOTH");
  const [foundByPersonId, setFoundByPersonId] = useState<string | null>(item?.foundByPersonId ?? "bilal");
  const [priority, setPriority] = useState<Priority>(item?.priority ?? "MEDIUM");
  const [source, setSource] = useState(item?.source ?? "");
  const [url, setUrl] = useState(item?.url ?? "");
  const [notes, setNotes] = useState(item?.notes ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    if (isEdit && item) {
      updateResearch(item.id, { name: name.trim(), category, priority, source: source.trim() || undefined, url: url.trim() || undefined, notes: notes.trim() || undefined });
    } else {
      addResearch({ name: name.trim(), category, foundByPersonId: foundByPersonId ?? "bilal", priority, source: source.trim() || undefined, url: url.trim() || undefined, notes: notes.trim() || undefined });
    }
    onDone();
  }

  return (
    <form onSubmit={handleSubmit}>
      <Field label="Product Name" required>
        <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Folding Hunting Knife Set" required />
      </Field>

      <Field label="Category" required>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map((c) => (
            <button key={c} type="button" onClick={() => setCategory(c)} className={`rounded-lg border px-3 py-2 text-xs font-semibold tap-target ${category === c ? "border-brand bg-brand/10 text-brand" : "border-border text-text-secondary"}`}>
              {c}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Found By">
        <PersonSelector value={foundByPersonId} onChange={setFoundByPersonId} allowUnassigned={false} />
      </Field>

      <Field label="Priority" required>
        <div className="grid grid-cols-3 gap-2">
          {PRIORITIES.map((p) => (
            <button key={p} type="button" onClick={() => setPriority(p)} className={`rounded-lg border px-3 py-2 text-xs font-semibold tap-target ${priority === p ? "border-brand bg-brand/10 text-brand" : "border-border text-text-secondary"}`}>
              {PRIORITY_META[p].label}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Source">
        <input className={inputClass} value={source} onChange={(e) => setSource(e.target.value)} placeholder="e.g. Alibaba, AliExpress, 1688" />
      </Field>

      <Field label="Product URL">
        <input className={inputClass} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." type="url" />
      </Field>

      <Field label="Notes">
        <textarea className={inputClass} rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes..." />
      </Field>

      <div className="flex items-center gap-2 pt-1">
        <Button type="submit" className="flex-1">
          {isEdit ? "Save Changes" : "Add to Research"}
        </Button>
        {isEdit && item && (
          <Button
            type="button"
            variant="danger"
            onClick={() => {
              if (confirm("Remove this research item?")) {
                deleteResearch(item.id);
                onDone();
              }
            }}
          >
            Delete
          </Button>
        )}
      </div>
    </form>
  );
}

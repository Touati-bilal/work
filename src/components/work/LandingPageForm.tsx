"use client";

import { useState } from "react";
import type { LandingPageItem, Priority, Status } from "@/lib/types";
import { useData } from "@/lib/data/DataProvider";
import { PRIORITIES, PRIORITY_META, STATUSES, STATUS_META } from "@/lib/constants";
import { Field, inputClass } from "@/components/ui/Field";
import { PersonSelector } from "@/components/ui/PersonSelector";
import { Button } from "@/components/ui/Button";

export function LandingPageForm({ item, onDone }: { item?: LandingPageItem; onDone: () => void }) {
  const { addLanding, updateLanding, setLandingStatus, deleteLanding } = useData();
  const isEdit = !!item;

  const [productName, setProductName] = useState(item?.productName ?? "");
  const [sku, setSku] = useState(item?.sku ?? "");
  const [assignedPersonId, setAssignedPersonId] = useState<string | null>(item?.assignedPersonId ?? "bilal");
  const [priority, setPriority] = useState<Priority>(item?.priority ?? "MEDIUM");
  const [status, setStatus] = useState<Status>(item?.status ?? "ZU_ERLEDIGEN");
  const [deadline, setDeadline] = useState(item?.deadline ? item.deadline.slice(0, 16) : "");
  const [notes, setNotes] = useState(item?.notes ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!productName.trim()) return;
    const deadlineIso = deadline ? new Date(deadline).toISOString() : undefined;
    if (isEdit && item) {
      updateLanding(item.id, { productName: productName.trim(), sku: sku.trim() || undefined, assignedPersonId, priority, deadline: deadlineIso, notes: notes.trim() || undefined });
      if (status !== item.status) setLandingStatus(item.id, status);
    } else {
      addLanding({ productName: productName.trim(), sku: sku.trim() || undefined, assignedPersonId, priority, status, deadline: deadlineIso, notes: notes.trim() || undefined });
    }
    onDone();
  }

  return (
    <form onSubmit={handleSubmit}>
      <Field label="Product" required>
        <input className={inputClass} value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Product name" required />
      </Field>

      <Field label="SKU (if assigned)">
        <input className={`${inputClass} font-mono`} value={sku} onChange={(e) => setSku(e.target.value)} placeholder="DEN-000" />
      </Field>

      <Field label="Assigned Person">
        <PersonSelector value={assignedPersonId} onChange={setAssignedPersonId} />
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

      <Field label="Status" required>
        <div className="grid grid-cols-2 gap-2">
          {STATUSES.map((s) => (
            <button key={s} type="button" onClick={() => setStatus(s)} className={`rounded-lg border px-3 py-2 text-xs font-semibold tap-target ${status === s ? "border-brand bg-brand/10 text-brand" : "border-border text-text-secondary"}`}>
              {STATUS_META[s].label}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Deadline">
        <input type="datetime-local" className={inputClass} value={deadline} onChange={(e) => setDeadline(e.target.value)} />
      </Field>

      <Field label="Notes">
        <textarea className={inputClass} rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes..." />
      </Field>

      <div className="flex items-center gap-2 pt-1">
        <Button type="submit" className="flex-1">
          {isEdit ? "Save Changes" : "Add Task"}
        </Button>
        {isEdit && item && (
          <Button
            type="button"
            variant="danger"
            onClick={() => {
              if (confirm("Delete this landing page task?")) {
                deleteLanding(item.id);
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

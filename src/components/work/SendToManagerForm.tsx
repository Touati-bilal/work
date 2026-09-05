"use client";

import { useState } from "react";
import type { ItemType, ResearchItem } from "@/lib/types";
import { useData } from "@/lib/data/DataProvider";
import { ITEM_TYPE_META, ITEM_TYPES } from "@/lib/constants";
import { Field, inputClass } from "@/components/ui/Field";
import { PersonSelector } from "@/components/ui/PersonSelector";
import { Button } from "@/components/ui/Button";
import { formatSku } from "@/lib/utils/sku";

export function SendToManagerForm({ item, onDone }: { item: ResearchItem; onDone: () => void }) {
  const { data, sendResearchToManager } = useData();
  const [itemType, setItemType] = useState<ItemType>("PRODUCT");
  const [designPersonId, setDesignPersonId] = useState<string | null>(null);
  const [videoEditingPersonId, setVideoEditingPersonId] = useState<string | null>(null);
  const [testingPersonId, setTestingPersonId] = useState<string | null>(null);
  const [deadline, setDeadline] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendResearchToManager(item.id, {
      itemType,
      designPersonId,
      videoEditingPersonId,
      testingPersonId,
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
    });
    onDone();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4 rounded-lg bg-surface-2 border border-border px-3 py-2.5">
        <p className="text-sm font-semibold text-text-primary">{item.name}</p>
        <p className="text-xs text-text-muted mt-0.5">Will be created as {item.sku ?? formatSku(data.skuCounter)}</p>
      </div>

      <Field label="Item Type" required>
        <div className="grid grid-cols-2 gap-2">
          {ITEM_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setItemType(t)}
              className={`rounded-lg border px-3 py-2 text-xs font-semibold tap-target ${itemType === t ? "border-brand bg-brand/10 text-brand" : "border-border text-text-secondary"}`}
            >
              {ITEM_TYPE_META[t].label}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Design — responsible person">
        <PersonSelector value={designPersonId} onChange={setDesignPersonId} group="PHOTO" />
      </Field>

      {itemType === "PRODUCT" && (
        <>
          <Field label="Video Editing — responsible person">
            <PersonSelector value={videoEditingPersonId} onChange={setVideoEditingPersonId} group="VIDEO" />
          </Field>
          <Field label="Testing — responsible person">
            <PersonSelector value={testingPersonId} onChange={setTestingPersonId} group="TESTING" />
          </Field>
        </>
      )}

      <Field label="Deadline">
        <input type="datetime-local" className={inputClass} value={deadline} onChange={(e) => setDeadline(e.target.value)} />
      </Field>

      <Button type="submit" className="w-full">
        Send to Manager
      </Button>
    </form>
  );
}

"use client";

import { useState } from "react";
import type { ItemType, Product } from "@/lib/types";
import { useData } from "@/lib/data/DataProvider";
import { ITEM_TYPE_META, ITEM_TYPES } from "@/lib/constants";
import { Field, inputClass } from "@/components/ui/Field";
import { PersonSelector } from "@/components/ui/PersonSelector";
import { Button } from "@/components/ui/Button";
import { formatSku } from "@/lib/utils/sku";

export function ProductForm({ product, onDone }: { product?: Product; onDone: () => void }) {
  const { data, addProduct, updateProduct, deleteProduct } = useData();
  const isEdit = !!product;

  const [name, setName] = useState(product?.name ?? "");
  const [skuNumber, setSkuNumber] = useState(String(data.skuCounter));
  const [itemType, setItemType] = useState<ItemType>(product?.itemType ?? "PRODUCT");
  const [givenByPersonId, setGivenByPersonId] = useState<string | null>(product?.givenByPersonId ?? null);
  const [designPersonId, setDesignPersonId] = useState<string | null>(product?.designPersonId ?? null);
  const [videoEditingPersonId, setVideoEditingPersonId] = useState<string | null>(product?.videoEditingPersonId ?? null);
  const [testingPersonId, setTestingPersonId] = useState<string | null>(product?.testingPersonId ?? null);
  const [deadline, setDeadline] = useState(product?.deadline ? product.deadline.slice(0, 16) : "");
  const [notes, setNotes] = useState(product?.notes ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const deadlineIso = deadline ? new Date(deadline).toISOString() : undefined;

    if (isEdit && product) {
      updateProduct(product.id, {
        name: name.trim(),
        designPersonId,
        videoEditingPersonId: itemType === "PRODUCT" ? videoEditingPersonId : null,
        testingPersonId: itemType === "PRODUCT" ? testingPersonId : null,
        givenByPersonId,
        deadline: deadlineIso,
        notes: notes.trim() || undefined,
      });
    } else {
      const parsedNumber = parseInt(skuNumber, 10);
      addProduct({
        name: name.trim(),
        itemType,
        designPersonId,
        videoEditingPersonId,
        testingPersonId,
        givenByPersonId,
        deadline: deadlineIso,
        notes: notes.trim() || undefined,
        sku: Number.isFinite(parsedNumber) && parsedNumber > 0 ? formatSku(parsedNumber) : undefined,
      });
    }
    onDone();
  }

  return (
    <form onSubmit={handleSubmit}>
      <Field label="Name" required>
        <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Tactical Red Dot Scope" required />
      </Field>

      <Field label="SKU">
        {isEdit ? (
          <input className={`${inputClass} font-mono text-text-muted`} value={product?.sku} disabled />
        ) : (
          <>
            <div className="flex items-center gap-2">
              <span className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm font-mono font-semibold text-text-muted shrink-0">
                DEN-
              </span>
              <input
                className={`${inputClass} font-mono`}
                value={skuNumber}
                onChange={(e) => setSkuNumber(e.target.value.replace(/[^0-9]/g, ""))}
                inputMode="numeric"
                placeholder="126"
              />
            </div>
            <p className="text-[11px] text-text-muted mt-1.5">
              Full SKU: <span className="font-mono font-semibold text-text-secondary">{formatSku(parseInt(skuNumber, 10) || 0)}</span>
            </p>
          </>
        )}
      </Field>

      <Field label="Item Type" required>
        <div className="grid grid-cols-2 gap-2">
          {ITEM_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              disabled={isEdit}
              onClick={() => setItemType(t)}
              className={`rounded-lg border px-3 py-2 text-xs font-semibold tap-target disabled:opacity-50 ${
                itemType === t ? "border-brand bg-brand/10 text-brand" : "border-border text-text-secondary"
              }`}
            >
              {ITEM_TYPE_META[t].label}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-text-muted mt-1.5">{ITEM_TYPE_META[itemType].description}</p>
      </Field>

      <Field label="Given By">
        <PersonSelector value={givenByPersonId} onChange={setGivenByPersonId} />
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

      <Field label="Notes">
        <textarea className={inputClass} rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes..." />
      </Field>

      <div className="flex items-center gap-2 pt-1">
        <Button type="submit" className="flex-1">
          {isEdit ? "Save Changes" : "Create"}
        </Button>
        {isEdit && product && (
          <Button
            type="button"
            variant="danger"
            onClick={() => {
              if (confirm(`Delete ${product.sku}? This cannot be undone.`)) {
                deleteProduct(product.id);
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

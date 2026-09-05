"use client";

import { useState } from "react";
import type { HistoryKind } from "@/lib/types";
import { useData } from "@/lib/data/DataProvider";
import { HISTORY_KIND_META } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { inputClass } from "@/components/ui/Field";

const KINDS: HistoryKind[] = ["NOTE", "ISSUE", "CORRECTION"];

export function AddNoteForm({ productId }: { productId: string }) {
  const { addProductNote } = useData();
  const [kind, setKind] = useState<HistoryKind>("NOTE");
  const [text, setText] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    addProductNote(productId, text.trim(), kind);
    setText("");
    setKind("NOTE");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5">
      <div className="grid grid-cols-3 gap-2">
        {KINDS.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold tap-target ${
              kind === k ? "border-brand bg-brand/10 text-brand" : "border-border text-text-secondary"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${HISTORY_KIND_META[k].classes}`} />
            {HISTORY_KIND_META[k].label}
          </button>
        ))}
      </div>
      <textarea
        className={inputClass}
        rows={2}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={
          kind === "ISSUE"
            ? "Describe the problem you found..."
            : kind === "CORRECTION"
              ? "Describe the correction that was made..."
              : "Add a note..."
        }
      />
      <Button type="submit" variant="secondary" className="w-full" disabled={!text.trim()}>
        Add to Timeline
      </Button>
    </form>
  );
}

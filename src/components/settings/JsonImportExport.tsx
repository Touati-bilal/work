"use client";

import { useRef, useState } from "react";
import { Download, Upload, CheckCircle2, XCircle } from "lucide-react";
import { useData } from "@/lib/data/DataProvider";
import { validateAppData } from "@/lib/data/validation";
import { formatFileDate } from "@/lib/utils/date";
import { Button } from "@/components/ui/Button";
import { Card, SectionHeader } from "@/components/ui/Card";

export function JsonImportExport() {
  const { data, importData } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function handleExport() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `planin-work-backup-${formatFileDate()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setMessage({ type: "success", text: "Backup exported successfully." });
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const result = validateAppData(parsed);
        if (!result.valid || !result.data) {
          setMessage({ type: "error", text: `Invalid backup file: ${result.errors.slice(0, 3).join("; ")}` });
          return;
        }
        importData(result.data);
        setMessage({ type: "success", text: "Data imported successfully." });
      } catch {
        setMessage({ type: "error", text: "This file is not valid JSON." });
      }
    };
    reader.readAsText(file);
  }

  return (
    <Card>
      <SectionHeader title="Data Management" subtitle="Backup or restore your PLANIN WORK data" />

      <div className="grid grid-cols-2 gap-2 mb-3">
        <Button variant="secondary" onClick={handleExport}>
          <Download size={16} /> Export JSON
        </Button>
        <Button variant="secondary" onClick={handleImportClick}>
          <Upload size={16} /> Import JSON
        </Button>
      </div>
      <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleFileChange} />

      {message && (
        <div
          className={`flex items-start gap-2 rounded-lg border px-3 py-2.5 text-xs ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400"
              : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400"
          }`}
        >
          {message.type === "success" ? <CheckCircle2 size={14} className="mt-0.5 shrink-0" /> : <XCircle size={14} className="mt-0.5 shrink-0" />}
          {message.text}
        </div>
      )}

      <p className="text-[11px] text-text-muted mt-3">
        Importing replaces all current data after validation. Invalid files are rejected and your existing data stays untouched.
      </p>
    </Card>
  );
}

import type { HistoryKind, ItemType, Priority, ProductCategory, ResearchStatus, Stage, Status } from "./types";

export const SKU_PREFIX = "DEN-";

export const STATUS_ORDER: Status[] = [
  "NEED_REVISION",
  "ZU_ERLEDIGEN",
  "IN_BEARBEITUNG",
  "WAITING",
  "VOLLSTANDIG",
];

export const STATUS_META: Record<
  Status,
  {
    label: string;
    short: string;
    color: "red" | "orange" | "blue" | "gray" | "green";
    classes: string;
    dot: string;
  }
> = {
  NEED_REVISION: {
    label: "Need Revision",
    short: "Revision",
    color: "red",
    classes:
      "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30",
    dot: "bg-rose-500",
  },
  ZU_ERLEDIGEN: {
    label: "Zu Erledigen",
    short: "To Do",
    color: "orange",
    classes:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30",
    dot: "bg-amber-500",
  },
  IN_BEARBEITUNG: {
    label: "In Bearbeitung",
    short: "In Progress",
    color: "blue",
    classes:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30",
    dot: "bg-blue-500",
  },
  WAITING: {
    label: "Waiting",
    short: "Waiting",
    color: "gray",
    classes:
      "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/30",
    dot: "bg-slate-400",
  },
  VOLLSTANDIG: {
    label: "Vollständig",
    short: "Done",
    color: "green",
    classes:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30",
    dot: "bg-emerald-500",
  },
};

export const CATEGORY_META: Record<
  ProductCategory,
  { label: string; classes: string }
> = {
  BOTH: {
    label: "Both",
    classes:
      "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/30",
  },
  HUNTER: {
    label: "Hunter",
    classes:
      "bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/30",
  },
  SHOOTER: {
    label: "Shooter",
    classes:
      "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/30",
  },
};

/** Production pipeline stage — colors reused 1:1 from the former Photo/Video/Testing team palette. */
export const STAGE_META: Record<
  Stage,
  { label: string; classes: string; accent: string; text: string; dot: string }
> = {
  DESIGN: {
    label: "Design",
    classes:
      "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200 dark:bg-fuchsia-500/10 dark:text-fuchsia-400 dark:border-fuchsia-500/30",
    accent: "bg-fuchsia-500",
    text: "text-fuchsia-700 dark:text-fuchsia-400",
    dot: "bg-fuchsia-500",
  },
  VIDEO_EDITING: {
    label: "Video Editing",
    classes:
      "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/30",
    accent: "bg-indigo-500",
    text: "text-indigo-700 dark:text-indigo-400",
    dot: "bg-indigo-500",
  },
  TESTING: {
    label: "Testing",
    classes:
      "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/30",
    accent: "bg-cyan-500",
    text: "text-cyan-700 dark:text-cyan-400",
    dot: "bg-cyan-500",
  },
  FINISHED: {
    label: "Finished",
    classes:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30",
    accent: "bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
};

export const ITEM_TYPE_META: Record<ItemType, { label: string; description: string; classes: string }> = {
  PRODUCT: {
    label: "Ad 🚀",
    description: "Flows through Design → Video Editing → Testing → Finished.",
    classes: "border-brand/40 text-brand",
  },
  CATEGORY: {
    label: "Catalog 📦",
    description: "Stays in Design only.",
    classes: "border-border text-text-secondary",
  },
};

export const PRIORITY_META: Record<
  Priority,
  { label: string; classes: string }
> = {
  HIGH: {
    label: "High",
    classes:
      "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30",
  },
  MEDIUM: {
    label: "Medium",
    classes:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30",
  },
  LOW: {
    label: "Low",
    classes:
      "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/30",
  },
};

export const RESEARCH_STATUS_META: Record<
  ResearchStatus,
  { label: string; classes: string }
> = {
  NEW: {
    label: "New",
    classes:
      "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/30",
  },
  IN_REVIEW: {
    label: "In Review",
    classes:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30",
  },
  SENT_TO_MANAGER: {
    label: "Sent to Manager",
    classes:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30",
  },
  REJECTED: {
    label: "Rejected",
    classes:
      "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-500/10 dark:text-slate-500 dark:border-slate-500/30",
  },
};

export const HISTORY_KIND_META: Record<HistoryKind, { label: string; classes: string }> = {
  SYSTEM: { label: "System", classes: "bg-slate-400" },
  NOTE: { label: "Note", classes: "bg-blue-500" },
  ISSUE: { label: "Issue", classes: "bg-rose-500" },
  CORRECTION: { label: "Correction", classes: "bg-amber-500" },
};

export const STAGE_ORDER: Stage[] = ["DESIGN", "VIDEO_EDITING", "TESTING", "FINISHED"];
export const ACTIVE_STAGES: Stage[] = ["DESIGN", "VIDEO_EDITING", "TESTING"];
export const ITEM_TYPES: ItemType[] = ["PRODUCT", "CATEGORY"];
export const CATEGORIES: ProductCategory[] = ["BOTH", "HUNTER", "SHOOTER"];
export const STATUSES: Status[] = [
  "ZU_ERLEDIGEN",
  "IN_BEARBEITUNG",
  "NEED_REVISION",
  "WAITING",
  "VOLLSTANDIG",
];
export const PRIORITIES: Priority[] = ["HIGH", "MEDIUM", "LOW"];

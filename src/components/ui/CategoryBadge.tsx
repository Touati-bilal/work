import type { ProductCategory, Priority } from "@/lib/types";
import { CATEGORY_META, PRIORITY_META } from "@/lib/constants";

export function CategoryBadge({ category, size = "md" }: { category: ProductCategory; size?: "sm" | "md" }) {
  const meta = CATEGORY_META[category];
  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold uppercase tracking-wide ${meta.classes} ${
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]"
      }`}
    >
      {meta.label}
    </span>
  );
}

export function PriorityBadge({ priority, size = "md" }: { priority: Priority; size?: "sm" | "md" }) {
  const meta = PRIORITY_META[priority];
  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${meta.classes} ${
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]"
      }`}
    >
      {meta.label} priority
    </span>
  );
}

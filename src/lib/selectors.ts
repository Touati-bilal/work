import type { AppData, Person, Product, Stage } from "@/lib/types";
import { isOverdue } from "@/lib/utils/date";

export function personById(data: AppData, id: string | null | undefined): Person | undefined {
  if (!id) return undefined;
  return data.people.find((p) => p.id === id);
}

/** The person currently responsible for a product, based on its current stage. */
export function currentAssignee(data: AppData, product: Product): Person | undefined {
  const id =
    product.stage === "VIDEO_EDITING"
      ? product.videoEditingPersonId
      : product.stage === "TESTING"
        ? product.testingPersonId
        : product.designPersonId;
  return personById(data, id);
}

export interface StageCounts {
  DESIGN: number;
  VIDEO_EDITING: number;
  TESTING: number;
  FINISHED: number;
}

export function emptyStageCounts(): StageCounts {
  return { DESIGN: 0, VIDEO_EDITING: 0, TESTING: 0, FINISHED: 0 };
}

export function countsByStage(products: Product[]): StageCounts {
  const counts = emptyStageCounts();
  for (const p of products) counts[p.stage]++;
  return counts;
}

export function activeProducts(products: Product[]): Product[] {
  return products.filter((p) => p.stage !== "FINISHED");
}

export function completedProducts(products: Product[]): Product[] {
  return products.filter((p) => p.stage === "FINISHED");
}

export function productsByStage(products: Product[], stage: Stage): Product[] {
  return products.filter((p) => p.stage === stage);
}

export function overdueProducts(products: Product[]): Product[] {
  return products.filter((p) => isOverdue(p.deadline, p.completedAt));
}

export function groupByStage(products: Product[]): Record<Stage, Product[]> {
  const groups = { DESIGN: [], VIDEO_EDITING: [], TESTING: [], FINISHED: [] } as Record<Stage, Product[]>;
  for (const p of products) groups[p.stage].push(p);
  return groups;
}

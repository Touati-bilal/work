import { SKU_PREFIX } from "@/lib/constants";

export function formatSku(counter: number): string {
  return `${SKU_PREFIX}${String(counter).padStart(3, "0")}`;
}

export function nextSkuFromExisting(skus: string[]): number {
  let max = 0;
  for (const sku of skus) {
    const match = sku.match(/DEN-(\d+)/);
    if (match) {
      const n = parseInt(match[1], 10);
      if (n > max) max = n;
    }
  }
  return max + 1;
}

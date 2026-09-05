import type { AppData } from "@/lib/types";
import { buildSeedData } from "@/lib/seed";
import { validateAppData } from "@/lib/data/validation";

/**
 * Storage abstraction. Swap this implementation for an API-backed repository
 * later without touching the rest of the app (DataProvider only calls
 * loadAppData / saveAppData).
 */
const STORAGE_KEY = "planin-work:data";

export function loadAppData(): AppData {
  if (typeof window === "undefined") {
    return buildSeedData();
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = buildSeedData();
      saveAppData(seeded);
      return seeded;
    }
    const parsed = JSON.parse(raw);
    const result = validateAppData(parsed);
    if (!result.valid || !result.data) {
      console.warn("Stored PLANIN WORK data failed validation, resetting to seed data.", result.errors);
      const seeded = buildSeedData();
      saveAppData(seeded);
      return seeded;
    }
    return result.data;
  } catch (err) {
    console.warn("Failed to load PLANIN WORK data, resetting to seed data.", err);
    const seeded = buildSeedData();
    saveAppData(seeded);
    return seeded;
  }
}

export function saveAppData(data: AppData): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("Failed to persist PLANIN WORK data.", err);
  }
}

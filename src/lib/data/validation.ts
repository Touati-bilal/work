import { z } from "zod";
import type { AppData } from "@/lib/types";
import { migrateAppDataShape } from "./migrate";

const categorySchema = z.enum(["BOTH", "HUNTER", "SHOOTER"]);
const statusSchema = z.enum([
  "ZU_ERLEDIGEN",
  "IN_BEARBEITUNG",
  "NEED_REVISION",
  "WAITING",
  "VOLLSTANDIG",
]);
const prioritySchema = z.enum(["LOW", "MEDIUM", "HIGH"]);
const researchStatusSchema = z.enum(["NEW", "IN_REVIEW", "SENT_TO_MANAGER", "REJECTED"]);
const groupSchema = z.enum(["PHOTO", "VIDEO", "TESTING", "RESEARCH", "MANAGEMENT"]);
const historyKindSchema = z.enum(["SYSTEM", "NOTE", "ISSUE", "CORRECTION"]);
const itemTypeSchema = z.enum(["PRODUCT", "CATEGORY"]);
const stageSchema = z.enum(["DESIGN", "VIDEO_EDITING", "TESTING", "FINISHED"]);

const historyEntrySchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  label: z.string(),
  status: statusSchema.optional(),
  stage: stageSchema.optional(),
  kind: historyKindSchema.optional(),
  authorPersonId: z.string().optional(),
});

const personSchema = z.object({
  id: z.string(),
  name: z.string(),
  handle: z.string(),
  group: groupSchema,
  active: z.boolean(),
});

const productSchema = z.object({
  id: z.string(),
  sku: z.string(),
  name: z.string(),
  itemType: itemTypeSchema,
  stage: stageSchema,
  designPersonId: z.string().nullable(),
  videoEditingPersonId: z.string().nullable(),
  testingPersonId: z.string().nullable(),
  givenByPersonId: z.string().nullable().optional(),
  createdAt: z.string(),
  stageEnteredAt: z.string(),
  deadline: z.string().optional(),
  completedAt: z.string().optional(),
  notes: z.string().optional(),
  history: z.array(historyEntrySchema),
  sourceResearchId: z.string().optional(),
});

const researchItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  sku: z.string().optional(),
  category: categorySchema,
  foundByPersonId: z.string(),
  foundAt: z.string(),
  status: researchStatusSchema,
  notes: z.string().optional(),
  url: z.string().optional(),
  source: z.string().optional(),
  priority: prioritySchema,
  sentToManagerProductId: z.string().optional(),
  history: z.array(historyEntrySchema),
});

const landingPageItemSchema = z.object({
  id: z.string(),
  productName: z.string(),
  sku: z.string().optional(),
  assignedPersonId: z.string().nullable(),
  status: statusSchema,
  deadline: z.string().optional(),
  notes: z.string().optional(),
  priority: prioritySchema,
  createdAt: z.string(),
  completedAt: z.string().optional(),
  history: z.array(historyEntrySchema),
});

export const appDataSchema = z.object({
  version: z.number(),
  people: z.array(personSchema),
  products: z.array(productSchema),
  research: z.array(researchItemSchema),
  landingPage: z.array(landingPageItemSchema),
  skuCounter: z.number(),
});

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  data?: AppData;
}

export function validateAppData(input: unknown): ValidationResult {
  const migrated = migrateAppDataShape(input);
  const result = appDataSchema.safeParse(migrated);
  if (!result.success) {
    return {
      valid: false,
      errors: result.error.issues.map((i) => `${i.path.join(".") || "root"}: ${i.message}`),
    };
  }
  return { valid: true, errors: [], data: result.data as AppData };
}

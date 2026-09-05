// Core domain types for PLANIN WORK

/** Used by Research and Landing Page items — unrelated to the Product pipeline. */
export type ProductCategory = "BOTH" | "HUNTER" | "SHOOTER";

/** Used by Landing Page items — unrelated to the Product pipeline. */
export type Status =
  | "ZU_ERLEDIGEN"
  | "IN_BEARBEITUNG"
  | "NEED_REVISION"
  | "WAITING"
  | "VOLLSTANDIG";

export type Priority = "LOW" | "MEDIUM" | "HIGH";

export type ResearchStatus =
  | "NEW"
  | "IN_REVIEW"
  | "SENT_TO_MANAGER"
  | "REJECTED";

export type PersonGroup = "PHOTO" | "VIDEO" | "TESTING" | "RESEARCH" | "MANAGEMENT";

export type HistoryKind = "SYSTEM" | "NOTE" | "ISSUE" | "CORRECTION";

/** PRODUCT flows Design -> Video Editing -> Testing -> Finished. CATEGORY stays in Design. */
export type ItemType = "PRODUCT" | "CATEGORY";

/** Linear production pipeline stage. */
export type Stage = "DESIGN" | "VIDEO_EDITING" | "TESTING" | "FINISHED";

export interface Person {
  id: string;
  name: string;
  handle: string;
  group: PersonGroup;
  active: boolean;
}

export interface HistoryEntry {
  id: string;
  timestamp: string; // ISO date string
  label: string;
  status?: Status;
  stage?: Stage;
  kind?: HistoryKind;
  authorPersonId?: string;
}

export interface Product {
  id: string;
  sku: string; // DEN-XXX — always uppercase
  name: string;
  itemType: ItemType;
  stage: Stage;
  designPersonId: string | null;
  videoEditingPersonId: string | null; // unused for CATEGORY items
  testingPersonId: string | null; // unused for CATEGORY items
  givenByPersonId?: string | null;
  createdAt: string;
  stageEnteredAt: string;
  deadline?: string;
  completedAt?: string;
  notes?: string;
  history: HistoryEntry[];
  sourceResearchId?: string;
}

export interface ResearchItem {
  id: string;
  name: string;
  sku?: string;
  category: ProductCategory;
  foundByPersonId: string;
  foundAt: string;
  status: ResearchStatus;
  notes?: string;
  url?: string;
  source?: string;
  priority: Priority;
  sentToManagerProductId?: string;
  history: HistoryEntry[];
}

export interface LandingPageItem {
  id: string;
  productName: string;
  sku?: string;
  assignedPersonId: string | null;
  status: Status;
  deadline?: string;
  notes?: string;
  priority: Priority;
  createdAt: string;
  completedAt?: string;
  history: HistoryEntry[];
}

export interface AppData {
  version: number;
  people: Person[];
  products: Product[];
  research: ResearchItem[];
  landingPage: LandingPageItem[];
  skuCounter: number;
}

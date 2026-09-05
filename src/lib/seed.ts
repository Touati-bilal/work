import { addDays, subDays } from "date-fns";
import type { AppData, HistoryEntry, LandingPageItem, Person, Product, ResearchItem, Stage } from "./types";
import { formatSku } from "./utils/sku";
import { generateId } from "./utils/id";

function h(label: string, daysAgo: number, stage?: Stage): HistoryEntry {
  return {
    id: generateId(),
    timestamp: subDays(new Date(), daysAgo).toISOString(),
    label,
    stage,
  };
}

export const SEED_PEOPLE: Person[] = [
  { id: "uzma", name: "Uzma", handle: "@Uzma", group: "PHOTO", active: true },
  { id: "edgar-niembro", name: "Edgar Niembro", handle: "@Edgar Niembro", group: "VIDEO", active: true },
  { id: "nabeel-khan", name: "Nabeel Khan", handle: "@Nabeel Khan", group: "VIDEO", active: true },
  { id: "nawaz-khan", name: "Nawaz Khan", handle: "@Nawaz Khan", group: "VIDEO", active: true },
  { id: "nita", name: "NITA", handle: "@NITA", group: "TESTING", active: true },
  { id: "bilal", name: "Bilal", handle: "@Bilal", group: "RESEARCH", active: true },
];

function buildSeedProducts(): Product[] {
  const defs: Array<{
    sku: string;
    name: string;
    itemType: "PRODUCT" | "CATEGORY";
    stage: Stage;
    designPersonId: string | null;
    videoEditingPersonId: string | null;
    testingPersonId: string | null;
    createdDaysAgo: number;
    deadlineDaysFromNow?: number;
    completedDaysAgo?: number;
    notes?: string;
  }> = [
    { sku: formatSku(101), name: "Compound Bow Sight Mount", itemType: "PRODUCT", stage: "DESIGN", designPersonId: "uzma", videoEditingPersonId: "edgar-niembro", testingPersonId: "nita", createdDaysAgo: 5, deadlineDaysFromNow: -1, notes: "Background not clean, redo cutout" },
    { sku: formatSku(102), name: "Tactical Red Dot Scope", itemType: "PRODUCT", stage: "DESIGN", designPersonId: "uzma", videoEditingPersonId: "nabeel-khan", testingPersonId: "nita", createdDaysAgo: 1, deadlineDaysFromNow: 3 },
    { sku: formatSku(103), name: "All-Weather Duck Call", itemType: "CATEGORY", stage: "DESIGN", designPersonId: "uzma", videoEditingPersonId: null, testingPersonId: null, createdDaysAgo: 2, deadlineDaysFromNow: 2 },
    { sku: formatSku(104), name: "Rangefinder Binoculars 10x42", itemType: "PRODUCT", stage: "VIDEO_EDITING", designPersonId: "uzma", videoEditingPersonId: "edgar-niembro", testingPersonId: "nita", createdDaysAgo: 6, deadlineDaysFromNow: -2, notes: "Audio sync off in intro clip" },
    { sku: formatSku(105), name: "Shooting Range Ear Muffs", itemType: "PRODUCT", stage: "VIDEO_EDITING", designPersonId: "uzma", videoEditingPersonId: "nabeel-khan", testingPersonId: "nita", createdDaysAgo: 1, deadlineDaysFromNow: 5 },
    { sku: formatSku(106), name: "Ghillie Suit Camo Poncho", itemType: "CATEGORY", stage: "FINISHED", designPersonId: "uzma", videoEditingPersonId: null, testingPersonId: null, createdDaysAgo: 3, deadlineDaysFromNow: 4, completedDaysAgo: 1 },
    { sku: formatSku(107), name: "Trail Camera 4K", itemType: "PRODUCT", stage: "TESTING", designPersonId: "uzma", videoEditingPersonId: "nawaz-khan", testingPersonId: "nita", createdDaysAgo: 4, notes: "Waiting on durability pass" },
    { sku: formatSku(108), name: "Adjustable Gun Cleaning Kit", itemType: "PRODUCT", stage: "TESTING", designPersonId: "uzma", videoEditingPersonId: "edgar-niembro", testingPersonId: "nita", createdDaysAgo: 5, deadlineDaysFromNow: -1, notes: "Latch mechanism failed durability test" },
    { sku: formatSku(109), name: "Hunting Backpack 45L", itemType: "PRODUCT", stage: "DESIGN", designPersonId: "uzma", videoEditingPersonId: "nawaz-khan", testingPersonId: "nita", createdDaysAgo: 1, deadlineDaysFromNow: 6 },
    { sku: formatSku(110), name: "Precision Shooting Bipod", itemType: "PRODUCT", stage: "VIDEO_EDITING", designPersonId: "uzma", videoEditingPersonId: "nabeel-khan", testingPersonId: "nita", createdDaysAgo: 2, deadlineDaysFromNow: 1 },
    { sku: formatSku(111), name: "Camo Face Paint Kit", itemType: "PRODUCT", stage: "FINISHED", designPersonId: "uzma", videoEditingPersonId: "edgar-niembro", testingPersonId: "nita", createdDaysAgo: 10, completedDaysAgo: 2 },
    { sku: formatSku(112), name: "Electronic Hearing Protection", itemType: "PRODUCT", stage: "FINISHED", designPersonId: "uzma", videoEditingPersonId: "nawaz-khan", testingPersonId: "nita", createdDaysAgo: 9, completedDaysAgo: 1 },
  ];

  return defs.map((d) => {
    const history: HistoryEntry[] = [h("Created", d.createdDaysAgo, "DESIGN"), h(`Design stage started — assigned to @${d.designPersonId}`, d.createdDaysAgo, "DESIGN")];
    if (d.stage !== "DESIGN") {
      history.push(h("Design completed", Math.max(0, d.createdDaysAgo - 1), "DESIGN"));
      history.push(h(`${d.stage === "FINISHED" ? "Video Editing" : "Video Editing"} stage started`, Math.max(0, d.createdDaysAgo - 1), "VIDEO_EDITING"));
    }
    if (d.stage === "TESTING" || d.stage === "FINISHED") {
      history.push(h("Video Editing completed", Math.max(0, d.createdDaysAgo - 1), "VIDEO_EDITING"));
      history.push(h("Testing stage started", Math.max(0, d.createdDaysAgo - 1), "TESTING"));
    }
    if (d.completedDaysAgo !== undefined) {
      history.push(h("Testing completed", d.completedDaysAgo, "TESTING"));
      history.push(h("Product Finished", d.completedDaysAgo, "FINISHED"));
    }
    return {
      id: generateId(),
      sku: d.sku,
      name: d.name,
      itemType: d.itemType,
      stage: d.stage,
      designPersonId: d.designPersonId,
      videoEditingPersonId: d.videoEditingPersonId,
      testingPersonId: d.testingPersonId,
      givenByPersonId: null,
      createdAt: subDays(new Date(), d.createdDaysAgo).toISOString(),
      stageEnteredAt: subDays(new Date(), Math.max(0, d.createdDaysAgo - 1)).toISOString(),
      deadline: d.deadlineDaysFromNow !== undefined ? addDays(new Date(), d.deadlineDaysFromNow).toISOString() : undefined,
      completedAt: d.completedDaysAgo !== undefined ? subDays(new Date(), d.completedDaysAgo).toISOString() : undefined,
      notes: d.notes,
      history,
    } satisfies Product;
  });
}

function buildSeedResearch(): ResearchItem[] {
  const rows: Array<Pick<ResearchItem, "name" | "category" | "priority" | "status" | "source" | "notes">> = [
    { name: "Folding Hunting Knife Set", category: "HUNTER", priority: "HIGH", status: "NEW", source: "AliExpress", notes: "Good margins, need supplier quote" },
    { name: "Laser Bore Sight Kit", category: "SHOOTER", priority: "MEDIUM", status: "IN_REVIEW", source: "Alibaba" },
    { name: "Multi-Terrain Tent 2P", category: "BOTH", priority: "LOW", status: "NEW", source: "1688" },
  ];
  return rows.map((r, i) => ({
    id: generateId(),
    name: r.name,
    category: r.category,
    foundByPersonId: "bilal",
    foundAt: subDays(new Date(), i + 1).toISOString(),
    status: r.status,
    notes: r.notes,
    source: r.source,
    priority: r.priority,
    history: [h("Added to Research", i + 1)],
  }));
}

function buildSeedLandingPage(): LandingPageItem[] {
  const rows: Array<Pick<LandingPageItem, "productName" | "sku" | "assignedPersonId" | "status" | "priority" | "notes">> = [
    { productName: "Rangefinder Binoculars 10x42", sku: formatSku(104), assignedPersonId: "bilal", status: "IN_BEARBEITUNG", priority: "HIGH", notes: "Needs new hero banner copy" },
    { productName: "Trail Camera 4K", sku: formatSku(107), assignedPersonId: "bilal", status: "ZU_ERLEDIGEN", priority: "MEDIUM" },
  ];
  return rows.map((r, i) => ({
    id: generateId(),
    productName: r.productName,
    sku: r.sku,
    assignedPersonId: r.assignedPersonId,
    status: r.status,
    priority: r.priority,
    notes: r.notes,
    createdAt: subDays(new Date(), i + 2).toISOString(),
    deadline: addDays(new Date(), 3 - i).toISOString(),
    history: [h("Created", i + 2)],
  }));
}

export function buildSeedData(): AppData {
  const products = buildSeedProducts();
  return {
    version: 1,
    people: SEED_PEOPLE,
    products,
    research: buildSeedResearch(),
    landingPage: buildSeedLandingPage(),
    skuCounter: 113,
  };
}

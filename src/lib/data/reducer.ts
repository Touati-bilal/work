import type {
  AppData,
  HistoryKind,
  ItemType,
  LandingPageItem,
  Person,
  PersonGroup,
  Priority,
  Product,
  ProductCategory,
  ResearchItem,
  Stage,
  Status,
} from "@/lib/types";
import { generateId } from "@/lib/utils/id";
import { nowIso } from "@/lib/utils/date";
import { formatSku } from "@/lib/utils/sku";
import { STAGE_META, STATUS_META } from "@/lib/constants";

export interface NewProductInput {
  name: string;
  itemType: ItemType;
  designPersonId: string | null;
  videoEditingPersonId?: string | null;
  testingPersonId?: string | null;
  givenByPersonId?: string | null;
  deadline?: string;
  notes?: string;
  sourceResearchId?: string;
  sku?: string;
}

export interface NewResearchInput {
  name: string;
  category: ProductCategory;
  foundByPersonId: string;
  notes?: string;
  url?: string;
  source?: string;
  priority: Priority;
}

export interface NewLandingInput {
  productName: string;
  sku?: string;
  assignedPersonId: string | null;
  priority: Priority;
  deadline?: string;
  notes?: string;
  status?: Status;
}

export interface NewPersonInput {
  name: string;
  handle?: string;
  group: PersonGroup;
}

export type DataAction =
  | { type: "IMPORT"; data: AppData }
  | { type: "ADD_PRODUCT"; input: NewProductInput }
  | {
      type: "UPDATE_PRODUCT";
      id: string;
      patch: Partial<
        Pick<
          Product,
          "name" | "designPersonId" | "videoEditingPersonId" | "testingPersonId" | "givenByPersonId" | "deadline" | "notes"
        >
      >;
    }
  | { type: "COMPLETE_STAGE"; id: string }
  | { type: "ADD_PRODUCT_NOTE"; id: string; text: string; kind: HistoryKind; authorPersonId?: string }
  | { type: "DELETE_PRODUCT"; id: string }
  | { type: "ADD_PERSON"; input: NewPersonInput }
  | { type: "ADD_RESEARCH"; input: NewResearchInput }
  | {
      type: "UPDATE_RESEARCH";
      id: string;
      patch: Partial<Pick<ResearchItem, "name" | "category" | "notes" | "url" | "source" | "priority" | "status">>;
    }
  | { type: "DELETE_RESEARCH"; id: string }
  | {
      type: "SEND_RESEARCH_TO_MANAGER";
      id: string;
      itemType: ItemType;
      designPersonId: string | null;
      videoEditingPersonId?: string | null;
      testingPersonId?: string | null;
      deadline?: string;
    }
  | { type: "ADD_LANDING"; input: NewLandingInput }
  | {
      type: "UPDATE_LANDING";
      id: string;
      patch: Partial<Pick<LandingPageItem, "productName" | "sku" | "assignedPersonId" | "priority" | "deadline" | "notes">>;
    }
  | { type: "SET_LANDING_STATUS"; id: string; status: Status }
  | { type: "DELETE_LANDING"; id: string };

function withNextSku(data: AppData, explicit?: string): { sku: string; counter: number } {
  if (explicit && explicit.trim().length > 0) {
    const sku = explicit.trim().toUpperCase();
    const match = sku.match(/(\d+)$/);
    // Keep the auto-counter ahead of any manually entered number so future auto-generated SKUs never collide with it.
    const counter = match ? Math.max(data.skuCounter, parseInt(match[1], 10) + 1) : data.skuCounter;
    return { sku, counter };
  }
  return { sku: formatSku(data.skuCounter), counter: data.skuCounter + 1 };
}

function personHandle(data: AppData, id: string | null | undefined): string | null {
  if (!id) return null;
  return data.people.find((p) => p.id === id)?.handle ?? null;
}

function nextStage(itemType: ItemType, stage: Stage): Stage | null {
  if (itemType === "CATEGORY") {
    return stage === "DESIGN" ? "FINISHED" : null;
  }
  if (stage === "DESIGN") return "VIDEO_EDITING";
  if (stage === "VIDEO_EDITING") return "TESTING";
  if (stage === "TESTING") return "FINISHED";
  return null;
}

function stageAssignee(product: Pick<Product, "designPersonId" | "videoEditingPersonId" | "testingPersonId">, stage: Stage): string | null {
  if (stage === "VIDEO_EDITING") return product.videoEditingPersonId;
  if (stage === "TESTING") return product.testingPersonId;
  return product.designPersonId;
}

export function dataReducer(data: AppData, action: DataAction): AppData {
  switch (action.type) {
    case "IMPORT": {
      return action.data;
    }

    case "ADD_PRODUCT": {
      const { input } = action;
      const { sku, counter } = withNextSku(data, input.sku);
      const timestamp = nowIso();
      const designHandle = personHandle(data, input.designPersonId);
      const product: Product = {
        id: generateId(),
        sku,
        name: input.name,
        itemType: input.itemType,
        stage: "DESIGN",
        designPersonId: input.designPersonId,
        videoEditingPersonId: input.itemType === "PRODUCT" ? (input.videoEditingPersonId ?? null) : null,
        testingPersonId: input.itemType === "PRODUCT" ? (input.testingPersonId ?? null) : null,
        givenByPersonId: input.givenByPersonId ?? null,
        createdAt: timestamp,
        stageEnteredAt: timestamp,
        deadline: input.deadline,
        notes: input.notes,
        sourceResearchId: input.sourceResearchId,
        history: [
          { id: generateId(), timestamp, label: "Created", stage: "DESIGN" },
          {
            id: generateId(),
            timestamp,
            label: `Design stage started${designHandle ? ` — assigned to ${designHandle}` : ""}`,
            stage: "DESIGN",
          },
        ],
      };
      return { ...data, products: [product, ...data.products], skuCounter: counter };
    }

    case "UPDATE_PRODUCT": {
      const timestamp = nowIso();
      return {
        ...data,
        products: data.products.map((p) => {
          if (p.id !== action.id) return p;
          const history = [...p.history];
          const patch: Partial<Product> = { ...action.patch };

          (["designPersonId", "videoEditingPersonId", "testingPersonId"] as const).forEach((field) => {
            if (action.patch[field] !== undefined && action.patch[field] !== p[field]) {
              const handle = personHandle(data, action.patch[field]);
              const stageLabel = field === "designPersonId" ? "Design" : field === "videoEditingPersonId" ? "Video Editing" : "Testing";
              history.push({
                id: generateId(),
                timestamp,
                label: handle ? `${stageLabel} reassigned to ${handle}` : `${stageLabel} unassigned`,
              });
            }
          });

          if (action.patch.deadline !== undefined && action.patch.deadline !== p.deadline) {
            history.push({ id: generateId(), timestamp, label: "Deadline updated" });
          }
          return { ...p, ...patch, history };
        }),
      };
    }

    case "COMPLETE_STAGE": {
      const product = data.products.find((p) => p.id === action.id);
      if (!product || product.stage === "FINISHED") return data;
      const upcoming = nextStage(product.itemType, product.stage);
      if (!upcoming) return data;

      const timestamp = nowIso();
      const completedBy = personHandle(data, stageAssignee(product, product.stage));
      const history = [
        ...product.history,
        {
          id: generateId(),
          timestamp,
          label: `${STAGE_META[product.stage].label} completed${completedBy ? ` by ${completedBy}` : ""}`,
          stage: product.stage,
        },
      ];

      if (upcoming !== "FINISHED") {
        const nextHandle = personHandle(data, stageAssignee(product, upcoming));
        history.push({
          id: generateId(),
          timestamp,
          label: `${STAGE_META[upcoming].label} stage started${nextHandle ? ` — assigned to ${nextHandle}` : ""}`,
          stage: upcoming,
        });
      } else {
        history.push({ id: generateId(), timestamp, label: "Product Finished", stage: "FINISHED" });
      }

      return {
        ...data,
        products: data.products.map((p) =>
          p.id !== product.id
            ? p
            : {
                ...p,
                stage: upcoming,
                stageEnteredAt: timestamp,
                completedAt: upcoming === "FINISHED" ? timestamp : undefined,
                history,
              }
        ),
      };
    }

    case "ADD_PRODUCT_NOTE": {
      const timestamp = nowIso();
      return {
        ...data,
        products: data.products.map((p) =>
          p.id !== action.id
            ? p
            : {
                ...p,
                history: [
                  ...p.history,
                  { id: generateId(), timestamp, label: action.text, kind: action.kind, authorPersonId: action.authorPersonId },
                ],
              }
        ),
      };
    }

    case "DELETE_PRODUCT": {
      return { ...data, products: data.products.filter((p) => p.id !== action.id) };
    }

    case "ADD_PERSON": {
      const { input } = action;
      const person: Person = {
        id: generateId(),
        name: input.name,
        handle: input.handle?.trim() || `@${input.name}`,
        group: input.group,
        active: true,
      };
      return { ...data, people: [...data.people, person] };
    }

    case "ADD_RESEARCH": {
      const { input } = action;
      const timestamp = nowIso();
      const item: ResearchItem = {
        id: generateId(),
        name: input.name,
        category: input.category,
        foundByPersonId: input.foundByPersonId,
        foundAt: timestamp,
        status: "NEW",
        notes: input.notes,
        url: input.url,
        source: input.source,
        priority: input.priority,
        history: [{ id: generateId(), timestamp, label: "Added to Research" }],
      };
      return { ...data, research: [item, ...data.research] };
    }

    case "UPDATE_RESEARCH": {
      const timestamp = nowIso();
      return {
        ...data,
        research: data.research.map((r) => {
          if (r.id !== action.id) return r;
          const history = [...r.history];
          if (action.patch.status && action.patch.status !== r.status) {
            history.push({ id: generateId(), timestamp, label: `Research status: ${action.patch.status.replace(/_/g, " ")}` });
          }
          return { ...r, ...action.patch, history };
        }),
      };
    }

    case "DELETE_RESEARCH": {
      return { ...data, research: data.research.filter((r) => r.id !== action.id) };
    }

    case "SEND_RESEARCH_TO_MANAGER": {
      const research = data.research.find((r) => r.id === action.id);
      if (!research) return data;
      const { sku, counter } = withNextSku(data, research.sku);
      const timestamp = nowIso();
      const designHandle = personHandle(data, action.designPersonId);
      const product: Product = {
        id: generateId(),
        sku,
        name: research.name,
        itemType: action.itemType,
        stage: "DESIGN",
        designPersonId: action.designPersonId,
        videoEditingPersonId: action.itemType === "PRODUCT" ? (action.videoEditingPersonId ?? null) : null,
        testingPersonId: action.itemType === "PRODUCT" ? (action.testingPersonId ?? null) : null,
        createdAt: timestamp,
        stageEnteredAt: timestamp,
        deadline: action.deadline,
        notes: research.notes,
        sourceResearchId: research.id,
        history: [
          {
            id: generateId(),
            timestamp,
            label: `Sent from Research (found by ${personHandle(data, research.foundByPersonId) ?? "unknown"})`,
            stage: "DESIGN",
          },
          {
            id: generateId(),
            timestamp,
            label: `Design stage started${designHandle ? ` — assigned to ${designHandle}` : ""}`,
            stage: "DESIGN",
          },
        ],
      };
      return {
        ...data,
        skuCounter: counter,
        products: [product, ...data.products],
        research: data.research.map((r) =>
          r.id === action.id
            ? {
                ...r,
                status: "SENT_TO_MANAGER",
                sku,
                sentToManagerProductId: product.id,
                history: [...r.history, { id: generateId(), timestamp, label: `Sent to Manager as ${sku}` }],
              }
            : r
        ),
      };
    }

    case "ADD_LANDING": {
      const { input } = action;
      const timestamp = nowIso();
      const status = input.status ?? "ZU_ERLEDIGEN";
      const item: LandingPageItem = {
        id: generateId(),
        productName: input.productName,
        sku: input.sku,
        assignedPersonId: input.assignedPersonId,
        status,
        priority: input.priority,
        deadline: input.deadline,
        notes: input.notes,
        createdAt: timestamp,
        history: [{ id: generateId(), timestamp, label: "Created", status }],
      };
      return { ...data, landingPage: [item, ...data.landingPage] };
    }

    case "UPDATE_LANDING": {
      const timestamp = nowIso();
      return {
        ...data,
        landingPage: data.landingPage.map((l) => {
          if (l.id !== action.id) return l;
          const history = [...l.history];
          if (action.patch.assignedPersonId !== undefined && action.patch.assignedPersonId !== l.assignedPersonId) {
            const handle = personHandle(data, action.patch.assignedPersonId);
            history.push({ id: generateId(), timestamp, label: handle ? `Reassigned to ${handle}` : "Unassigned" });
          }
          return { ...l, ...action.patch, history };
        }),
      };
    }

    case "SET_LANDING_STATUS": {
      const timestamp = nowIso();
      return {
        ...data,
        landingPage: data.landingPage.map((l) => {
          if (l.id !== action.id || l.status === action.status) return l;
          const label = `Status changed to ${STATUS_META[action.status].label}`;
          return {
            ...l,
            status: action.status,
            completedAt: action.status === "VOLLSTANDIG" ? timestamp : undefined,
            history: [...l.history, { id: generateId(), timestamp, label, status: action.status }],
          };
        }),
      };
    }

    case "DELETE_LANDING": {
      return { ...data, landingPage: data.landingPage.filter((l) => l.id !== action.id) };
    }

    default:
      return data;
  }
}

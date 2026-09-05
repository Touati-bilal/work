"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import type { AppData, HistoryKind, ItemType, LandingPageItem, ResearchItem, Status, Product } from "@/lib/types";
import {
  dataReducer,
  type DataAction,
  type NewLandingInput,
  type NewPersonInput,
  type NewProductInput,
  type NewResearchInput,
} from "./reducer";
import { loadAppData, saveAppData } from "./storage";
import { buildSeedData } from "@/lib/seed";

type ProductPatch = Partial<
  Pick<Product, "name" | "designPersonId" | "videoEditingPersonId" | "testingPersonId" | "givenByPersonId" | "deadline" | "notes">
>;
type ResearchPatch = Partial<Pick<ResearchItem, "name" | "category" | "notes" | "url" | "source" | "priority" | "status">>;
type LandingPatch = Partial<Pick<LandingPageItem, "productName" | "sku" | "assignedPersonId" | "priority" | "deadline" | "notes">>;

interface DataContextValue {
  data: AppData;
  ready: boolean;
  dispatch: (action: DataAction) => void;
  addProduct: (input: NewProductInput) => void;
  updateProduct: (id: string, patch: ProductPatch) => void;
  completeStage: (id: string) => void;
  addProductNote: (id: string, text: string, kind: HistoryKind, authorPersonId?: string) => void;
  deleteProduct: (id: string) => void;
  addPerson: (input: NewPersonInput) => void;
  addResearch: (input: NewResearchInput) => void;
  updateResearch: (id: string, patch: ResearchPatch) => void;
  deleteResearch: (id: string) => void;
  sendResearchToManager: (
    id: string,
    opts: {
      itemType: ItemType;
      designPersonId: string | null;
      videoEditingPersonId?: string | null;
      testingPersonId?: string | null;
      deadline?: string;
    }
  ) => void;
  addLanding: (input: NewLandingInput) => void;
  updateLanding: (id: string, patch: LandingPatch) => void;
  setLandingStatus: (id: string, status: Status) => void;
  deleteLanding: (id: string) => void;
  importData: (data: AppData) => void;
  exportData: () => AppData;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, dispatch] = useReducer(dataReducer, undefined, () => buildSeedData());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // One-time sync from localStorage on mount (client-only external system;
    // server-rendered seed data must stay stable until hydration completes).
    dispatch({ type: "IMPORT", data: loadAppData() });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveAppData(data);
  }, [data, ready]);

  const value = useMemo<DataContextValue>(
    () => ({
      data,
      ready,
      dispatch,
      addProduct: (input) => dispatch({ type: "ADD_PRODUCT", input }),
      updateProduct: (id, patch) => dispatch({ type: "UPDATE_PRODUCT", id, patch }),
      completeStage: (id) => dispatch({ type: "COMPLETE_STAGE", id }),
      addProductNote: (id, text, kind, authorPersonId) => dispatch({ type: "ADD_PRODUCT_NOTE", id, text, kind, authorPersonId }),
      deleteProduct: (id) => dispatch({ type: "DELETE_PRODUCT", id }),
      addPerson: (input) => dispatch({ type: "ADD_PERSON", input }),
      addResearch: (input) => dispatch({ type: "ADD_RESEARCH", input }),
      updateResearch: (id, patch) => dispatch({ type: "UPDATE_RESEARCH", id, patch }),
      deleteResearch: (id) => dispatch({ type: "DELETE_RESEARCH", id }),
      sendResearchToManager: (id, opts) => dispatch({ type: "SEND_RESEARCH_TO_MANAGER", id, ...opts }),
      addLanding: (input) => dispatch({ type: "ADD_LANDING", input }),
      updateLanding: (id, patch) => dispatch({ type: "UPDATE_LANDING", id, patch }),
      setLandingStatus: (id, status) => dispatch({ type: "SET_LANDING_STATUS", id, status }),
      deleteLanding: (id) => dispatch({ type: "DELETE_LANDING", id }),
      importData: (imported) => dispatch({ type: "IMPORT", data: imported }),
      exportData: () => data,
    }),
    [data, ready]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within a DataProvider");
  return ctx;
}

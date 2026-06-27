"use client";

import { create } from "zustand";
import {
  baseModels,
  optionGroups,
  swatchById,
  type BaseModel,
  type Choice,
  type Swatch,
} from "./options";

type Selection = Record<string, string>; // groupId -> choiceId/swatchId

function defaultSelection(): Selection {
  const sel: Selection = {};
  for (const g of optionGroups) sel[g.id] = g.defaultId;
  return sel;
}

interface ConfigState {
  modelId: string;
  selection: Selection;
  setModel: (id: string) => void;
  select: (groupId: string, choiceId: string) => void;
  reset: () => void;
  randomize: () => void;
}

export const useConfig = create<ConfigState>((set) => ({
  modelId: baseModels[0].id,
  selection: defaultSelection(),
  setModel: (id) => set({ modelId: id }),
  select: (groupId, choiceId) =>
    set((s) => ({ selection: { ...s.selection, [groupId]: choiceId } })),
  reset: () => set({ modelId: baseModels[0].id, selection: defaultSelection() }),
  randomize: () =>
    set(() => {
      const sel: Selection = {};
      for (const g of optionGroups) {
        const pool = g.type === "paint" ? g.swatches! : g.choices!;
        // deterministic-ish spread based on group id length so SSR stays calm
        const idx = Math.floor((g.id.length * 7 + g.label.length * 3) % pool.length);
        sel[g.id] = (pool[idx] as { id: string }).id;
      }
      return {
        modelId: baseModels[(optionGroups.length * 2) % baseModels.length].id,
        selection: sel,
      };
    }),
}));

// ── Derived selectors (pure helpers) ────────────────────────────────────────

export interface BuildLine {
  groupId: string;
  label: string;
  value: string;
  brand?: string;
  price: number;
}

export function getModel(modelId: string): BaseModel {
  return baseModels.find((m) => m.id === modelId) ?? baseModels[0];
}

export function getChoice(groupId: string, choiceId: string): Choice | undefined {
  const g = optionGroups.find((x) => x.id === groupId);
  return g?.choices?.find((c) => c.id === choiceId);
}

export function getSwatch(swatchId: string): Swatch | undefined {
  return swatchById(swatchId);
}

export function buildLines(modelId: string, selection: Selection): BuildLine[] {
  const lines: BuildLine[] = [];
  for (const g of optionGroups) {
    const id = selection[g.id];
    if (g.type === "paint") {
      const sw = swatchById(id);
      if (!sw) continue;
      lines.push({ groupId: g.id, label: g.label, value: `${sw.name} (${sw.finish})`, price: sw.price });
    } else {
      const c = g.choices?.find((x) => x.id === id);
      if (!c) continue;
      lines.push({ groupId: g.id, label: g.label, value: c.name, brand: c.brand, price: c.price });
    }
  }
  return lines;
}

export function totalPrice(modelId: string, selection: Selection): number {
  const base = getModel(modelId).basePrice;
  const opts = buildLines(modelId, selection).reduce((s, l) => s + l.price, 0);
  return base + opts;
}

export function optionsTotal(modelId: string, selection: Selection): number {
  return buildLines(modelId, selection).reduce((s, l) => s + l.price, 0);
}

export const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

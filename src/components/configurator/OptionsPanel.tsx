"use client";

import { useState } from "react";
import { optionGroups, baseModels } from "@/lib/configurator/options";
import { useConfig, fmt } from "@/lib/configurator/store";
import { OptIcon } from "./icons";

export default function OptionsPanel() {
  const { modelId, selection, setModel, select } = useConfig();
  const [open, setOpen] = useState<string | null>("paint-body");

  return (
    <div className="flex flex-col">
      {/* Model picker */}
      <div className="p-4 border-b border-line bg-paper">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-3 flex items-center gap-2">
          <OptIcon name="truck" /> Base Truck
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {baseModels.map((m) => {
            const active = m.id === modelId;
            return (
              <button
                key={m.id}
                onClick={() => setModel(m.id)}
                className={`text-left p-2.5 border transition-all ${
                  active
                    ? "border-brand bg-brand/5 ring-1 ring-brand"
                    : "border-line hover:border-ink/40 bg-white"
                }`}
              >
                <div className="text-[0.7rem] font-bold uppercase text-muted">{m.make}</div>
                <div className="text-sm font-bold text-ink leading-tight">{m.model}</div>
                <div className="text-[0.68rem] text-muted truncate">{m.trim}</div>
                <div className="text-xs font-bold text-brand mt-1">{fmt(m.basePrice)}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Option accordion */}
      <div className="divide-y divide-line">
        {optionGroups.map((g) => {
          const isOpen = open === g.id;
          const selId = selection[g.id];
          let summary = "";
          let priceLabel = "";
          if (g.type === "paint") {
            const sw = g.swatches!.find((s) => s.id === selId)!;
            summary = sw?.name ?? "";
            priceLabel = sw && sw.price > 0 ? `+${fmt(sw.price)}` : "Included";
          } else {
            const c = g.choices!.find((x) => x.id === selId)!;
            summary = c?.name ?? "";
            priceLabel = c && c.price > 0 ? `+${fmt(c.price)}` : "Included";
          }

          return (
            <div key={g.id} className="bg-paper">
              <button
                onClick={() => setOpen(isOpen ? null : g.id)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-canvas/60 transition-colors"
              >
                <span className={`grid place-items-center w-9 h-9 rounded-sm shrink-0 ${isOpen ? "bg-brand text-white" : "bg-canvas text-ink"}`}>
                  <OptIcon name={g.icon} className="w-5 h-5" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-xs font-bold uppercase tracking-wide text-ink">{g.label}</span>
                  <span className="block text-xs text-muted truncate">{summary}</span>
                </span>
                <span className={`text-xs font-bold shrink-0 ${priceLabel === "Included" ? "text-muted" : "text-brand"}`}>
                  {priceLabel}
                </span>
                <svg className={`w-4 h-4 text-muted transition-transform shrink-0 ${isOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {isOpen && (
                <div className="px-4 pb-4">
                  {g.type === "paint" ? (
                    <div className="grid grid-cols-5 gap-2.5 pt-1">
                      {g.swatches!.map((sw) => {
                        const active = sw.id === selId;
                        return (
                          <button
                            key={sw.id}
                            onClick={() => select(g.id, sw.id)}
                            title={`${sw.name} · ${sw.finish}${sw.price ? ` · +${fmt(sw.price)}` : ""}`}
                            className="group flex flex-col items-center gap-1"
                          >
                            <span
                              className={`w-full aspect-square rounded-full border-2 transition-all ${
                                active ? "ring-2 ring-brand ring-offset-2 border-white" : "border-white/60 group-hover:scale-105"
                              }`}
                              style={{
                                background:
                                  sw.finish === "matte"
                                    ? sw.hex
                                    : `radial-gradient(circle at 32% 28%, #ffffffaa, transparent 42%), ${sw.hex}`,
                                boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.15)",
                              }}
                            />
                            <span className="text-[0.6rem] text-center leading-tight text-muted line-clamp-2">
                              {sw.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-2 pt-1">
                      {g.choices!.map((c) => {
                        const active = c.id === selId;
                        return (
                          <button
                            key={c.id}
                            onClick={() => select(g.id, c.id)}
                            className={`w-full flex items-center gap-3 p-3 border text-left transition-all ${
                              active ? "border-brand bg-brand/5 ring-1 ring-brand" : "border-line hover:border-ink/40 bg-white"
                            }`}
                          >
                            <span className={`w-4 h-4 rounded-full border-2 grid place-items-center shrink-0 ${active ? "border-brand" : "border-line"}`}>
                              {active && <span className="w-2 h-2 rounded-full bg-brand" />}
                            </span>
                            <span className="flex-1 min-w-0">
                              <span className="flex items-center gap-2">
                                <span className="text-sm font-bold text-ink">{c.name}</span>
                                {c.brand && (
                                  <span className="text-[0.62rem] uppercase font-bold text-muted bg-canvas px-1.5 py-0.5 rounded">
                                    {c.brand}
                                  </span>
                                )}
                              </span>
                              {c.desc && <span className="block text-xs text-muted truncate">{c.desc}</span>}
                            </span>
                            <span className={`text-xs font-bold shrink-0 ${c.price > 0 ? "text-brand" : "text-muted"}`}>
                              {c.price > 0 ? `+${fmt(c.price)}` : "Incl."}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

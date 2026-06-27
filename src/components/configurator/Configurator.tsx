"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import {
  useConfig,
  getModel,
  totalPrice,
  optionsTotal,
  fmt,
} from "@/lib/configurator/store";
import OptionsPanel from "./OptionsPanel";
import QuoteModal from "./QuoteModal";

const TruckStage = dynamic(() => import("./WattsPhotoStage"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full grid place-items-center bg-[#dfe4ea] text-ink/40 text-xs uppercase tracking-widest">
      Loading builder…
    </div>
  ),
});

export default function Configurator() {
  const { modelId, selection, reset, randomize } = useConfig();
  const model = getModel(modelId);
  const total = totalPrice(modelId, selection);
  const opts = optionsTotal(modelId, selection);
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <div className="bg-ink">
      <div className="mx-auto max-w-[1600px] grid lg:grid-cols-[1fr_420px]">
        {/* ===== 2D Viewer ===== */}
        <div className="relative h-[52vh] lg:h-[calc(100vh-110px)] lg:sticky lg:top-[110px]">
          <TruckStage />

          {/* Overlay: model badge */}
          <div className="absolute top-4 left-4 text-ink pointer-events-none">
            <p className="text-[0.7rem] uppercase tracking-widest text-brand font-bold">
              {model.fuel} · {model.dually ? "Dually" : "4WD"}
            </p>
            <h2 className="display text-2xl md:text-3xl">
              {model.make} {model.model}
            </h2>
            <p className="text-xs text-ink/60">{model.blurb}</p>
          </div>

          {/* Overlay: controls */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={randomize}
              className="bg-ink/10 hover:bg-ink/20 backdrop-blur text-ink text-xs font-bold uppercase tracking-wide px-3 py-2 transition-colors"
            >
              Surprise Me
            </button>
            <button
              onClick={reset}
              className="bg-ink/10 hover:bg-ink/20 backdrop-blur text-ink text-xs font-bold uppercase tracking-wide px-3 py-2 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* ===== Options + price ===== */}
        <div className="bg-canvas flex flex-col lg:h-[calc(100vh-110px)]">
          <div className="px-5 py-4 bg-paper border-b border-line">
            <p className="text-xs uppercase tracking-widest text-muted font-bold">Build Your Truck</p>
            <h1 className="display text-2xl text-ink">Custom Truck Builder</h1>
          </div>

          <div className="flex-1 lg:overflow-y-auto no-scrollbar">
            <OptionsPanel />
          </div>

          {/* Sticky price bar */}
          <div className="bg-ink text-white px-5 py-4 border-t-2 border-brand">
            <div className="flex items-end justify-between mb-3">
              <div>
                <p className="text-[0.7rem] uppercase tracking-widest text-white/50">Build Total</p>
                <p className="display text-3xl leading-none">{fmt(total)}</p>
                <p className="text-[0.7rem] text-white/50 mt-1">
                  Base {fmt(model.basePrice)} + {fmt(opts)} upgrades
                </p>
              </div>
            </div>
            <button onClick={() => setQuoteOpen(true)} className="btn btn-brand w-full">
              Request Custom Quote
            </button>
          </div>
        </div>
      </div>

      {quoteOpen && <QuoteModal onClose={() => setQuoteOpen(false)} />}
    </div>
  );
}

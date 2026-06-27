"use client";

import { useState } from "react";
import {
  useConfig,
  getModel,
  buildLines,
  optionsTotal,
  totalPrice,
  fmt,
} from "@/lib/configurator/store";
import { site } from "@/lib/site";

export default function QuoteModal({ onClose }: { onClose: () => void }) {
  const { modelId, selection } = useConfig();
  const model = getModel(modelId);
  const lines = buildLines(modelId, selection).filter((l) => l.price > 0);
  const total = totalPrice(modelId, selection);
  const [sent, setSent] = useState(false);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-paper w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-ink text-white px-6 py-5 flex items-center justify-between sticky top-0 z-10">
          <div>
            <p className="text-xs uppercase tracking-widest text-brand font-bold">Your Build</p>
            <h3 className="display text-xl">{model.make} {model.model}</h3>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white" aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>

        {sent ? (
          <div className="p-10 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-brand/10 grid place-items-center mb-4">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand)" strokeWidth="2.5">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="display text-2xl mb-2">Build Submitted</h4>
            <p className="text-muted max-w-sm mx-auto">
              Thanks! A Watts build specialist will reach out with your custom quote. You can also
              call <a href={`tel:${site.phoneSales}`} className="text-brand font-bold">{site.phoneSales}</a> to talk now.
            </p>
            <button onClick={onClose} className="btn btn-dark mt-6">Close</button>
          </div>
        ) : (
          <div className="p-6">
            {/* Summary */}
            <div className="border border-line">
              <div className="flex justify-between px-4 py-3 bg-canvas">
                <span className="text-sm font-bold">{model.make} {model.model} {model.trim}</span>
                <span className="text-sm font-bold">{fmt(model.basePrice)}</span>
              </div>
              <div className="divide-y divide-line">
                {lines.length === 0 && (
                  <div className="px-4 py-3 text-sm text-muted">No upgrades selected yet.</div>
                )}
                {lines.map((l) => (
                  <div key={l.groupId} className="flex justify-between px-4 py-2.5 text-sm">
                    <span className="text-ink">
                      <span className="text-muted">{l.label}:</span> {l.value}
                      {l.brand && <span className="text-muted"> · {l.brand}</span>}
                    </span>
                    <span className="font-bold text-brand whitespace-nowrap">+{fmt(l.price)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between px-4 py-3 bg-ink text-white">
                <span className="text-xs uppercase tracking-widest font-bold self-center">Build Total</span>
                <span className="display text-2xl">{fmt(total)}</span>
              </div>
            </div>
            <p className="text-[0.7rem] text-muted mt-2">
              Estimated build price. Upgrades total {fmt(optionsTotal(modelId, selection))}. Final quote
              confirmed by a Watts specialist; not an offer of credit.
            </p>

            {/* Lead form */}
            <form
              className="mt-5 grid sm:grid-cols-2 gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <input required placeholder="First Name" className="input" />
              <input required placeholder="Last Name" className="input" />
              <input required type="email" placeholder="Email" className="input" />
              <input required type="tel" placeholder="Phone" className="input" />
              <textarea placeholder="Notes (timeline, trade-in, questions)…" className="input sm:col-span-2 min-h-20" />
              <button type="submit" className="btn btn-brand sm:col-span-2">
                Request My Custom Quote
              </button>
            </form>
          </div>
        )}
      </div>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          border: 1px solid var(--color-line);
          padding: 0.7rem 0.85rem;
          font-size: 0.9rem;
          background: #fff;
        }
        :global(.input:focus) {
          outline: none;
          border-color: var(--color-brand);
          box-shadow: 0 0 0 1px var(--color-brand);
        }
      `}</style>
    </div>
  );
}
